import React, { createContext, useContext, useState, useEffect } from 'react';

const NetworkContext = createContext();

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};

export const NetworkProvider = ({ children }) => {
  const [networkMode, setNetworkMode] = useState(() => {
    // localStorage'dan network mode'u oku
    return localStorage.getItem('networkMode') || 'testnet';
  });

  useEffect(() => {
    // Network mode değiştiğinde localStorage'a kaydet
    localStorage.setItem('networkMode', networkMode);
  }, [networkMode]);

  const toggleNetwork = () => {
    setNetworkMode(prev => prev === 'mainnet' ? 'testnet' : 'mainnet');
  };

  const isTestnet = networkMode === 'testnet';
  const isMainnet = networkMode === 'mainnet';

  const getRpcUrl = (blockchain = 'ethereum') => {
    if (blockchain === 'ethereum') {
      return isTestnet 
        ? 'https://ethereum-sepolia-rpc.publicnode.com'
        : 'https://ethereum-rpc.publicnode.com'; // Mainnet CORS destekli
    }
    // Diğer blockchain'ler için RPC URL'leri buraya eklenebilir
    return '';
  };

  const getChainId = (blockchain = 'ethereum') => {
    if (blockchain === 'ethereum') {
      return isTestnet ? 11155111 : 1; // Sepolia : Mainnet
    }
    return 1;
  };

  const getExplorerUrl = (blockchain = 'ethereum') => {
    if (blockchain === 'ethereum') {
      return isTestnet 
        ? 'https://sepolia.etherscan.io'
        : 'https://etherscan.io';
    }
    return '';
  };

  const value = {
    networkMode,
    setNetworkMode,
    toggleNetwork,
    isTestnet,
    isMainnet,
    getRpcUrl,
    getChainId,
    getExplorerUrl,
  };

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  );
};
