# CroWDK Backend - Tether WDK Implementation

Backend server for CroWDK Wallet built with **Tether Wallet Development Kit (WDK)** for multi-chain cryptocurrency wallet management.

## 🚀 Features

- **Multi-Chain Support**: EVM (Ethereum, BSC, Polygon), TON, TRON
- **Tether WDK Integration**: Full WDK implementation for wallet operations
- **Secure Key Management**: AES-256-GCM encryption for private keys
- **Real-time Updates**: WebSocket support for transactions, balances, and prices
- **Gas Optimization**: Dynamic gas fee estimation
- **Transaction Monitoring**: Automatic transaction status tracking
- **Price Feeds**: Real-time token price updates
- **Gasless Transactions**: Support for TRON gasless transfers

## 📋 Prerequisites

- Node.js 16.x or higher
- PostgreSQL 13+
- Redis 6+
- npm or yarn

## 🔧 Installation

### 1. Clone and Install Dependencies

```bash
cd backend
npm install
```

### 2. Database Setup

Install PostgreSQL and create a database:

```bash
# macOS with Homebrew
brew install postgresql
brew services start postgresql

# Create database
createdb crowdk_wallet

# Or using psql
psql postgres
CREATE DATABASE crowdk_wallet;
\q
```

### 3. Redis Setup

Install and start Redis:

```bash
# macOS with Homebrew
brew install redis
brew services start redis

# Verify Redis is running
redis-cli ping
# Should return: PONG
```

### 4. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=crowdk_wallet
DB_USER=postgres
DB_PASSWORD=your_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# Tether WDK - EVM Networks
WDK_EVM_NETWORK=ethereum-mainnet
WDK_EVM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
WDK_EVM_API_KEY=your_alchemy_key

# Tether WDK - TON
WDK_TON_NETWORK=mainnet
WDK_TON_RPC_URL=https://toncenter.com/api/v2/jsonRPC
WDK_TON_API_KEY=your_toncenter_key

# Tether WDK - TRON
WDK_TRON_NETWORK=mainnet
WDK_TRON_RPC_URL=https://api.trongrid.io
WDK_TRON_API_KEY=your_trongrid_key

# Price API
COINGECKO_API_KEY=your_coingecko_key

# CORS
CORS_ORIGIN=http://localhost:4028
```

### 5. Run Database Migrations

```bash
npm run migrate
```

### 6. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:3000`

## 📡 API Endpoints

### Wallet Management

```
POST   /api/wallet/create          - Create or import wallet
POST   /api/wallet/import          - Import wallet from seed phrase
GET    /api/wallet/:address/balance - Get wallet balance
GET    /api/wallet/:address        - Get wallet details
POST   /api/wallet/:id/export      - Export private key (requires password)
DELETE /api/wallet/:id             - Delete wallet
```

### Transactions

```
POST   /api/transaction/send              - Send transaction
GET    /api/transaction/:address/history  - Get transaction history
GET    /api/transaction/:txHash           - Get transaction details
PUT    /api/transaction/:txHash/status    - Update transaction status
```

### Gas Fees

```
GET    /api/gas/estimate          - Get gas fee estimates
GET    /api/gas/history/:network  - Get historical gas prices
```

### Network Status

```
GET    /api/network/status                 - Get all network statuses
GET    /api/network/status/:networkId      - Get specific network status
GET    /api/network/supported              - Get supported networks list
GET    /api/network/:networkId/congestion  - Check network congestion
```

### Token Prices

```
GET    /api/prices                 - Get token prices (query: ?symbols=ETH,BTC,BNB)
GET    /api/prices/:symbol         - Get price for specific token
GET    /api/prices/market/data     - Get market data
```

## 🔌 WebSocket API

Connect to `ws://localhost:3000` for real-time updates.

### Subscribe to Events

```javascript
// Subscribe to transaction updates
ws.send(JSON.stringify({
  type: 'subscribe',
  payload: {
    channel: 'transactions',
    address: '0x...'
  }
}));

// Subscribe to price updates
ws.send(JSON.stringify({
  type: 'subscribe',
  payload: {
    channel: 'prices'
  }
}));

// Subscribe to gas updates
ws.send(JSON.stringify({
  type: 'subscribe',
  payload: {
    channel: 'gas'
  }
}));
```

### Receive Events

```javascript
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch(data.type) {
    case 'transaction_update':
      console.log('Transaction update:', data.data);
      break;
    case 'balance_update':
      console.log('Balance update:', data.data);
      break;
    case 'price_update':
      console.log('Price update:', data.data);
      break;
    case 'gas_update':
      console.log('Gas update:', data.data);
      break;
  }
};
```

## 🔐 Tether WDK Configuration

### Supported Networks

- **Ethereum** (Mainnet, Sepolia)
- **BNB Chain** (Mainnet, Testnet)
- **Polygon** (Mainnet, Mumbai)
- **TON** (Mainnet, Testnet)
- **TRON** (Mainnet, Shasta)

### WDK Features Used

- `@tether/wdk-wallet-evm` - EVM chain wallet management
- `@tether/wdk-wallet-ton` - TON wallet management
- `@tether/wdk-wallet-tron-gasfree` - TRON gasless transactions
- `@tether/wdk-swap-velora-evm` - EVM DEX integration
- `@tether/wdk-swap-stonfi-ton` - TON DEX integration

## 🗄️ Database Schema

### Tables

- `users` - User accounts
- `wallets` - Wallet addresses and encrypted keys
- `transactions` - Transaction history
- `token_balances` - Token balance cache
- `price_cache` - Price data cache
- `address_book` - Saved addresses
- `sessions` - User sessions

## 🔒 Security Features

- **Encryption**: AES-256-GCM for private keys
- **Key Derivation**: PBKDF2 with 100,000 iterations
- **Rate Limiting**: Configurable per endpoint
- **Password Protection**: Required for sensitive operations
- **Input Validation**: Joi schema validation
- **Helmet.js**: Security headers
- **CORS**: Configurable origins

## 🐛 Debugging

Enable debug logging:

```env
LOG_LEVEL=debug
```

Check database connection:

```bash
psql crowdk_wallet -c "SELECT NOW();"
```

Check Redis connection:

```bash
redis-cli ping
```

## 📝 API Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": { ... }
  }
}
```

## 🚦 Rate Limits

- General API: 100 requests / 15 minutes
- Wallet operations: 10 requests / 15 minutes
- Authentication: 5 attempts / 15 minutes

## 📊 Monitoring

Check server health:

```bash
curl http://localhost:3000/health
```

Response:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 12345
}
```

## 🔄 Development Workflow

```bash
# Install dependencies
npm install

# Run migrations
npm run migrate

# Start development server
npm run dev

# Test API endpoints
curl http://localhost:3000/api/network/supported
```

## 📦 Production Deployment

```bash
# Build for production
npm install --production

# Set environment
export NODE_ENV=production

# Run migrations
npm run migrate

# Start server
npm start
```

## 🤝 Integration with Frontend

Update frontend `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
```

## 📚 Additional Resources

- [Tether WDK Documentation](https://tether.to/wdk)
- [Wallet Development Guide](https://docs.tether.to/wdk/wallet)
- [API Reference](https://docs.tether.to/wdk/api)

## ⚠️ Important Notes

1. **Never commit `.env` file** - Contains sensitive keys
2. **Change JWT_SECRET** in production
3. **Use strong passwords** for encryption
4. **Enable HTTPS** in production
5. **Set up proper backup** for database
6. **Monitor API rate limits** from providers
7. **Test on testnet first** before mainnet

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
brew services list | grep postgresql

# Restart PostgreSQL
brew services restart postgresql
```

### Redis Connection Issues

```bash
# Check Redis is running
brew services list | grep redis

# Restart Redis
brew services restart redis
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

## 📄 License

MIT License - See LICENSE file for details
