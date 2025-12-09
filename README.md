# 🦅 Crowly - Secure Multi-Chain Crypto Wallet

> A modern, secure cryptocurrency wallet with AI-powered assistance, real blockchain integration, and beautiful user experience.

demo link: https://github.com/user-attachments/assets/2571a27a-95bc-48a5-a38f-4699b676744d



[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ Features

### 🌐 Multi-Chain Support
- **Ethereum Mainnet** - Full ERC-20 token support with real RPC integration
- **Sepolia Testnet** - Test your transactions risk-free
- **TRON** - TRC-20 tokens (coming soon)
- **Bitcoin** - Native BTC transactions (coming soon)
- **Solana** - SPL tokens (coming soon)

### 🤖 AI-Powered Assistant (Crow)
- **Google Gemini 2.5 Flash** powered chatbot
- Real-time streaming responses
- Security tips and transaction guidance
- Gas fee optimization suggestions
- Multi-language support (Turkish, English)

### 🔐 Enterprise-Grade Security
- **Client-Side Encryption** - Seed phrases never leave your device
- **Web Crypto API** - AES-256-GCM encryption with PBKDF2 (100k iterations)
- **BIP-39 Compliant** - Standard 12-word seed phrase generation
- **Password Protection** - Encrypted local storage with user password
- **No Database** - Fully client-side wallet management

### 💎 Core Features
- ✅ **Real Blockchain Integration** - ethers.js v6 for Ethereum transactions
- ✅ **Testnet/Mainnet Toggle** - Seamless network switching
- ✅ **Transaction History** - Local storage with last 50 transactions
- ✅ **Real-Time Balance** - Direct RPC queries to publicnode.com
- ✅ **Gas Fee Estimation** - Live network gas prices
- ✅ **QR Code Generation** - Easy address sharing
- ✅ **Payment Request URLs** - Pre-filled transaction links
- ✅ **Transaction Notifications** - Success/error feedback with explorer links
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Dark Theme** - Professional glass-morphism UI

---

## 🏗️ Architecture

### Frontend Stack
```
React 18.2.0          → UI Framework
Vite 5.0.0            → Build Tool & Dev Server
React Router 6.28.0   → Client-side Routing
Tailwind CSS 3.4.6    → Utility-first Styling
Framer Motion 10.16.4 → Smooth Animations
ethers.js 6.13.0      → Ethereum Blockchain Library
Lucide React          → Icon System
```

### Backend Stack
```
Node.js 18+           → Runtime
Express 4.18.2        → REST API Framework
Winston               → Logging
Axios                 → HTTP Client
```

### Security Architecture
```
Web Crypto API        → Browser-native encryption
PBKDF2                → Key derivation (100,000 iterations)
AES-256-GCM           → Symmetric encryption
BIP-39                → Seed phrase generation
No Database           → Client-side only storage
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18 or higher
- **npm** 8 or higher
- **Google Gemini API Key** (for AI chatbot)

### 1. Clone Repository
```bash
git clone https://github.com/SkyL0RC/Crowly.git
cd Crowly
```

### 2. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 3. Environment Setup

**Backend** (`backend/.env`):
```env
PORT=3000
NODE_ENV=development

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# CORS
FRONTEND_URL=http://localhost:4028

# Price Update Interval (milliseconds)
PRICE_UPDATE_INTERVAL=300000
```

**Frontend** (`.env` or create if not exists):
```env
VITE_API_URL=http://localhost:3000/api
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Get Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with Google account
3. Create new API key
4. Copy and paste into `.env` files

### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Access Application:**
- Frontend: http://localhost:4028
- Backend: http://localhost:3000

---

## 📱 User Guide

### Creating Your Wallet

1. **Visit Homepage** → Click "Create New Wallet"
2. **Save Seed Phrase** → Write down 12 words (never share!)
3. **Verify Seed Phrase** → Select correct words in order
4. **Set Password** → Enter strong password (min 8 characters)
5. **Done!** → Your wallet is created and encrypted locally

### Logging In

1. **Click "Login here"** on landing page
2. **Enter Password** → Your seed phrase is decrypted locally
3. **Access Dashboard** → View balances and manage crypto

### Sending Transactions

1. Navigate to **Send** page
2. Select **Network** (Testnet/Mainnet)
3. Enter **Recipient Address** (0x... format)
4. Enter **Amount** in ETH
5. Review **Gas Fee** estimate
6. Enter **Password** to sign transaction
7. Transaction broadcasts to blockchain
8. View in **Transaction History**

### Network Switching

- Click **Testnet/Mainnet** toggle in header
- Balance auto-refreshes for selected network
- Orange dot = Testnet, Green dot = Mainnet

### AI Chatbot (Crow)

- Click **Crow mascot** on dashboard
- Ask questions about:
  - How to send transactions
  - Gas fee explanations
  - Security best practices
  - Network comparisons
  - Wallet features

---

## 🗂️ Project Structure

```
Crowly/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Header.jsx      # Navigation with network toggle
│   │   ├── AppIcon.jsx     # Lucide icon wrapper
│   │   └── ui/             # Button, Input, Select components
│   │
│   ├── pages/
│   │   ├── landing-page/   # Homepage with hero section
│   │   ├── wallet-creation/ # Create/Import/Login flows
│   │   ├── user-dashboard/ # Main dashboard with AI chatbot
│   │   ├── send-transfer/  # Send crypto page
│   │   ├── receive/        # QR code & address display
│   │   └── NotFound.jsx    # 404 page
│   │
│   ├── services/
│   │   ├── api/            # Backend API client
│   │   ├── geminiClient.js # Google Gemini AI setup
│   │   └── crowAssistantService.js # Chatbot logic
│   │
│   ├── utils/
│   │   ├── secureStorage.js      # Encryption/decryption
│   │   └── transactionSigner.js  # Ethereum transaction signing
│   │
│   ├── contexts/
│   │   └── NetworkContext.jsx    # Testnet/Mainnet state
│   │
│   ├── styles/
│   │   └── index.css       # Global styles & Tailwind
│   │
│   ├── App.jsx             # Root component
│   ├── Routes.jsx          # React Router setup
│   └── index.jsx           # Entry point
│
├── backend/
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic (in-memory storage)
│   │   └── server.js       # Express app
│   │
│   └── package.json
│
├── public/
│   ├── crow.png            # Logo/mascot image
│   └── vite.svg
│
├── package.json
├── vite.config.mjs
├── tailwind.config.js
└── README.md
```

---

## 🔐 Security Best Practices

### For Users
- ✅ **Backup Seed Phrase** - Write on paper, store in safe place
- ✅ **Strong Password** - Use 12+ characters with symbols
- ✅ **Verify Addresses** - Always double-check recipient addresses
- ✅ **Start with Testnet** - Practice with Sepolia before mainnet
- ❌ **Never Share Seed Phrase** - Not even with support
- ❌ **Don't Screenshot** - Seed phrases should not be digital

### Technical Security
- All seed phrases encrypted with **AES-256-GCM**
- Key derivation uses **100,000 PBKDF2 iterations**
- No backend storage of private keys or seed phrases
- Transaction signing happens **client-side only**
- RPC endpoints use **CORS-enabled public nodes**

---

## 🌐 Network Configuration

### Ethereum Mainnet
- **Chain ID:** 1
- **RPC:** https://ethereum-rpc.publicnode.com
- **Explorer:** https://etherscan.io

### Sepolia Testnet
- **Chain ID:** 11155111
- **RPC:** https://ethereum-sepolia-rpc.publicnode.com
- **Explorer:** https://sepolia.etherscan.io
- **Faucet:** https://sepoliafaucet.com

---

## 🛠️ Development

### Build for Production
```bash
# Frontend
npm run build
npm run preview

# Backend
cd backend
npm start
```

### Code Quality
```bash
# Lint check
npm run lint

# Format code
npx prettier --write "src/**/*.{js,jsx}"
```

### Environment Variables Reference

**Frontend:**
- `VITE_API_URL` - Backend API endpoint
- `VITE_GEMINI_API_KEY` - Google Gemini API key

**Backend:**
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `GEMINI_API_KEY` - Google Gemini API key
- `FRONTEND_URL` - CORS allowed origin
- `PRICE_UPDATE_INTERVAL` - Token price refresh rate (ms)

---

## 🧪 Testing Guide

### Manual Testing Checklist

**Wallet Creation:**
- [ ] Generate new wallet
- [ ] Save 12-word seed phrase
- [ ] Verify seed phrase
- [ ] Set password (8+ chars)
- [ ] Access dashboard

**Login System:**
- [ ] Click "Login here" link
- [ ] Enter correct password
- [ ] Dashboard loads with balance

**Network Switching:**
- [ ] Toggle Testnet ↔ Mainnet
- [ ] Balance refreshes automatically
- [ ] Network indicator updates

**Send Transaction (Testnet):**
- [ ] Get Sepolia ETH from faucet
- [ ] Enter valid 0x address
- [ ] Enter amount (< balance)
- [ ] Gas fee displays
- [ ] Password confirmation
- [ ] Transaction broadcasts
- [ ] View on Sepolia explorer

**AI Chatbot:**
- [ ] Open Crow chat panel
- [ ] Send message
- [ ] Streaming response works
- [ ] Quick actions work
- [ ] Chat stays open (doesn't close unexpectedly)

---

## 🐛 Known Issues & Troubleshooting

### Chatbot Closes Unexpectedly
**Fixed!** - Component memoization added to prevent re-renders

### "No wallet found" Error
1. Check browser console (F12) for errors
2. Verify localStorage has `crowdk_encrypted_wallet`
3. If corrupt, run: `localStorage.clear()` and create new wallet

### Transaction Fails
1. Ensure sufficient balance (amount + gas fee)
2. Verify correct network selected
3. Check address format (starts with 0x, 42 chars)
4. Try again with higher gas fee

### Balance Shows 0.00 ETH
1. Confirm wallet has funds (check on Etherscan)
2. Verify network mode (Testnet vs Mainnet)
3. Wait for RPC to sync (may take 10-30 seconds)
4. Check browser console for RPC errors

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** Pull Request

### Contribution Guidelines
- Follow existing code style (Tailwind CSS, ESLint)
- Add comments for complex logic
- Test thoroughly before PR
- Update README if adding features

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini** - AI-powered chatbot
- **ethers.js** - Ethereum library
- **publicnode.com** - Free RPC endpoints
- **Lucide Icons** - Beautiful icon set
- **Tailwind CSS** - Utility-first CSS framework

---

## 📞 Support

- **GitHub Issues:** [Report bugs or request features](https://github.com/SkyL0RC/Crowly/issues)
- **Email:** [Add your email]
- **Discord:** [Add Discord invite if available]

---

## 🎯 Roadmap

### ✅ Completed
- [x] Wallet creation & import
- [x] Password-based encryption
- [x] Testnet/Mainnet support
- [x] Real Ethereum transactions
- [x] Transaction history
- [x] AI chatbot integration
- [x] Payment request URLs
- [x] Responsive design

### 🚧 In Progress
- [ ] TRON network integration
- [ ] Bitcoin support
- [ ] Solana support
- [ ] Multi-wallet management

### 📋 Planned
- [ ] Hardware wallet support (Ledger, Trezor)
- [ ] NFT gallery
- [ ] DeFi integrations (Uniswap, etc.)
- [ ] Multi-language UI
- [ ] Mobile app (React Native)
- [ ] Browser extension

---

<div align="center">

**Built with ❤️ by the Crowly Team**

[⭐ Star this repo](https://github.com/SkyL0RC/Crowly) | [🐛 Report bug](https://github.com/SkyL0RC/Crowly/issues) | [💡 Request feature](https://github.com/SkyL0RC/Crowly/issues)

</div>
