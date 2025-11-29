import { 
  getNetworkConfig 
} from '../config/wdk.config.js';
import { ValidationError, NotFoundError } from '../middlewares/error.middleware.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * ⚠️ NO DATABASE - All data in memory
 * 
 * Frontend handles signing with WDK:
 * 1. User enters password
 * 2. Decrypt seed phrase from localStorage
 * 3. Create WDK instance with seed phrase
 * 4. Sign transaction
 * 5. Send SIGNED transaction to backend
 * 6. Backend broadcasts it
 */

// In-memory storage
const transactions = new Map();

/**
 * Broadcast a pre-signed transaction
 */
export async function broadcastTransaction({
  from,
  to,
  amount,
  token,
  network,
  signedTx,
  txHash,
  memo,
}) {
  try {
    const networkConfig = getNetworkConfig(network);
    if (!networkConfig) {
      throw new ValidationError(`Unsupported network: ${network}`);
    }

    // ⚠️ TODO: Broadcast signedTx to blockchain
    // Mock for now
    
    const transaction = {
      id: uuidv4(),
      txHash,
      type: 'send',
      from,
      to,
      amount,
      token: token || 'Native',
      status: 'pending',
      gasUsed: '0',
      gasFee: '0',
      gasPrice: '0',
      network,
      networkType: networkConfig.type,
      metadata: { memo },
      created_at: new Date().toISOString(),
    };

    transactions.set(txHash, transaction);

    // Mock confirmation after 3 seconds
    setTimeout(() => {
      const tx = transactions.get(txHash);
      if (tx) {
        tx.status = 'success';
        tx.confirmations = 1;
        transactions.set(txHash, tx);
      }
    }, 3000);

    return {
      id: transaction.id,
      txHash,
      status: 'pending',
      from,
      to,
      amount,
      token,
      network,
      gasUsed: '0',
      gasFee: '0',
      timestamp: transaction.created_at,
    };
  } catch (error) {
    console.error('Broadcast transaction error:', error);
    throw error;
  }
}

/**
 * Get transaction history
 */
export async function getTransactionHistory(address, options = {}) {
  try {
    const { network, type, limit = 20, offset = 0 } = options;

    let filtered = Array.from(transactions.values()).filter(tx => 
      tx.from === address || tx.to === address
    );

    if (network) {
      filtered = filtered.filter(tx => tx.network === network);
    }

    if (type) {
      filtered = filtered.filter(tx => tx.type === type);
    }

    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const paginated = filtered.slice(offset, offset + limit);

    return {
      transactions: paginated.map(formatTransaction),
      total: filtered.length,
      limit,
      offset,
    };
  } catch (error) {
    console.error('Get transaction history error:', error);
    throw error;
  }
}

/**
 * Get transaction by hash
 */
export async function getTransactionByHash(txHash) {
  try {
    const tx = transactions.get(txHash);
    
    if (!tx) {
      throw new NotFoundError('Transaction not found');
    }

    return formatTransaction(tx);
  } catch (error) {
    console.error('Get transaction error:', error);
    throw error;
  }
}

/**
 * Format transaction for response
 */
function formatTransaction(tx) {
  return {
    id: tx.id,
    hash: tx.txHash,
    type: tx.type,
    from: tx.from,
    to: tx.to,
    amount: parseFloat(tx.amount),
    token: tx.token,
    status: tx.status,
    gasUsed: tx.gasUsed || '0',
    gasFee: tx.gasFee || '0',
    gasPrice: tx.gasPrice || '0',
    confirmations: tx.confirmations || 0,
    network: tx.network,
    networkType: tx.networkType,
    timestamp: tx.created_at,
  };
}

export default {
  broadcastTransaction,
  getTransactionHistory,
  getTransactionByHash,
};
