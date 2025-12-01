# Thirdweb Configuration Guide

## How to Get Your Thirdweb Client ID

### Step 1: Access Thirdweb Dashboard
1. Visit [https://thirdweb.com/dashboard](https://thirdweb.com/dashboard)
2. Sign in with your Google account or email

### Step 2: Create a Project
1. Click **"Create Project"** or select an existing project
2. Give your project a name (e.g., "InAppWallet Demo")
3. Click **"Create"**

### Step 3: Get Your Client ID
1. In your project dashboard, navigate to **Settings**
2. Find the **"Client ID"** section
3. Copy your Client ID (it looks like: `abc123def456...`)

### Step 4: Enable In-App Wallet Features
1. Go to **"In-App Wallets"** section in your project settings
2. Enable **"Email"** and **"Google"** authentication methods
3. Configure OAuth settings (follow Thirdweb's prompts)
4. Save your settings

### Step 5: Update Your Code
1. Open `src/App.jsx` in the project
2. Find this line:
   ```javascript
   const CLIENT_ID = 'YOUR_CLIENT_ID'
   ```
3. Replace `'YOUR_CLIENT_ID'` with your copied Client ID:
   ```javascript
   const CLIENT_ID = 'abc123def456...'
   ```
4. Save the file

### Step 6: Run the App
```bash
npm run dev
```

## Understanding Thirdweb In-App Wallets

### What is an In-App Wallet?
- A **custodial-like** wallet created and managed via Thirdweb
- Users authenticate with **Email** or **Social login** (Google, Facebook)
- Thirdweb handles key management securely
- Users can **export their private key** for self-custody

### How It Differs from MetaMask
| Feature | MetaMask (External) | In-App Wallet |
|---------|---------------------|---------------|
| Setup | Manual install | 1-click creation |
| Login | Manual unlock | Email/Social auth |
| Key Management | User managed | Thirdweb managed (exportable) |
| UX | Complex | Simplified |

### Use Cases
✅ **Onboarding new users** - No crypto wallet required
✅ **Gaming** - Quick account creation
✅ **dApps** - Reduce friction for non-crypto users
✅ **Multi-device** - Access wallet from any device

## Private Key Export Flow

### What Happens When You Export?
1. User clicks **"Export Private Key"** button
2. Thirdweb SDK retrieves the encrypted private key
3. The key is decrypted client-side using the user's authentication
4. The **plain text private key** is displayed
5. User can copy and import into MetaMask

### Security Considerations
⚠️ **The private key grants full access to the wallet**

**Best Practices:**
- Only export for backup purposes
- Never share the key with anyone
- Store offline in a secure location
- Consider using a hardware wallet for long-term storage

### Import to MetaMask
1. Open MetaMask
2. Click account icon → **"Import Account"**
3. Select **"Private Key"**
4. Paste the exported private key
5. Click **"Import"**

## API Reference

### Creating an In-App Wallet
```javascript
const wallet = inAppWallet({
  auth: {
    options: ['email', 'google', 'facebook'],
  },
})

const account = await wallet.connect({
  client,
  strategy: 'google', // or 'email'
})
```

### Exporting Private Key
```javascript
const privateKey = await wallet.export({
  client,
  strategy: 'privateKey',
})
```

## Resources

- [Thirdweb In-App Wallet Docs](https://portal.thirdweb.com/react/v5/wallets/in-app-wallet)
- [Authentication Methods](https://portal.thirdweb.com/react/v5/wallets/in-app-wallet/how-it-works)
- [Thirdweb Dashboard](https://thirdweb.com/dashboard)

---

Need help? Check the [Thirdweb Discord](https://discord.gg/thirdweb) or [Support Docs](https://portal.thirdweb.com)
