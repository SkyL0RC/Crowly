import Joi from 'joi';
import { ValidationError } from './error.middleware.js';

/**
 * Validation middleware factory
 */
export function validate(schema, property = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.reduce((acc, detail) => {
        acc[detail.path.join('.')] = detail.message;
        return acc;
      }, {});

      return next(new ValidationError('Validation failed', details));
    }

    req[property] = value;
    next();
  };
}

/**
 * Common validation schemas
 */

// Wallet creation validation
// ⚠️ SECURITY: password artık optional (backward compatibility)
export const createWalletSchema = Joi.object({
  method: Joi.string().valid('generate', 'import').required(),
  network: Joi.string().valid('ethereum', 'bsc', 'polygon', 'ton', 'tron').required(),
  seedPhrase: Joi.string().when('method', {
    is: 'import',
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
  password: Joi.string().min(8).optional(), // ❌ Backend artık kullanmıyor
});

// Transaction send validation
// ⚠️ SECURITY: Frontend'de imzalanan transaction broadcast edilir
export const sendTransactionSchema = Joi.object({
  from: Joi.string().required(),
  to: Joi.string().required(),
  amount: Joi.number().positive().required(),
  token: Joi.string().optional(),
  network: Joi.string().valid('ethereum', 'bsc', 'polygon', 'ton', 'tron').required(),
  signedTx: Joi.string().required(), // Frontend'den imzalanmış transaction
  txHash: Joi.string().required(),   // Frontend'den transaction hash
  password: Joi.string().optional(), // ❌ Artık kullanılmıyor
  feeSpeed: Joi.string().valid('slow', 'standard', 'fast').optional(),
  memo: Joi.string().allow('').optional(),
});

// Address validation
export const addressSchema = Joi.object({
  address: Joi.string()
    .pattern(/^(0x[a-fA-F0-9]{40}|T[A-Za-z1-9]{33}|[A-Za-z0-9-_]{48})$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid address format',
    }),
});

// Network validation
export const networkSchema = Joi.object({
  network: Joi.string()
    .valid('ethereum', 'bsc', 'polygon', 'ton', 'tron')
    .required(),
});

// Transaction query validation
export const transactionQuerySchema = Joi.object({
  network: Joi.string().valid('ethereum', 'bsc', 'polygon', 'ton', 'tron').optional(),
  type: Joi.string().valid('send', 'receive', 'swap').optional(),
  limit: Joi.number().integer().min(1).max(100).default(20),
  offset: Joi.number().integer().min(0).default(0),
});

// Gas estimate validation
export const gasEstimateSchema = Joi.object({
  network: Joi.string().valid('ethereum', 'bsc', 'polygon', 'ton', 'tron').required(),
  transactionType: Joi.string().valid('transfer', 'contract').default('transfer'),
});

// Token symbols validation
export const tokenSymbolsSchema = Joi.object({
  symbols: Joi.string().required(), // Comma-separated list
});

/**
 * Custom validators
 */

// Ethereum address validator
export function isValidEthAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// TRON address validator
export function isValidTronAddress(address) {
  return /^T[A-Za-z1-9]{33}$/.test(address);
}

// TON address validator
export function isValidTonAddress(address) {
  // TON addresses are base64 encoded
  return /^[A-Za-z0-9-_]{48}$/.test(address);
}

// Universal address validator
export function isValidAddress(address, network) {
  switch (network) {
    case 'ethereum':
    case 'bsc':
    case 'polygon':
      return isValidEthAddress(address);
    case 'tron':
      return isValidTronAddress(address);
    case 'ton':
      return isValidTonAddress(address);
    default:
      return false;
  }
}

// Seed phrase validator (BIP39)
export function isValidSeedPhrase(phrase) {
  const words = phrase.trim().split(/\s+/);
  return [12, 15, 18, 21, 24].includes(words.length);
}
