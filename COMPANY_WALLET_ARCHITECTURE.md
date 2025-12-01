# Company Wallet Management Architecture

## Your Use Case
A company needs to create and manage wallets for employees (emp1, emp2, emp3) where:
- ✅ Company creates wallets for employees
- ✅ Company stores private keys securely
- ✅ Company can perform transactions on behalf of employees
- ✅ Employees can export their keys if needed

## ⚠️ Problem with Current In-App Wallet Approach

**In-App Wallets are NON-CUSTODIAL**
- Each employee creates their own wallet
- Only THEY can access the private key
- You (the company) CANNOT get the private key
- ❌ **This doesn't work for your use case!**

## ✅ Solution: Server-Side Private Key Wallets

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Your Backend Server                   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Employee Wallet Management               │  │
│  │                                                  │  │
│  │  emp1@company.com → Wallet + Private Key        │  │
│  │  emp2@company.com → Wallet + Private Key        │  │
│  │  emp3@company.com → Wallet + Private Key        │  │
│  │                                                  │  │
│  │  Private Keys stored ENCRYPTED in database      │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │              API Endpoints                       │  │
│  │                                                  │  │
│  │  POST /api/create-employee-wallet                │  │
│  │  GET  /api/employee-wallet/:email                │  │
│  │  POST /api/send-transaction/:email               │  │
│  │  GET  /api/export-private-key/:email             │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
                    Blockchain
```

### Implementation Steps

#### 1. Backend: Create Employee Wallets

```javascript
// backend/api/create-employee-wallet.js
import { privateKeyToAccount } from 'thirdweb/wallets'
import { generatePrivateKey } from 'thirdweb/wallets'
import { createThirdwebClient } from 'thirdweb'

const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY, // Server-side secret key
})

export async function createEmployeeWallet(email) {
  // Generate a new private key
  const privateKey = generatePrivateKey()
  
  // Create account from private key
  const account = privateKeyToAccount({
    client,
    privateKey,
  })
  
  const walletAddress = account.address
  
  // Store in database (ENCRYPTED!)
  await db.employeeWallets.create({
    email: email,
    walletAddress: walletAddress,
    privateKey: encrypt(privateKey), // Encrypt before storing!
    createdAt: new Date(),
  })
  
  return {
    email: email,
    walletAddress: walletAddress,
  }
}
```

#### 2. Backend: Send Transactions for Employees

```javascript
// backend/api/send-transaction.js
import { privateKeyToAccount } from 'thirdweb/wallets'
import { sendTransaction } from 'thirdweb'
import { prepareContractCall } from 'thirdweb'

export async function sendTransactionForEmployee(email, to, amount) {
  // Get employee wallet from database
  const employeeWallet = await db.employeeWallets.findOne({ email })
  
  // Decrypt private key
  const privateKey = decrypt(employeeWallet.privateKey)
  
  // Create account
  const account = privateKeyToAccount({
    client,
    privateKey,
  })
  
  // Send transaction
  const transaction = await sendTransaction({
    account,
    to: to,
    value: amount,
    chain: ethereum,
  })
  
  return transaction
}
```

#### 3. Backend: Export Private Key (For Employees)

```javascript
// backend/api/export-private-key.js
export async function exportPrivateKey(email, adminAuthenticated) {
  // ⚠️ Security: Only allow with proper authentication!
  if (!adminAuthenticated) {
    throw new Error('Unauthorized')
  }
  
  const employeeWallet = await db.employeeWallets.findOne({ email })
  const privateKey = decrypt(employeeWallet.privateKey)
  
  // Log this action!
  await db.auditLogs.create({
    action: 'PRIVATE_KEY_EXPORTED',
    email: email,
    timestamp: new Date(),
  })
  
  return {
    email: email,
    walletAddress: employeeWallet.walletAddress,
    privateKey: privateKey, // ⚠️ Handle with extreme care!
  }
}
```

#### 4. Frontend: Employee Dashboard

```javascript
// Employee view - Shows their wallet, no private key access
function EmployeeDashboard({ email }) {
  const [walletInfo, setWalletInfo] = useState(null)
  
  useEffect(() => {
    fetch(`/api/employee-wallet/${email}`)
      .then(res => res.json())
      .then(data => setWalletInfo(data))
  }, [email])
  
  return (
    <div>
      <h2>Your Company Wallet</h2>
      <p>Email: {email}</p>
      <p>Wallet Address: {walletInfo?.walletAddress}</p>
      <p>Balance: {walletInfo?.balance} ETH</p>
      
      <button onClick={requestPrivateKeyExport}>
        Request Private Key Export (Requires Admin Approval)
      </button>
    </div>
  )
}
```

## 🔒 Security Best Practices

### 1. **Encrypt Private Keys**
```javascript
import crypto from 'crypto'

const algorithm = 'aes-256-gcm'
const secretKey = process.env.ENCRYPTION_KEY // 32 bytes

function encrypt(text) {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv)
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag()
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
  }
}

function decrypt(encryptedData) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(encryptedData.iv, 'hex')
  )
  
  decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'))
  
  let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}
```

### 2. **Environment Variables**
```bash
# .env (NEVER commit this!)
THIRDWEB_CLIENT_ID=your_client_id
THIRDWEB_SECRET_KEY=your_secret_key
ENCRYPTION_KEY=your_32_byte_encryption_key
DATABASE_URL=your_database_url
```

### 3. **Database Schema**
```sql
CREATE TABLE employee_wallets (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  wallet_address VARCHAR(42) NOT NULL,
  encrypted_private_key TEXT NOT NULL, -- Encrypted!
  iv TEXT NOT NULL,
  auth_tag TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  last_used TIMESTAMP
);

CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  action VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  admin_email VARCHAR(255),
  timestamp TIMESTAMP DEFAULT NOW(),
  ip_address VARCHAR(45)
);
```

## 📊 Comparison: In-App Wallet vs Private Key Wallet

| Feature | In-App Wallet | Private Key Wallet |
|---------|---------------|-------------------|
| **Who controls keys?** | Individual user | Your backend server |
| **Programmatic access?** | ❌ No | ✅ Yes |
| **Export for users?** | ✅ Via UI only | ✅ Via API (with auth) |
| **Best for** | Consumer apps | Enterprise/Company apps |
| **Security responsibility** | Thirdweb | You |

## 🚀 Full Implementation Example

I can create a complete example with:
1. ✅ Backend API (Node.js/Express)
2. ✅ Database setup (PostgreSQL)
3. ✅ Frontend employee dashboard
4. ✅ Admin panel for managing wallets
5. ✅ Private key encryption/decryption
6. ✅ Transaction sending on behalf of employees

Would you like me to build this complete system?

## ⚠️ Important Notes

1. **You are responsible for securing private keys** - This is a huge responsibility
2. **Use hardware security modules (HSM)** for production
3. **Implement strict access controls** - Not everyone should export keys
4. **Audit all key access** - Log every time a private key is accessed
5. **Regular security audits** - Have experts review your system

## Alternative: Smart Contract Wallets

If you want employees to own their keys BUT you still have some control:

```javascript
// Use Account Abstraction
const smartWallet = smartWallet({
  chain: ethereum,
  sponsorGas: true,
  factoryAddress: "0x...", // Your factory
})

// Employee creates wallet (they own it)
// Company can sponsor gas, set spending limits, etc.
```

---

**Next Steps**: Tell me which approach you prefer, and I'll build the complete system for you!
