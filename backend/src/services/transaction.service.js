import { query } from '../database/connection.js';
import { 
  getNetworkConfig 
} from '../config/wdk.config.js';
import { ValidationError, NotFoundError } from '../middlewares/error.middleware.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * ⚠️ SECURITY UPDATE:
 * 
 * Backend artık transaction signing yapmıyor!
 * Frontend'de signing yapılacak:
 * 
 * Frontend Flow:
 * 1. User enters password
 * 2. Decrypt seed phrase from localStorage
 * 3. Create WDK instance with seed phrase
 * 4. Sign transaction
 * 5. Send SIGNED transaction to backend
 * 6. Backend broadcasts it
 * 
 * Bu dosyada:
 * - sendTransaction → Broadcast signed tx
 * - getMnemonicForSigning → REMOVED
 */

/**
 * Broadcast a pre-signed transaction
 * 
 * Frontend'den zaten imzalanmış transaction gelir.
 * Backend sadece broadcast eder ve database'e kaydeder.
 */
export async function broadcastTransaction({
  from,
  to,
  amount,
  token,
  network,
  signedTx, // Frontend'den imzalanmış gelecek
  txHash,   // Frontend'den hash gelecek
  memo,
}) {
  try {
    // Get network configuration
    const networkConfig = getNetworkConfig(network);
    if (!networkConfig) {
      throw new ValidationError(`Unsupported network: ${network}`);
    }

    // ⚠️ TODO: Broadcast signedTx to blockchain
    // Bu kısım WDK provider ile broadcast edilecek
    // Şimdilik mock olarak txHash kabul ediyoruz
    
    // Get wallet ID from database
    const walletResult = await query(
      'SELECT id FROM wallets WHERE address = $1 AND network = $2',
      [from, network]
    );

    const walletId = walletResult.rows[0]?.id;

    // Save transaction to database
    const txResult = await query(
      `INSERT INTO transactions (
        wallet_id, tx_hash, type, from_address, to_address, amount,
        token_symbol, status, gas_used, gas_fee, gas_price,
        network, network_type, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        walletId,
        txHash,
        'send',
        from,
        to,
        amount,
        token || 'Native',
        'pending',
        '0',
        '0',
        '0',
        network,
        networkConfig.type,
        JSON.stringify({ memo }),
      ]
    );

    const transaction = txResult.rows[0];

    // Start monitoring transaction status
    monitorTransaction(txHash, network, transaction.id);

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
 * ❌ REMOVED: sendTransaction with signing
 * 
 * Signing artık frontend'de yapılıyor!
 * broadcastTransaction kullan.
 */

/**
 * Get transaction history for an address
 */
export async function getTransactionHistory(address, options = {}) {
  try {
    const { network, type, limit = 20, offset = 0 } = options;

    let queryText = `
      SELECT t.*, w.address as wallet_address
      FROM transactions t
      LEFT JOIN wallets w ON t.wallet_id = w.id
      WHERE (t.from_address = $1 OR t.to_address = $1)
    `;
    const queryParams = [address];
    let paramIndex = 2;

    if (network) {
      queryText += ` AND t.network = $${paramIndex}`;
      queryParams.push(network);
      paramIndex++;
    }

    if (type) {
      queryText += ` AND t.type = $${paramIndex}`;
      queryParams.push(type);
      paramIndex++;
    }

    queryText += ` ORDER BY t.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);

    const result = await query(queryText, queryParams);

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM transactions WHERE from_address = $1 OR to_address = $1`,
      [address]
    );
    const total = parseInt(countResult.rows[0].count);

    return {
      transactions: result.rows.map(formatTransaction),
      total,
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
    const result = await query(
      'SELECT * FROM transactions WHERE tx_hash = $1',
      [txHash]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Transaction not found');
    }

    return formatTransaction(result.rows[0]);
  } catch (error) {
    console.error('Get transaction error:', error);
    throw error;
  }
}

/**
 * Update transaction status
 */
export async function updateTransactionStatus(txHash, status, details = {}) {
  try {
    const updates = {
      status,
      confirmations: details.confirmations || 0,
      block_number: details.blockNumber,
      gas_used: details.gasUsed,
      error_message: details.error,
      updated_at: new Date(),
    };

    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const values = [txHash, ...Object.values(updates)];

    await query(
      `UPDATE transactions SET ${setClause} WHERE tx_hash = $1`,
      values
    );

    return await getTransactionByHash(txHash);
  } catch (error) {
    console.error('Update transaction status error:', error);
    throw error;
  }
}

/**
 * Monitor transaction status
 */
async function monitorTransaction(txHash, network, transactionId) {
  try {
    const networkConfig = getNetworkConfig(network);
    const wallet = getWalletByNetwork(networkConfig.type);

    // Poll transaction status
    const maxAttempts = 60; // 5 minutes (5 second intervals)
    let attempts = 0;

    const checkStatus = async () => {
      try {
        const receipt = await wallet.getTransactionReceipt(txHash);
        
        if (receipt) {
          const status = receipt.status === 1 || receipt.status === true ? 'success' : 'failed';
          
          await updateTransactionStatus(txHash, status, {
            confirmations: receipt.confirmations || 1,
            blockNumber: receipt.blockNumber,
            gasUsed: receipt.gasUsed,
          });

          console.log(`Transaction ${txHash} confirmed with status: ${status}`);
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 5000); // Check again in 5 seconds
        } else {
          console.log(`Transaction ${txHash} monitoring timeout`);
        }
      } catch (error) {
        console.error('Error checking transaction status:', error);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 5000);
        }
      }
    };

    // Start monitoring after a short delay
    setTimeout(checkStatus, 3000);
  } catch (error) {
    console.error('Monitor transaction error:', error);
  }
}

/**
 * Estimate transaction fee
 */
async function estimateTransactionFee(network, speed = 'standard', type = 'transfer') {
  try {
    const networkConfig = getNetworkConfig(network);
    const wallet = getWalletByNetwork(networkConfig.type);

    // Get current gas prices
    const gasPrice = await wallet.getGasPrice();
    
    // Speed multipliers
    const multipliers = {
      slow: 0.8,
      standard: 1.0,
      fast: 1.3,
    };

    const adjustedGasPrice = Math.floor(gasPrice * multipliers[speed]);
    
    // Estimate gas limit based on transaction type
    const gasLimit = type === 'transfer' ? 21000 : 100000;

    return {
      gasPrice: adjustedGasPrice,
      gasLimit,
      estimatedCost: (adjustedGasPrice * gasLimit) / 1e18, // in native token
    };
  } catch (error) {
    console.error('Estimate fee error:', error);
    // Return default values if estimation fails
    return {
      gasPrice: 20000000000, // 20 gwei
      gasLimit: 21000,
      estimatedCost: 0.00042,
    };
  }
}

/**
 * Get token contract address
 */
async function getTokenAddress(symbol, network) {
  // Common token addresses by network
  const tokenAddresses = {
    ethereum: {
      USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    },
    bsc: {
      USDT: '0x55d398326f99059fF775485246999027B3197955',
      USDC: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      BUSD: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    },
    polygon: {
      USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    },
    tron: {
      USDT: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    },
  };

  return tokenAddresses[network]?.[symbol] || '';
}

/**
 * Format transaction for response
 */
function formatTransaction(tx) {
  return {
    id: tx.id,
    hash: tx.tx_hash,
    type: tx.type,
    from: tx.from_address,
    to: tx.to_address,
    amount: parseFloat(tx.amount),
    token: tx.token_symbol,
    tokenAddress: tx.token_address,
    status: tx.status,
    gasUsed: tx.gas_used ? parseFloat(tx.gas_used) : 0,
    gasFee: tx.gas_fee ? parseFloat(tx.gas_fee) : 0,
    gasPrice: tx.gas_price ? parseFloat(tx.gas_price) : 0,
    confirmations: tx.confirmations || 0,
    blockNumber: tx.block_number,
    network: tx.network,
    networkType: tx.network_type,
    error: tx.error_message,
    metadata: tx.metadata,
    timestamp: tx.created_at,
    updatedAt: tx.updated_at,
  };
}

export default {
  broadcastTransaction, // sendTransaction → broadcastTransaction oldu
  getTransactionHistory,
  getTransactionByHash,
  updateTransactionStatus,
};
