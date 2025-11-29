import express from 'express';
import { asyncHandler } from '../middlewares/error.middleware.js';
import { validate, createWalletSchema, addressSchema, networkSchema } from '../middlewares/validation.middleware.js';
import { strictRateLimiter } from '../middlewares/rateLimiter.middleware.js';
import * as walletService from '../services/wallet.service.js';

const router = express.Router();

/**
 * POST /api/wallet/create
 * Create a new wallet or import existing one
 */
router.post(
  '/create',
  strictRateLimiter,
  validate(createWalletSchema),
  asyncHandler(async (req, res) => {
    const { method, network, seedPhrase, password } = req.body;
    const userId = req.user?.id; // TODO: Add auth middleware

    const wallet = await walletService.createWallet({
      method,
      network,
      seedPhrase,
      password,
      userId,
    });

    res.status(201).json({
      success: true,
      data: wallet,
      message: `Wallet ${method === 'generate' ? 'created' : 'imported'} successfully`,
    });
  })
);

/**
 * POST /api/wallet/import
 * Import wallet from seed phrase
 */
router.post(
  '/import',
  strictRateLimiter,
  validate(createWalletSchema),
  asyncHandler(async (req, res) => {
    const { seedPhrase, network, password } = req.body;
    const userId = req.user?.id;

    if (!seedPhrase) {
      return res.status(400).json({
        success: false,
        error: { message: 'Seed phrase is required for import' },
      });
    }

    const wallet = await walletService.importWallet({
      seedPhrase,
      network,
      password,
      userId,
    });

    res.status(201).json({
      success: true,
      data: wallet,
      message: 'Wallet imported successfully',
    });
  })
);

/**
 * GET /api/wallet/:address/balance
 * Get wallet balance and token balances
 */
router.get(
  '/:address/balance',
  validate(networkSchema, 'query'),
  asyncHandler(async (req, res) => {
    const { address } = req.params;
    const { network } = req.query;

    const balance = await walletService.getWalletBalance(address, network);

    res.json({
      success: true,
      data: balance,
    });
  })
);

/**
 * GET /api/wallet/:address
 * Get wallet details
 */
router.get(
  '/:address',
  validate(networkSchema, 'query'),
  asyncHandler(async (req, res) => {
    const { address } = req.params;
    const { network } = req.query;

    const wallet = await walletService.getWalletByAddress(address, network);

    res.json({
      success: true,
      data: wallet,
    });
  })
);

/**
 * GET /api/wallet/user/:userId
 * Get all wallets for a user
 */
router.get(
  '/user/:userId',
  asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const wallets = await walletService.getUserWallets(userId);

    res.json({
      success: true,
      data: wallets,
    });
  })
);

/**
 * POST /api/wallet/:walletId/export
 * Export wallet private key (requires password)
 */
router.post(
  '/:walletId/export',
  strictRateLimiter,
  asyncHandler(async (req, res) => {
    const { walletId } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Password is required' },
      });
    }

    const exportedWallet = await walletService.exportWallet(walletId, password);

    res.json({
      success: true,
      data: exportedWallet,
      warning: 'Never share your private key with anyone!',
    });
  })
);

/**
 * DELETE /api/wallet/:walletId
 * Delete a wallet (requires password)
 */
router.delete(
  '/:walletId',
  strictRateLimiter,
  asyncHandler(async (req, res) => {
    const { walletId } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Password is required' },
      });
    }

    await walletService.deleteWallet(walletId, password);

    res.json({
      success: true,
      message: 'Wallet deleted successfully',
    });
  })
);

export default router;
