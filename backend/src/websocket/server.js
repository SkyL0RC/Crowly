import { updateAllPrices } from '../services/price.service.js';

const clients = new Map();

/**
 * Initialize WebSocket server
 */
export function initWebSocket(wss) {
  wss.on('connection', (ws, req) => {
    const clientId = generateClientId();
    clients.set(clientId, {
      ws,
      subscriptions: new Set(),
      address: null,
    });

    console.log(`WebSocket client connected: ${clientId}`);

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        handleMessage(clientId, data);
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          error: 'Invalid message format',
        }));
      }
    });

    ws.on('close', () => {
      console.log(`WebSocket client disconnected: ${clientId}`);
      clients.delete(clientId);
    });

    ws.on('error', (error) => {
      console.error(`WebSocket error for client ${clientId}:`, error);
    });

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connected',
      clientId,
      message: 'Connected to CroWDK WebSocket server',
    }));
  });

  // Start periodic updates
  startPeriodicUpdates(wss);
}

/**
 * Handle incoming WebSocket messages
 */
function handleMessage(clientId, data) {
  const client = clients.get(clientId);
  if (!client) return;

  const { type, payload } = data;

  switch (type) {
    case 'subscribe':
      handleSubscribe(clientId, payload);
      break;

    case 'unsubscribe':
      handleUnsubscribe(clientId, payload);
      break;

    case 'ping':
      client.ws.send(JSON.stringify({ type: 'pong' }));
      break;

    default:
      console.warn(`Unknown message type: ${type}`);
  }
}

/**
 * Handle subscription requests
 */
function handleSubscribe(clientId, payload) {
  const client = clients.get(clientId);
  if (!client) return;

  const { channel, address } = payload;

  if (channel === 'transactions' && address) {
    client.subscriptions.add(`transactions:${address}`);
    client.address = address;
    client.ws.send(JSON.stringify({
      type: 'subscribed',
      channel: 'transactions',
      address,
    }));
  } else if (channel === 'prices') {
    client.subscriptions.add('prices');
    client.ws.send(JSON.stringify({
      type: 'subscribed',
      channel: 'prices',
    }));
  } else if (channel === 'gas') {
    client.subscriptions.add('gas');
    client.ws.send(JSON.stringify({
      type: 'subscribed',
      channel: 'gas',
    }));
  }
}

/**
 * Handle unsubscribe requests
 */
function handleUnsubscribe(clientId, payload) {
  const client = clients.get(clientId);
  if (!client) return;

  const { channel, address } = payload;

  if (channel === 'transactions' && address) {
    client.subscriptions.delete(`transactions:${address}`);
  } else {
    client.subscriptions.delete(channel);
  }

  client.ws.send(JSON.stringify({
    type: 'unsubscribed',
    channel,
  }));
}

/**
 * Broadcast message to all clients
 */
export function broadcast(message) {
  clients.forEach((client) => {
    if (client.ws.readyState === 1) { // OPEN
      client.ws.send(JSON.stringify(message));
    }
  });
}

/**
 * Broadcast to specific subscription
 */
export function broadcastToSubscription(subscription, message) {
  clients.forEach((client) => {
    if (client.subscriptions.has(subscription) && client.ws.readyState === 1) {
      client.ws.send(JSON.stringify(message));
    }
  });
}

/**
 * Send message to specific client
 */
export function sendToClient(clientId, message) {
  const client = clients.get(clientId);
  if (client && client.ws.readyState === 1) {
    client.ws.send(JSON.stringify(message));
  }
}

/**
 * Notify transaction update
 */
export function notifyTransactionUpdate(address, transaction) {
  broadcastToSubscription(`transactions:${address}`, {
    type: 'transaction_update',
    data: transaction,
  });
}

/**
 * Notify balance update
 */
export function notifyBalanceUpdate(address, balance) {
  broadcastToSubscription(`transactions:${address}`, {
    type: 'balance_update',
    data: balance,
  });
}

/**
 * Notify price update
 */
export function notifyPriceUpdate(prices) {
  broadcastToSubscription('prices', {
    type: 'price_update',
    data: prices,
  });
}

/**
 * Notify gas update
 */
export function notifyGasUpdate(network, gasData) {
  broadcastToSubscription('gas', {
    type: 'gas_update',
    data: {
      network,
      ...gasData,
    },
  });
}

/**
 * Start periodic updates
 */
function startPeriodicUpdates(wss) {
  // Update prices every minute
  setInterval(async () => {
    try {
      await updateAllPrices();
      console.log('✓ Periodic price update completed');
    } catch (error) {
      console.error('Periodic price update failed:', error);
    }
  }, parseInt(process.env.PRICE_UPDATE_INTERVAL) || 60000);

  // Send heartbeat every 30 seconds
  setInterval(() => {
    clients.forEach((client, clientId) => {
      if (client.ws.readyState === 1) {
        client.ws.send(JSON.stringify({
          type: 'heartbeat',
          timestamp: new Date().toISOString(),
        }));
      } else {
        // Clean up dead connections
        clients.delete(clientId);
      }
    });
  }, 30000);
}

/**
 * Generate unique client ID
 */
function generateClientId() {
  return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get connected clients count
 */
export function getConnectedClientsCount() {
  return clients.size;
}

export default {
  initWebSocket,
  broadcast,
  broadcastToSubscription,
  sendToClient,
  notifyTransactionUpdate,
  notifyBalanceUpdate,
  notifyPriceUpdate,
  notifyGasUpdate,
  getConnectedClientsCount,
};
