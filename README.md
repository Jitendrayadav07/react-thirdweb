# 🔐 Thirdweb In-App Wallet Demo

A React application demonstrating Thirdweb's In-App Wallet functionality with private key export, similar to ArenaPro's implementation.

## Features

✅ **Main Wallet Connection** - Connect MetaMask or other external wallets
✅ **In-App Wallet (1-Click)** - Create smart wallets using Google/Email authentication  
✅ **Private Key Export** - Export and backup your in-app wallet's private key
✅ **Premium UI** - Modern dark-mode interface with glassmorphism and smooth animations

## Prerequisites

1. **Node.js** (v20.19+ or v22.12+ recommended)
2. **Thirdweb Client ID** from [Thirdweb Dashboard](https://thirdweb.com/dashboard)

## Setup Instructions

### 1. Get Your Thirdweb Client ID

1. Go to [https://thirdweb.com/dashboard](https://thirdweb.com/dashboard)
2. Sign in or create an account
3. Create a new project
4. Copy your Client ID

### 2. Configure the App

Open `src/App.jsx` and replace the placeholder:

```javascript
const CLIENT_ID = 'YOUR_CLIENT_ID' // Replace with your actual Client ID
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## How It Works

### Architecture

```
Main Wallet (MetaMask)
    ↓
User Connects
    ↓
Creates In-App Wallet (via Google/Email)
    ↓
Smart Wallet Generated
    ↓
Export Private Key (for backup)
```

### Thirdweb SDK Components Used

1. **`ThirdwebProvider`** - Wraps the app to enable Thirdweb features
2. **`createThirdwebClient`** - Initializes the Thirdweb SDK with your Client ID
3. **`ConnectButton`** - Pre-built UI for wallet connection
4. **`inAppWallet`** - Creates in-app wallets with social/email authentication
5. **`useActiveAccount`** - Hook to get the connected wallet account
6. **Export API** - Exports the private key from the in-app wallet

### Key Files

- **`src/main.jsx`** - ThirdwebProvider setup
- **`src/App.jsx`** - Main application logic
- **`src/App.css`** - Premium UI styling

## Usage Flow

1. **Connect Main Wallet**
   - Click "Connect Wallet" 
   - Choose MetaMask or other wallet
   - Approve connection

2. **Create In-App Wallet**
   - Click "Create In-App Wallet"
   - Choose Google or Email login
   - Complete authentication
   - New wallet address is displayed

3. **Export Private Key**
   - Click "Export Private Key"
   - **Warning**: Never share this key!
   - Copy the key for backup
   - Import into MetaMask/other wallets

## Security Notes

⚠️ **CRITICAL**: Never share your private key with anyone!

- The private key gives full access to your wallet
- Only export for backup purposes
- Store securely offline
- To import: Use MetaMask → Import Account → Private Key

## Documentation

- [Thirdweb In-App Wallet Docs](https://portal.thirdweb.com/react/v5/wallets/in-app-wallet)
- [Thirdweb React SDK](https://portal.thirdweb.com/react/v5)
- [Private Key Management](https://portal.thirdweb.com/unity/v5/wallets/private-key)

## Troubleshooting

### "Invalid Client ID" Error
- Verify you've replaced `YOUR_CLIENT_ID` with your actual Thirdweb Client ID
- Check the Client ID is from https://thirdweb.com/dashboard

### In-App Wallet Not Creating
- Ensure you've configured authentication methods in Thirdweb Dashboard
- Check browser console for specific errors

### Node Version Issues
- Upgrade to Node.js v20.19+ or v22.12+
- Use `nvm` to manage Node versions: `nvm use 22`

## Technologies

- **React** + **Vite** - Fast modern development
- **Thirdweb SDK v5** - Web3 wallet infrastructure
- **CSS3** - Premium glassmorphism UI

## License

MIT

---

Built with ❤️ using Thirdweb SDK
