# 🔧 Crowly Backend API

> Express.js backend for Crowly cryptocurrency wallet application

## 📋 Overview

This backend provides REST API endpoints for wallet operations, transaction management, and real-time price updates. It uses **in-memory storage** (no database) for lightweight operation.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 8+

### Installation
```bash
npm install
```

### Environment Setup
Create `.env` file:
```env
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:4028
PRICE_UPDATE_INTERVAL=300000
```

### Run Development Server
```bash
npm run dev
```

### Run Production Server
```bash
npm start
```

## 📡 API Endpoints

### Wallet Management

#### Create Wallet
```http
POST /api/wallet/create
Content-Type: application/json

{
  "method": "generate",
  "network": "ethereum"
}
```

**Response:**
```json
{
  "address": "0x...",
  "seedPhrase": "word1 word2 ... word12",
  "network": "ethereum",
  "createdAt": "2025-11-30T..."
}
```

#### Import Wallet
```http
POST /api/wallet/import
Content-Type: application/json

{
  "method": "import",
  "seedPhrase": "word1 word2 ... word12",
  "network": "ethereum"
}
```

### Transaction Management

#### Get Balance
```http
GET /api/wallet/balance/:address?network=ethereum
```

#### Get Transaction History
```http
GET /api/transaction/history/:address?network=ethereum&limit=50
```

#### Send Transaction (Mock)
```http
POST /api/transaction/send
Content-Type: application/json

{
  "from": "0x...",
  "to": "0x...",
  "amount": "0.1",
  "network": "ethereum"
}
```

### Price & Gas Data

#### Get Token Prices
```http
GET /api/price/all
```

#### Get Gas Fee
```http
GET /api/gas/:network
```

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── routes/
│   │   ├── wallet.routes.js      # Wallet endpoints
│   │   ├── transaction.routes.js # Transaction endpoints
│   │   ├── price.routes.js       # Price data endpoints
│   │   └── gas.routes.js         # Gas fee endpoints
│   │
│   ├── services/
│   │   ├── wallet.service.js     # Wallet business logic
│   │   ├── transaction.service.js # Transaction management
│   │   ├── price.service.js      # Price fetching (CoinGecko)
│   │   └── gas.service.js        # Gas fee estimation
│   │
│   ├── websocket/
│   │   └── server.js             # WebSocket for real-time updates
│   │
│   ├── middleware/
│   │   └── errorHandler.js       # Global error handling
│   │
│   └── server.js                 # Express app entry point
│
├── .env                          # Environment variables
├── package.json
└── README.md
```

## 💾 Storage Strategy

### In-Memory Storage
- **No Database** - All data stored in JavaScript `Map()` objects
- **Ephemeral** - Data cleared on server restart
- **Lightweight** - No setup or configuration needed

### Why No Database?
1. **Client-Side Security** - Seed phrases encrypted on client, never sent to backend
2. **Stateless Backend** - Backend only provides utility functions
3. **Simplified Deployment** - No database setup required
4. **Privacy** - User data never leaves their device

## 🔒 Security Notes

### What Backend Does NOT Store:
- ❌ Private keys
- ❌ Seed phrases
- ❌ User passwords
- ❌ Wallet addresses (except in memory for session)

### What Backend Does:
- ✅ Generate BIP-39 seed phrases (returned to client)
- ✅ Fetch real-time price data
- ✅ Estimate gas fees
- ✅ Provide mock transaction endpoints

## 🌐 External APIs

### CoinGecko API
- **Purpose:** Token price fetching
- **Endpoint:** https://api.coingecko.com/api/v3/simple/price
- **Rate Limit:** Free tier - 50 calls/minute
- **Update Interval:** Every 5 minutes (configurable)

### Gas Estimation
- Uses public RPC nodes
- Real-time gas price from blockchain

## 🛠️ Development

### Available Scripts
```bash
npm run dev      # Start with nodemon (auto-reload)
npm start        # Start production server
npm test         # Run tests (if configured)
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `GEMINI_API_KEY` | Google Gemini API key | Required |
| `FRONTEND_URL` | CORS allowed origin | `http://localhost:4028` |
| `PRICE_UPDATE_INTERVAL` | Price fetch interval (ms) | `300000` (5 min) |

### Adding New Endpoints

1. Create route file in `src/routes/`
2. Create service file in `src/services/`
3. Register route in `src/server.js`

Example:
```javascript
// src/routes/example.routes.js
const express = require('express');
const router = express.Router();

router.get('/endpoint', (req, res) => {
  res.json({ message: 'Hello' });
});

module.exports = router;

// src/server.js
app.use('/api/example', require('./routes/example.routes'));
```

## 📊 Logging

Uses **Winston** for structured logging:
- Console transport in development
- File transport in production
- Separate error log file

Log levels:
- `error` - Critical errors
- `warn` - Warnings
- `info` - General info
- `debug` - Debug information

## 🐛 Troubleshooting

### Server Won't Start
1. Check port availability: `lsof -i :3000`
2. Verify environment variables
3. Check Node.js version: `node --version`

### CORS Errors
1. Verify `FRONTEND_URL` in `.env`
2. Check browser console for exact error
3. Ensure frontend URL matches exactly

### Price API Rate Limit (429)
1. Increase `PRICE_UPDATE_INTERVAL` in `.env`
2. Default changed to 5 minutes (300000ms)
3. Consider upgrading CoinGecko plan for production

## 📄 License

MIT License - See main project README

---

## 🔗 Links

- [Main Project README](../README.md)
- [Frontend Documentation](../src/README.md)
- [API Documentation](#-api-endpoints)

---

<div align="center">

**Backend for Crowly Wallet** | Built with Express.js & Node.js

</div>
