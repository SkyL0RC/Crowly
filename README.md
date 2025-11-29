# 🦅 Crow WDK Wallet - Multi-Chain Cryptocurrency Wallet

A modern, secure multi-chain cryptocurrency wallet built with **Tether Wallet Development Kit (WDK)**, featuring AI-powered assistance and beautiful UI/UX.

![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-5.0.0-purple)

---

## 🚀 Features

### 🌐 Multi-Chain Support
- **Ethereum** - Full ERC-20 token support
- **TRON** - TRC-20 tokens and TRX transfers
- **Bitcoin** - Native BTC transactions
- **Solana** - SPL tokens and SOL transfers

### 🤖 AI Assistant (Crow)
- Powered by **Google Gemini 2.5 Flash**
- Real-time streaming chat responses
- Security tips and transaction guidance
- Multi-language support ready

### 🔐 Security Features
- Private keys never leave device
- 256-bit AES encryption
- BIP39 compliant seed phrase generation
- Hardware wallet integration ready

### 💎 Key Features
- **Portfolio Management** - Track assets across all chains
- **Gas Fee Optimization** - Real-time fee estimation
- **Transaction History** - Detailed transaction tracking with status
- **QR Code Support** - Easy address sharing and scanning
- **Responsive Design** - Mobile-first approach
- **Dark Mode** - Eye-friendly interface

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - UI framework
- **Vite 5.0.0** - Build tool and dev server
- **React Router 6.0.2** - Client-side routing
- **Tailwind CSS 3.4.6** - Utility-first styling
- **Framer Motion 10.16.4** - Smooth animations

### State Management & Forms
- **Redux Toolkit 2.6.1** - Global state management
- **React Hook Form 7.55.0** - Form validation

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Recharts 2.15.2** - Data visualization

### AI Integration
- **Google Generative AI** - Gemini 2.5 Flash model
- **Streaming responses** - Real-time chat updates

---

## 📦 Installation

### Prerequisites
- Node.js 16.x or higher
- npm or yarn
- Git

### Clone & Install
```bash
git clone https://github.com/SkyL0RC/croWDK
cd crow-wdk
npm install
```

### Environment Setup
Create a `.env` file in the root directory:

```env
# Required: Gemini AI for Crow Assistant
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Additional services
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_GOOGLE_ANALYTICS_ID=your_ga_id
```

Get your Gemini API key from: https://makersuite.google.com/app/apikey

### Run Development Server
```bash
npm run start
# or
npm run dev
```

The app will be available at `http://localhost:4028`

### Build for Production
```bash
npm run build
npm run serve  # Preview production build
```

---

## 🏗️ Backend Integration Guide

### Important Notes

⚠️ **Tether WDK Integration Required**
- Backend must use **Tether Wallet Development Kit (WDK)** for all wallet operations
- WDK handles: wallet creation, key management, transaction signing, multi-chain support
- Frontend currently uses mock data - all data should come from backend APIs

🔄 **Current State**
- Mock data is currently hardcoded in frontend components
- These will be replaced with real API calls once backend is ready
- See "Mock Data Locations" section below for cleanup points

### Tether WDK Implementation

Backend should integrate Tether WDK for:
- **Wallet Generation**: Use WDK's secure key generation
- **Multi-Chain Support**: Leverage WDK's built-in chain integrations
- **Transaction Signing**: Use WDK's signing infrastructure
- **Key Management**: Utilize WDK's encryption standards

Reference: [Tether WDK Documentation](https://tether.to/wdk)

---

### Required Backend APIs

The frontend expects the following REST API endpoints:

#### 1. **Wallet Management (via Tether WDK)**

```typescript
// POST /api/wallet/create
// Generate new wallet with seed phrase
Request: {
  method: 'generate' | 'import',
  network: 'ethereum' | 'tron' | 'bitcoin' | 'solana',
  seedPhrase?: string,  // For import only
  password: string       // For encryption
}

Response: {
  address: string,
  publicKey: string,
  seedPhrase?: string,  // Only for new generation
  encryptedPrivateKey: string
}

// POST /api/wallet/import
// Import existing wallet
Request: {
  seedPhrase: string,
  network: string,
  password: string
}

Response: {
  address: string,
  balance: number,
  tokens: Token[]
}

// GET /api/wallet/:address/balance
// Get wallet balance
Response: {
  address: string,
  balance: number,
  usdValue: number,
  tokens: [
    {
      symbol: string,
      name: string,
      balance: number,
      usdValue: number,
      contractAddress?: string
    }
  ]
}
```

#### 2. **Transaction Management**

```typescript
// POST /api/transaction/send
// Send transaction
Request: {
  from: string,
  to: string,
  amount: number,
  token: string,
  network: string,
  feeSpeed: 'slow' | 'standard' | 'fast',
  password: string  // To decrypt private key
}

Response: {
  txHash: string,
  status: 'pending' | 'success' | 'failed',
  gasUsed?: number,
  gasFee: number,
  timestamp: number
}

// GET /api/transaction/:address/history
// Get transaction history
Query Parameters: {
  network?: string,
  limit?: number,
  offset?: number
}

Response: {
  transactions: [
    {
      hash: string,
      type: 'send' | 'receive' | 'swap',
      from: string,
      to: string,
      amount: number,
      token: string,
      status: 'pending' | 'success' | 'failed',
      timestamp: number,
      gasUsed: number,
      gasFee: number,
      confirmations: number
    }
  ],
  total: number
}

// GET /api/transaction/:txHash
// Get transaction details
Response: {
  hash: string,
  status: string,
  confirmations: number,
  blockNumber: number,
  timestamp: number,
  // ... other details
}
```

#### 3. **Gas Fee Estimation**

```typescript
// GET /api/gas/estimate
// Get current gas prices
Query Parameters: {
  network: 'ethereum' | 'tron' | 'bitcoin' | 'solana',
  transactionType?: 'transfer' | 'contract'
}

Response: {
  network: string,
  slow: {
    gasPrice: number,
    estimatedTime: number,  // in seconds
    cost: number            // in USD
  },
  standard: {
    gasPrice: number,
    estimatedTime: number,
    cost: number
  },
  fast: {
    gasPrice: number,
    estimatedTime: number,
    cost: number
  }
}
```

#### 4. **Network Status**

```typescript
// GET /api/network/status
// Get network health status
Response: {
  networks: [
    {
      id: string,
      name: string,
      status: 'healthy' | 'congested' | 'down',
      blockHeight: number,
      avgBlockTime: number,
      gasPrice: number
    }
  ]
}
```

#### 5. **Token Prices**

```typescript
// GET /api/prices
// Get current token prices
Query Parameters: {
  symbols: string[]  // e.g., ['ETH', 'BTC', 'TRX', 'SOL']
}

Response: {
  prices: {
    [symbol: string]: {
      usd: number,
      change24h: number
    }
  }
}
```

### WebSocket Events (Optional but Recommended)

```typescript
// Subscribe to real-time updates
ws://your-backend.com/ws

// Events to emit:
{
  type: 'transaction_update',
  data: {
    txHash: string,
    status: string,
    confirmations: number
  }
}

{
  type: 'balance_update',
  data: {
    address: string,
    balance: number,
    tokens: Token[]
  }
}

{
  type: 'gas_update',
  data: {
    network: string,
    gasPrice: number
  }
}
```

### Security Requirements

1. **Tether WDK Security**
   - Follow WDK's security best practices
   - Use WDK's built-in encryption for private keys
   - Leverage WDK's secure key derivation

2. **Encryption**
   - Use AES-256 for private key encryption (via WDK)
   - Store encrypted keys server-side if needed
   - Never log private keys or seed phrases

3. **Authentication**
   - Implement JWT or session-based auth
   - Rate limiting on all endpoints
   - CORS configuration for allowed origins

4. **Validation**
   - Validate all addresses before processing (use WDK validators)
   - Check balance before allowing transactions
   - Verify signatures using WDK

5. **Best Practices**
   - Use environment variables for sensitive data
   - Implement proper error handling
   - Add request logging (excluding sensitive data)
   - Set up monitoring and alerts

### Recommended Backend Stack

- **Tether WDK** - Core wallet functionality (REQUIRED)
- **Node.js + Express** or **NestJS** for API
- **PostgreSQL** for transaction history and user data
- **Redis** for caching prices, gas fees, and session data
- Additional chain libraries if needed beyond WDK

### Database Schema Example

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Wallets table
CREATE TABLE wallets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  address VARCHAR(255) NOT NULL,
  network VARCHAR(50) NOT NULL,
  encrypted_private_key TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, address, network)
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  wallet_id UUID REFERENCES wallets(id),
  tx_hash VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(20) NOT NULL,
  from_address VARCHAR(255) NOT NULL,
  to_address VARCHAR(255) NOT NULL,
  amount DECIMAL(36, 18) NOT NULL,
  token VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  gas_used DECIMAL(18, 8),
  gas_fee DECIMAL(18, 8),
  confirmations INT DEFAULT 0,
  network VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_transactions_wallet ON transactions(wallet_id);
CREATE INDEX idx_transactions_hash ON transactions(tx_hash);
CREATE INDEX idx_transactions_address ON transactions(from_address, to_address);
```

---

## 📁 Project Structure

```
crow-wdk-wallet/
├── src/
│   ├── components/          # Shared components
│   │   ├── ui/              # UI primitives (Button, Input, etc.)
│   │   ├── Header.jsx
│   │   ├── QuickActionsBar.jsx
│   │   └── ...
│   ├── pages/               # Route pages
│   │   ├── landing-page/
│   │   ├── user-dashboard/
│   │   ├── send-transfer/
│   │   ├── receive/
│   │   └── walet-creation/
│   ├── services/            # API & service layer
│   │   ├── crowAssistantService.js
│   │   └── geminiClient.js
│   ├── utils/               # Utility functions
│   ├── styles/              # Global styles
│   │   ├── tailwinds.css
│   │   └── index.css
│   ├── App.jsx
│   ├── Routes.jsx
│   └── index.jsx
├── public/                  # Static assets
├── .env                     # Environment variables
├── package.json
├── vite.config.mjs
├── tailwind.config.js
└── README.md
```

---

## 🗑️ Mock Data Cleanup

### Files with Mock Data to Replace

Once backend APIs are ready, replace mock data in these files:

#### Dashboard & Portfolio
- **`src/pages/user-dashboard/index.jsx`**
  - Line ~13: `portfolioData` object (totalBalance, percentageChange, lastUpdated)
  - Line ~24: `networks` array (Ethereum, TRON, Bitcoin, Solana network data)
  - Line ~63: `transactions` array (recent transaction history)
  - Replace with API calls to `/api/wallet/:address/balance` and `/api/transaction/:address/history`

#### Send Transfer
- **`src/pages/send-transfer/index.jsx`**
  - Line ~28: `tokens` array (USDT, ETH, TRX, BTC, SOL with balances and prices)
  - Line ~81: `networks` array (network configurations with gas fees)
  - Replace with API calls to `/api/wallet/:address/balance` and `/api/gas/estimate`

#### Receive Page
- **`src/pages/receive/index.jsx`**
  - Line ~14: `networkAddresses` object (hardcoded wallet addresses)
  - Replace with API call to `/api/wallet/:userId/addresses`

- **`src/pages/receive/components/IncomingTransaction.jsx`**
  - Line ~6: `transactions` array (incoming transaction mock data)
  - Replace with API call to `/api/transaction/:address/history?type=receive`

- **`src/pages/receive/components/AddressHistory.jsx`**
  - Mock address history data (if present)
  - Replace with API call to `/api/wallet/:address/history`

#### Network Selection
- **`src/components/Header.jsx`**
  - Line ~19: `networks` array (network switcher data)
  - Can be kept as static or fetched from `/api/network/status`

- **`src/pages/receive/components/NetworkSelector.jsx`**
  - Line ~5: `networks` array
  - Should match backend supported networks

### API Service Files to Create

Create these service files to handle backend communication:

```javascript
// src/services/api/walletService.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const getWalletBalance = async (address, network) => {
  const { data } = await axios.get(`${API_BASE}/wallet/${address}/balance`, {
    params: { network }
  });
  return data;
};

export const createWallet = async (walletData) => {
  const { data } = await axios.post(`${API_BASE}/wallet/create`, walletData);
  return data;
};

// src/services/api/transactionService.js
export const getTransactionHistory = async (address, params) => {
  const { data } = await axios.get(`${API_BASE}/transaction/${address}/history`, {
    params
  });
  return data;
};

export const sendTransaction = async (txData) => {
  const { data } = await axios.post(`${API_BASE}/transaction/send`, txData);
  return data;
};

// src/services/api/networkService.js
export const getNetworkStatus = async () => {
  const { data } = await axios.get(`${API_BASE}/network/status`);
  return data;
};

export const getGasEstimate = async (network, transactionType) => {
  const { data } = await axios.get(`${API_BASE}/gas/estimate`, {
    params: { network, transactionType }
  });
  return data;
};

// src/services/api/priceService.js
export const getTokenPrices = async (symbols) => {
  const { data } = await axios.get(`${API_BASE}/prices`, {
    params: { symbols: symbols.join(',') }
  });
  return data;
};
```

### Environment Variables to Add

Add to `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
```

---

## 🎨 Design System

### Color Palette
- **Primary**: `#26A17B` (Teal)
- **Accent**: `#48D6B0` (Mint)
- **Background**: `#000000` (Black)
- **Surface**: `#1C1E22` (Dark Gray)
- **Success**: `#48D6B0` (Mint)
- **Error**: `#E06A6A` (Red)
- **Warning**: `#F0C674` (Yellow)

### Typography
- **Font Family**: Inter (Headings & Body), JetBrains Mono (Code)
- **Font Weights**: 400, 500, 600, 700

---

## 🔌 API Integration Points

The frontend is ready for backend integration. Update these service files:

1. `src/services/walletService.js` - Wallet operations
2. `src/services/transactionService.js` - Transaction handling
3. `src/services/networkService.js` - Network status
4. `src/services/priceService.js` - Token prices

Example service structure:
```javascript
// src/services/walletService.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const createWallet = async (data) => {
  const response = await axios.post(`${API_BASE}/wallet/create`, data);
  return response.data;
};

export const getBalance = async (address, network) => {
  const response = await axios.get(`${API_BASE}/wallet/${address}/balance`, {
    params: { network }
  });
  return response.data;
};
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 📧 Contact

For backend development questions or API clarifications, please open an issue on GitHub.

---

## 🙏 Acknowledgments

- Tether Wallet Development Kit
- Google Gemini AI
- React & Vite communities
- All open-source contributors
