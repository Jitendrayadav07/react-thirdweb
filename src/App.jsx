import { useState } from 'react'
import { createThirdwebClient } from 'thirdweb'
import { ConnectButton, useActiveAccount, useActiveWallet } from 'thirdweb/react'
import { inAppWallet, createWallet } from 'thirdweb/wallets'
import { ethereum, polygon, avalanche, bsc, arbitrum, optimism, base } from 'thirdweb/chains'
import './App.css'

// Replace with your Thirdweb Client ID from https://thirdweb.com/dashboard
const CLIENT_ID = 'c49cab79cd1c1579296619c4d7df472d'

const client = createThirdwebClient({
  clientId: CLIENT_ID,
})

function App() {
  const mainAccount = useActiveAccount()
  const activeWallet = useActiveWallet()

  // Wallet configuration with both external and in-app wallets
  const wallets = [
    createWallet('io.metamask'),
    createWallet('com.coinbase.wallet'),
    createWallet('com.trustwallet.app'),
    inAppWallet({
      auth: {
        options: ['email', 'google', 'facebook', 'passkey'],
      },
    }),
  ]

  return (
    <div className="app-container">
      <div className="header">
        <h1>🔐 Thirdweb Wallet Demo</h1>
        <p className="subtitle">Connect your wallet & manage your account securely</p>
      </div>

      <div className="wallet-section">
        <div className="wallet-card main-card">
          <h2>💼 Connect Wallet</h2>
          <p>
            Connect with MetaMask/Coinbase <strong>or</strong> create a new wallet with Email/Google (1-click)
          </p>

          <div className="connect-wrapper">
            <ConnectButton
              client={client}
              wallets={wallets}
              chains={[ethereum, polygon, avalanche, bsc, arbitrum, optimism, base]}
              theme="dark"
              connectModal={{
                size: 'wide',
                title: 'Connect to App',
                showThirdwebBranding: false,
              }}
              detailsModal={{
                showBalances: true,
                showTokens: true,
              }}
            />
          </div>

          {mainAccount && (
            <div className="wallet-info">
              <p><strong>✅ Connected Wallet:</strong></p>
              <code>{mainAccount.address}</code>

              <div className="info-box">
                <p className="info-title">ℹ️ How to Export Private Key:</p>
                <ol className="steps-list">
                  <li>Click on your wallet address above</li>
                  <li>Select <strong>"Manage Wallet"</strong></li>
                  <li>Choose <strong>"Export Private Key"</strong></li>
                  <li>Confirm and copy your private key</li>
                  <li>Import into MetaMask or any wallet app</li>
                </ol>
                <div className="warning-tag">
                  ⚠️ <strong>Security:</strong> Thirdweb prevents programmatic private key export for your safety. You must export manually through the wallet UI.
                </div>
              </div>
            </div>
          )}

          {!mainAccount && (
            <div className="features">
              <h3>✨ Features:</h3>
              <ul>
                <li>🔗 <strong>External Wallets:</strong> MetaMask, Coinbase, Trust Wallet</li>
                <li>⚡ <strong>In-App Wallets:</strong> Create with Email, Google, or Passkey</li>
                <li>🔑 <strong>Export Keys:</strong> Full ownership - export your private key anytime</li>
                <li>🎨 <strong>Modern UI:</strong> Premium dark-mode interface</li>
              </ul>
            </div>
          )}
        </div>

        <div className="wallet-card info-card">
          <h2>📚 About In-App Wallets</h2>

          <div className="feature-item">
            <h3>🚀 What are In-App Wallets?</h3>
            <p>
              Create a blockchain wallet using just your email or social login - no seed phrases needed!
              Thirdweb manages the keys securely, but you always have the option to export.
            </p>
          </div>

          <div className="feature-item">
            <h3>🔐 How Does Export Work?</h3>
            <p>
              For security, Thirdweb does <strong>not</strong> allow apps to programmatically access your private key.
              Only YOU can reveal it through the secure wallet modal.
            </p>
          </div>

          <div className="feature-item">
            <h3>💡 Why Use This?</h3>
            <ul className="benefits-list">
              <li>✅ <strong>Easy onboarding</strong> for non-crypto users</li>
              <li>✅ <strong>No seed phrases</strong> to remember or lose</li>
              <li>✅ <strong>Full ownership</strong> with export capability</li>
              <li>✅ <strong>Multi-device</strong> access with same login</li>
            </ul>
          </div>

          <div className="comparison">
            <h3>🔎 Comparison</h3>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>MetaMask</th>
                  <th>In-App Wallet</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Setup</td>
                  <td>Extension + Seed phrase</td>
                  <td>Email/Google login</td>
                </tr>
                <tr>
                  <td>Key Storage</td>
                  <td>User managed</td>
                  <td>Thirdweb managed*</td>
                </tr>
                <tr>
                  <td>Export</td>
                  <td>Via settings</td>
                  <td>Via wallet modal</td>
                </tr>
                <tr>
                  <td>Recovery</td>
                  <td>Seed phrase</td>
                  <td>Email/Social login</td>
                </tr>
              </tbody>
            </table>
            <p className="table-note">* You can export anytime for self-custody</p>
          </div>
        </div>
      </div>

      <div className="footer-note">
        <p>
          <strong>Note:</strong> The Unity SDK documentation you referenced is for game development, not web apps.
          This React implementation uses Thirdweb's React SDK v5, which has different APIs and security models.
        </p>
      </div>
    </div>
  )
}

export default App
