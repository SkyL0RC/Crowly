import { ethers } from 'ethers';
import { decryptSeedPhrase } from './secureStorage';

/**
 * Get RPC URL based on network mode (CORS enabled endpoints)
 */
function getRpcUrl(isTestnet = true) {
  return isTestnet 
    ? 'https://ethereum-sepolia-rpc.publicnode.com'
    : 'https://ethereum-rpc.publicnode.com';
}

/**
 * Get Chain ID based on network mode
 */
function getChainId(isTestnet = true) {
  return isTestnet ? 11155111 : 1; // Sepolia : Mainnet
}

/**
 * Sign and send Ethereum transaction using ethers.js
 * @param {Object} params - Transaction parameters
 * @returns {Promise<Object>} - Transaction result
 */
export async function signAndSendSepoliaTransaction({ to, amount, password, isTestnet = true }) {
  try {
    // 1. Decrypt seed phrase with password
    const decryptedData = await decryptSeedPhrase(password);
    if (!decryptedData || !decryptedData.seedPhrase) {
      throw new Error('Failed to decrypt wallet. Check your password.');
    }
    
    const seedPhrase = decryptedData.seedPhrase;

    // 2. Validate and normalize address
    let recipientAddress;
    try {
      recipientAddress = ethers.getAddress(to); // Normalize address (checksum)
    } catch (error) {
      throw new Error('Invalid recipient address');
    }

    // 3. Create provider
    const rpcUrl = getRpcUrl(isTestnet);
    const chainId = getChainId(isTestnet);
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    
    // 4. Create wallet from seed phrase
    const wallet = ethers.Wallet.fromPhrase(seedPhrase);
    const connectedWallet = wallet.connect(provider);

    console.log('Sending from:', connectedWallet.address);
    console.log('Sending to:', recipientAddress);
    console.log('Network:', isTestnet ? 'Sepolia Testnet' : 'Ethereum Mainnet');

    // 5. Get current gas price and nonce
    const feeData = await provider.getFeeData();
    const nonce = await provider.getTransactionCount(connectedWallet.address);

    // 6. Prepare transaction
    const tx = {
      to: recipientAddress, // Use normalized address
      value: ethers.parseEther(amount.toString()),
      nonce: nonce,
      gasLimit: 21000,
      maxFeePerGas: feeData.maxFeePerGas,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      chainId: chainId,
      type: 2,
    };

    console.log('Transaction details:', {
      to: recipientAddress,
      value: ethers.formatEther(tx.value) + ' ETH',
      network: isTestnet ? 'Sepolia' : 'Mainnet',
    });

    // 7. Send transaction
    const txResponse = await connectedWallet.sendTransaction(tx);
    console.log('Transaction sent! Hash:', txResponse.hash);

    // 8. Wait for confirmation
    const receipt = await txResponse.wait(1);
    console.log('Confirmed in block:', receipt.blockNumber);

    // 9. Save transaction to localStorage
    const txRecord = {
      txHash: txResponse.hash,
      from: connectedWallet.address,
      to: recipientAddress,
      amount: amount,
      network: isTestnet ? 'Sepolia' : 'Mainnet',
      timestamp: new Date().toISOString(),
      blockNumber: receipt.blockNumber,
      status: receipt.status === 1 ? 'success' : 'failed',
      gasUsed: receipt.gasUsed?.toString() || '0',
    };
    
    console.log('💾 Saving transaction to localStorage:', txRecord);
    
    // Get existing transactions
    const existingTxs = JSON.parse(localStorage.getItem('transactions') || '[]');
    existingTxs.unshift(txRecord); // Add to beginning
    // Keep only last 50 transactions
    const limitedTxs = existingTxs.slice(0, 50);
    localStorage.setItem('transactions', JSON.stringify(limitedTxs));
    
    console.log('✅ Transaction saved! Total transactions:', limitedTxs.length);

    return {
      success: true,
      txHash: txResponse.hash,
      blockNumber: receipt.blockNumber,
      from: connectedWallet.address,
      to: recipientAddress,
      amount: amount,
      gasUsed: receipt.gasUsed?.toString() || '0',
      status: receipt.status === 1 ? 'success' : 'failed',
    };
  } catch (error) {
    console.error('Transaction error:', error);
    
    if (error.code === 'INSUFFICIENT_FUNDS') {
      throw new Error('Insufficient funds for transaction + gas fee');
    } else if (error.message.includes('password') || error.message.includes('decrypt')) {
      throw new Error('Incorrect password');
    } else {
      throw new Error(error.message || 'Transaction failed');
    }
  }
}

/**
 * Get current balance
 */
export async function getSepoliaBalance(address, isTestnet = true) {
  try {
    const rpcUrl = getRpcUrl(isTestnet);
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Failed to get balance:', error);
    throw error;
  }
}

/**
 * Estimate gas
 */
export async function estimateSepoliaGas({ to, amount, isTestnet = true }) {
  try {
    const rpcUrl = getRpcUrl(isTestnet);
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const feeData = await provider.getFeeData();

    const gasLimit = 21000;
    const totalFee = (BigInt(gasLimit) * feeData.maxFeePerGas) / BigInt(1e18);
    const totalFeeEth = Number(totalFee) / 1e18;

    return {
      gasLimit: gasLimit,
      estimatedFeeETH: totalFeeEth.toFixed(8),
      estimatedFeeUSD: (totalFeeEth * 2000).toFixed(2),
    };
  } catch (error) {
    console.error('Failed to estimate gas:', error);
    throw error;
  }
}
