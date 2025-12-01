# Employee Wallet Management System - Backend

Backend API for managing employee wallets with encrypted private key storage.

## Setup

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

**Required Variables:**
- `THIRDWEB_SECRET_KEY`: Get from https://thirdweb.com/dashboard (Settings → Secret Key)
- `ENCRYPTION_KEY`: Must be exactly 32 characters (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex').slice(0,32))"`)
- `JWT_SECRET`: Minimum 32 characters for security
- `ADMIN_EMAIL`: Email for default admin account
- `ADMIN_PASSWORD`: Password for default admin (change after first login!)

### 3. Initialize Database
```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Start Server
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## API Endpoints

### Authentication

#### Admin Login
```http
POST /api/auth/admin/login
Content-Type: application/json

{
  "email": "admin@company.com",
  "password": "your_password"
}
```

Response:
```json
{
  "token": "jwt_token_here",
  "admin": {
    "email": "admin@company.com",
    "role": "admin"
  }
}
```

### Wallet Management

#### Create Employee Wallet (Admin Only)
```http
POST /api/wallets/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "emp1@company.com"
}
```

#### Get Wallet Info
```http
GET /api/wallets/:email
Authorization: Bearer {token}
```

#### List All Wallets (Admin Only)
```http
GET /api/wallets
Authorization: Bearer {token}
```

#### Export Private Key (Admin Only)
```http
POST /api/wallets/export/:email
Authorization: Bearer {token}
```

## Security

- Private keys are encrypted with AES-256-GCM before storage
- All sensitive operations are logged in audit_logs table
- JWT tokens expire after 24 hours
- Admin-only endpoints protected with role-based access control

## Database Schema

- `employees`: email, wallet_address, encrypted_private_key, iv, auth_tag
- `admins`: email, password_hash, role
- `audit_logs`: action, employee_email, admin_email, ip_address, timestamp

## Architecture

```
src/
├── config/
│   ├── encryption.ts    # AES-256-GCM encryption
│   └── thirdweb.ts      # Thirdweb client
├── db/
│   └── client.ts        # Prisma client
├── middleware/
│   └── auth.ts          # JWT authentication
├── routes/
│   ├── auth.ts          # Login endpoints
│   └── wallet.ts        # Wallet CRUD
├── utils/
│   └── audit.ts         # Audit logging
└── index.ts             # Express server
```

## Production Deployment

1. Use PostgreSQL instead of SQLite
2. Store `ENCRYPTION_KEY` in AWS KMS or equivalent
3. Enable HTTPS/TLS
4. Set up monitoring (Sentry, DataDog)
5. Regular database backups
6. Implement rate limiting
7. Add 2FA for admin access
