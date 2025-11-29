// API Configuration and Service Examples for Frontend Integration
// Place these in src/services/api/ directory

import axios from 'axios';

// API Base Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error);
  }
);

// ==========================================
// WALLET SERVICE
// ==========================================

export const walletService = {
  /**
   * Create a new wallet
   */
  createWallet: async (data) => {
    const response = await api.post('/wallet/create', data);
    return response.data;
  },

  /**
   * Import existing wallet
   */
  importWallet: async (data) => {
    const response = await api.post('/wallet/import', data);
    return response.data;
  },

  /**
   * Get wallet balance
   */
  getBalance: async (address, network) => {
    const response = await api.get(`/wallet/${address}/balance`, {
      params: { network },
    });
    return response.data;
  },

  /**
   * Get wallet details
   */
  getWalletDetails: async (address, network) => {
    const response = await api.get(`/wallet/${address}`, {
      params: { network },
    });
    return response.data;
  },

  /**
   * Export wallet private key
   */
  exportWallet: async (walletId, password) => {
    const response = await api.post(`/wallet/${walletId}/export`, { password });
    return response.data;
  },

  /**
   * Delete wallet
   */
  deleteWallet: async (walletId, password) => {
    const response = await api.delete(`/wallet/${walletId}`, {
      data: { password },
    });
    return response.data;
  },
};

// ==========================================
// TRANSACTION SERVICE
// ==========================================

export const transactionService = {
  /**
   * Send transaction
   */
  sendTransaction: async (data) => {
    const response = await api.post('/transaction/send', data);
    return response.data;
  },

  /**
   * Get transaction history
   */
  getHistory: async (address, params = {}) => {
    const response = await api.get(`/transaction/${address}/history`, { params });
    return response.data;
  },

  /**
   * Get transaction details
   */
  getTransaction: async (txHash) => {
    const response = await api.get(`/transaction/${txHash}`);
    return response.data;
  },
};

// ==========================================
// GAS SERVICE
// ==========================================

export const gasService = {
  /**
   * Get gas fee estimates
   */
  getEstimate: async (network, transactionType = 'transfer') => {
    const response = await api.get('/gas/estimate', {
      params: { network, transactionType },
    });
    return response.data;
  },

  /**
   * Get gas price history
   */
  getHistory: async (network, hours = 24) => {
    const response = await api.get(`/gas/history/${network}`, {
      params: { hours },
    });
    return response.data;
  },
};

// ==========================================
// NETWORK SERVICE
// ==========================================

export const networkService = {
  /**
   * Get all network statuses
   */
  getStatus: async () => {
    const response = await api.get('/network/status');
    return response.data;
  },

  /**
   * Get specific network status
   */
  getNetworkStatus: async (networkId) => {
    const response = await api.get(`/network/status/${networkId}`);
    return response.data;
  },

  /**
   * Get supported networks
   */
  getSupportedNetworks: async () => {
    const response = await api.get('/network/supported');
    return response.data;
  },

  /**
   * Check network congestion
   */
  checkCongestion: async (networkId) => {
    const response = await api.get(`/network/${networkId}/congestion`);
    return response.data;
  },
};

// ==========================================
// PRICE SERVICE
// ==========================================

export const priceService = {
  /**
   * Get token prices
   */
  getPrices: async (symbols) => {
    const symbolString = Array.isArray(symbols) ? symbols.join(',') : symbols;
    const response = await api.get('/prices', {
      params: { symbols: symbolString },
    });
    return response.data;
  },

  /**
   * Get single token price
   */
  getPrice: async (symbol) => {
    const response = await api.get(`/prices/${symbol}`);
    return response.data;
  },

  /**
   * Get market data
   */
  getMarketData: async (symbols) => {
    const symbolString = Array.isArray(symbols) ? symbols.join(',') : symbols;
    const response = await api.get('/prices/market/data', {
      params: { symbols: symbolString },
    });
    return response.data;
  },
};

// ==========================================
// WEBSOCKET SERVICE
// ==========================================

class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectInterval = 5000;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.listeners = new Map();
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.ws = new WebSocket(WS_URL);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.reconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
      setTimeout(() => this.connect(), this.reconnectInterval);
    }
  }

  handleMessage(data) {
    const { type } = data;
    const handlers = this.listeners.get(type);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  subscribe(channel, address = null) {
    const message = {
      type: 'subscribe',
      payload: { channel, address },
    };
    this.send(message);
  }

  unsubscribe(channel, address = null) {
    const message = {
      type: 'unsubscribe',
      payload: { channel, address },
    };
    this.send(message);
  }

  on(eventType, handler) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(handler);
  }

  off(eventType, handler) {
    const handlers = this.listeners.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  send(data) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsService = new WebSocketService();

// ==========================================
// USAGE EXAMPLES
// ==========================================

/*
// Example 1: Create Wallet
const wallet = await walletService.createWallet({
  method: 'generate',
  network: 'ethereum',
  password: 'secure_password',
});

// Example 2: Get Balance
const balance = await walletService.getBalance(
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  'ethereum'
);

// Example 3: Send Transaction
const tx = await transactionService.sendTransaction({
  from: '0x...',
  to: '0x...',
  amount: 1.5,
  token: 'ETH',
  network: 'ethereum',
  feeSpeed: 'standard',
  password: 'secure_password',
});

// Example 4: Get Gas Estimate
const gasEstimate = await gasService.getEstimate('ethereum', 'transfer');

// Example 5: WebSocket - Subscribe to Transactions
wsService.connect();
wsService.subscribe('transactions', '0x...');
wsService.on('transaction_update', (data) => {
  console.log('New transaction:', data);
});

// Example 6: Get Token Prices
const prices = await priceService.getPrices(['ETH', 'BTC', 'BNB']);
*/

export default {
  walletService,
  transactionService,
  gasService,
  networkService,
  priceService,
  wsService,
};
