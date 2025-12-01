# Employee Wallet Management System - Complete Setup Guide

## ✅ Backend Status: COMPLETE

The backend API is fully implemented and ready to use!

### What's Been Built

1. **✅ Express API Server**
   - TypeScript-based REST API
   - CORS enabled for frontend integration
   - Health check endpoint

2. **✅ Database (SQLite with Prisma)**
   - Employee wallets table
   - Admin accounts table
   - Audit logs table

3. **✅ Encryption System**
   - AES-256-GCM for private keys
   - Unique IV and auth tag per wallet
   - Environment-based encryption key

4. **✅ Wallet Management**
   - Create wallets for employees
   - Retrieve wallet information
   - Export private keys (admin only)
   - List all wallets

5. **✅ Authentication & Authorization**
   - JWT-based auth
   - Admin login
   - Employee login
   - Role-based access control

6. **✅ Audit Logging**
   - All sensitive operations logged
   - Tracks who did what and when

## 🚀 Quick Start

### Step 1: Configure Environment

```bash
cd server
```

Edit `.env` file with your values:

```env
# Get from https://thirdweb.com/dashboard
THIRDWEB_SECRET_KEY=your_secret_key_here

# Generate with: node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
ENCRYPTION_KEY=abcd1234efgh5678ijkl9012mnop3456

# Any random 32+ character string
JWT_SECRET=your_very_long_and_secure_jwt_secret_here_minimum_32_chars

# Admin credentials
ADMIN_EMAIL=admin@company.com
ADMIN_PASSWORD=SecurePassword123!

# Database  
DATABASE_URL="file:./dev.db"
PORT=3001
```

### Step 2: Initialize Database

```bash
cd server
npx prisma generate
npx prisma migrate dev --name init
```

### Step 3: Start Backend

```bash
npm run dev
```

Server will start on `http://localhost:3001`

Default admin account:
- Email: `admin@company.com`
- Password: Whatever you set in `.env`

## 📋 Testing the API

### 1. Admin Login

```bash
curl -X POST http://localhost:3001/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"SecurePassword123!"}'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "email": "admin@company.com",
    "role": "admin"
  }
}
```

**Save the token!** You'll use it in the `Authorization: Bearer {token}` header.

### 2. Create Employee Wallet

```bash
curl -X POST http://localhost:3001/api/wallets/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"email":"emp1@company.com"}'
```

Response:
```json
{
  "success": true,
  "employee": {
    "email": "emp1@company.com",
    "walletAddress": "0x1234...5678",
    "createdAt": "2024-12-01T10:00:00.000Z"
  }
}
```

### 3. Get Wallet Info

```bash
curl http://localhost:3001/api/wallets/emp1@company.com \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Export Private Key

```bash
curl -X POST http://localhost:3001/api/wallets/export/emp1@company.com \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Response:
```json
{
  "email": "emp1@company.com",
  "walletAddress": "0x1234...5678",
  "privateKey": "0xabcd...ef12"
}
```

⚠️ **This private key gives FULL CONTROL** of the wallet!

### 5. List All Wallets

```bash
curl http://localhost:3001/api/wallets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔒 Security Checklist

Before going to production:

- [ ] Change `ADMIN_PASSWORD` from default
- [ ] Use PostgreSQL instead of SQLite
- [ ] Store `ENCRYPTION_KEY` in AWS KMS or similar
- [ ] Enable HTTPS/TLS
- [ ] Add rate limiting
- [ ] Set up monitoring (Sentry)
- [ ] Regular database backups
- [ ] Implement 2FA for admin
- [ ] Security audit

## 📊 Database Schema

```sql
-- Employees table
CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE,
  walletAddress TEXT,
  encryptedPrivateKey TEXT,
  iv TEXT,
  authTag TEXT,
  createdAt DATETIME,
  lastUsed DATETIME
);

-- Admins table
CREATE TABLE admins (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE,
  passwordHash TEXT,
  role TEXT,
  createdAt DATETIME
);

-- Audit logs table
CREATE TABLE audit_logs (
  id INTEGER PRIMARY KEY,
  action TEXT,
  employeeEmail TEXT,
  adminEmail TEXT,
  ipAddress TEXT,
  details TEXT,
  timestamp DATETIME
);
```

## 🎯 Next Steps: Frontend

The backend is ready! Now you can:

1. **Build Admin Dashboard** - React app for managing employees
2. **Build Employee Portal** - View wallet & request export
3. **Integrate with existing frontend** - Use the API endpoints

## 📚 API Reference

### Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/admin/login | None | Admin login |
| POST | /api/auth/employee/login | None | Employee login |
| POST | /api/wallets/create | Admin | Create wallet |
| GET | /api/wallets/:email | Auth | Get wallet info |
| GET | /api/wallets | Admin | List all wallets |
| POST | /api/wallets/export/:email | Admin | Export private key |

### Error Responses

```json
{
  "error": "Error message",
  "details": "Additional details"
}
```

Status codes:
- `400`: Bad request
- `401`: Unauthorized
- `403`: Forbidden (insufficient permissions)
- `404`: Not found
- `500`: Server error

## 🐛 Troubleshooting

### "ENCRYPTION_KEY must be exactly 32 characters"
Generate a proper key:
```bash
node -e "console.log(require('crypto').randomBytes(16).toString('base64').slice(0,32))"
```

### "THIRDWEB_SECRET_KEY is required"
Get your secret key from https://thirdweb.com/dashboard → Settings

### "Invalid credentials" on admin login
Check `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`

### Database errors
Re-run migrations:
```bash
npx prisma migrate reset
npx prisma migrate dev
```

## 📝 Audit Log Actions

The system logs these actions:
- `WALLET_CREATED` - New employee wallet created
- `PRIVATE_KEY_EXPORTED` - Private key was exported

View logs in the database:
```bash
npx prisma studio
```

Navigate to `audit_logs` table.

---

**🎉 Backend Setup Complete!**

The API is ready to manage employee wallets securely. You can now build the frontend or integrate with your existing application.
