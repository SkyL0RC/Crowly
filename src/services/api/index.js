/**
 * API Services Index
 * Tüm API servislerini tek bir yerden export et
 */

export * from './walletService';
export * from './transactionService';
export * from './gasService';
export * from './networkService';
export * from './priceService';

// Default export
import walletService from './walletService';
import transactionService from './transactionService';
import gasService from './gasService';
import networkService from './networkService';
import priceService from './priceService';

export default {
  wallet: walletService,
  transaction: transactionService,
  gas: gasService,
  network: networkService,
  price: priceService,
};
