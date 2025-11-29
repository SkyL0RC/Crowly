import WDK from '@tetherto/wdk';
import WalletManagerEvm from '@tetherto/wdk-wallet-evm';
import WalletManagerTron from '@tetherto/wdk-wallet-tron';
import WalletManagerBtc from '@tetherto/wdk-wallet-btc';
import WalletManagerTon from '@tetherto/wdk-wallet-ton';

/**
 * EVM Wallet Configuration (Ethereum, BSC, Polygon, etc.)
 */
export const evmConfig = {
  network: process.env.WDK_EVM_NETWORK || 'ethereum-mainnet',
  rpcUrl: process.env.WDK_EVM_RPC_URL || 'https://eth.llamarpc.com',
  chainId: getChainId(process.env.WDK_EVM_NETWORK),
  explorer: getExplorerUrl(process.env.WDK_EVM_NETWORK),
  provider: process.env.ETHEREUM_RPC_URL || 'https://eth.drpc.org',
};

/**
 * TON Wallet Configuration
 */
export const tonConfig = {
  network: process.env.WDK_TON_NETWORK || 'mainnet',
  rpcUrl: process.env.WDK_TON_RPC_URL || 'https://toncenter.com/api/v2/jsonRPC',
  apiKey: process.env.WDK_TON_API_KEY,
  provider: process.env.WDK_TON_RPC_URL || 'https://toncenter.com/api/v2/jsonRPC',
};

/**
 * TRON Wallet Configuration
 */
export const tronConfig = {
  network: process.env.WDK_TRON_NETWORK || 'mainnet',
  fullHost: process.env.WDK_TRON_RPC_URL || 'https://api.trongrid.io',
  apiKey: process.env.WDK_TRON_API_KEY,
  provider: process.env.WDK_TRON_RPC_URL || 'https://api.trongrid.io',
};

/**
 * Bitcoin Wallet Configuration
 */
export const btcConfig = {
  network: process.env.WDK_BTC_NETWORK || 'mainnet',
  provider: process.env.WDK_BTC_RPC_URL || 'https://blockstream.info/api',
};

/**
 * Initialize WDK Instance with all wallets
 */
export function createWDKInstance(seedPhrase) {
  if (!seedPhrase) {
    throw new Error('Seed phrase is required to create WDK instance');
  }

  // Create WDK instance with seed phrase
  const wdk = new WDK(seedPhrase);

  // Register EVM wallets (Ethereum, BSC, Polygon, etc.)
  wdk.registerWallet('ethereum', WalletManagerEvm, {
    provider: evmConfig.provider,
  });

  // Register TRON wallet
  wdk.registerWallet('tron', WalletManagerTron, {
    provider: tronConfig.provider,
  });

  // Register Bitcoin wallet
  wdk.registerWallet('bitcoin', WalletManagerBtc, {
    provider: btcConfig.provider,
  });

  // Register TON wallet
  wdk.registerWallet('ton', WalletManagerTon, {
    provider: tonConfig.provider,
  });

  return wdk;
}

/**
 * Get Account from WDK
 */
export async function getAccount(wdk, blockchain, accountIndex = 0) {
  return await wdk.getAccount(blockchain, accountIndex);
}

/**
 * Generate New Mnemonic (12 words) using WDK
 */
export function generateMnemonic() {
  return WDK.getRandomSeedPhrase();
}

/**
 * Validate Mnemonic using WDK
 */
export function validateMnemonic(mnemonic) {
  try {
    // WDK will validate when creating instance
    new WDK(mnemonic);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get Chain ID for EVM networks
 */
function getChainId(network) {
  const chainIds = {
    'ethereum-mainnet': 1,
    'ethereum-sepolia': 11155111,
    'bsc-mainnet': 56,
    'bsc-testnet': 97,
    'polygon-mainnet': 137,
    'polygon-mumbai': 80001,
    'arbitrum-mainnet': 42161,
    'optimism-mainnet': 10,
    'avalanche-mainnet': 43114,
  };
  return chainIds[network] || 1;
}

/**
 * Get Explorer URL for networks
 */
function getExplorerUrl(network) {
  const explorers = {
    'ethereum-mainnet': 'https://etherscan.io',
    'ethereum-sepolia': 'https://sepolia.etherscan.io',
    'bsc-mainnet': 'https://bscscan.com',
    'bsc-testnet': 'https://testnet.bscscan.com',
    'polygon-mainnet': 'https://polygonscan.com',
    'polygon-mumbai': 'https://mumbai.polygonscan.com',
    'arbitrum-mainnet': 'https://arbiscan.io',
    'optimism-mainnet': 'https://optimistic.etherscan.io',
    'avalanche-mainnet': 'https://snowtrace.io',
  };
  return explorers[network] || 'https://etherscan.io';
}

/**
 * Supported networks configuration
 */
export const supportedNetworks = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    type: 'evm',
    chainId: 1,
    decimals: 18,
    icon: '⟠',
    color: '#627EEA',
    explorer: 'https://etherscan.io',
  },
  {
    id: 'bsc',
    name: 'BNB Chain',
    symbol: 'BNB',
    type: 'evm',
    chainId: 56,
    decimals: 18,
    icon: '🔶',
    color: '#F3BA2F',
    explorer: 'https://bscscan.com',
  },
  {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    type: 'evm',
    chainId: 137,
    decimals: 18,
    icon: '🟣',
    color: '#8247E5',
    explorer: 'https://polygonscan.com',
  },
  {
    id: 'ton',
    name: 'TON',
    symbol: 'TON',
    type: 'ton',
    decimals: 9,
    icon: '💎',
    color: '#0088CC',
    explorer: 'https://tonscan.org',
  },
  {
    id: 'tron',
    name: 'TRON',
    symbol: 'TRX',
    type: 'tron',
    decimals: 6,
    icon: '🔴',
    color: '#FF0013',
    explorer: 'https://tronscan.org',
  },
];

/**
 * Get network configuration by ID
 */
export function getNetworkConfig(networkId) {
  return supportedNetworks.find(n => n.id === networkId);
}

/**
 * Get wallet instance by network type
 */
export function getWalletByNetwork(networkType) {
  switch (networkType) {
    case 'evm':
      return createEvmWallet();
    case 'ton':
      return createTonWallet();
    case 'tron':
      return createTronWallet();
    default:
      throw new Error(`Unsupported network type: ${networkType}`);
  }
}
