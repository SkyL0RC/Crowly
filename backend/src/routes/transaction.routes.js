import express from 'express';
import { asyncHandler } from '../middlewares/error.middleware.js';
import { validate, sendTransactionSchema, transactionQuerySchema } from '../middlewares/validation.middleware.js';
import { strictRateLimiter } from '../middlewares/rateLimiter.middleware.js';
import * as transactionService from '../services/transaction.service.js';

const router = express.Router();

/**
 * POST /api/transaction/send
 * Broadcast a pre-signed transaction
 * 
 * ⚠️ SECURITY UPDATE:
 * Frontend'de transaction signing yapılır, backend sadece broadcast eder.
 */
router.post(
  '/send',
  strictRateLimiter,
  validate(sendTransactionSchema),
  asyncHandler(async (req, res) => {
    const { from, to, amount, token, network, signedTx, txHash, memo } = req.body;

    const transaction = await transactionService.broadcastTransaction({
      from,
      to,
      amount,
      token,
      network,
      signedTx, // Frontend'den imzalanmış transaction
      txHash,   // Frontend'den transaction hash
      memo,
    });

    res.status(201).json({
      success: true,
      data: transaction,
      message: 'Transaction broadcast successfully',
    });
  })
);

/**
 * GET /api/transaction/:address/history
 * Get transaction history for an address
 */
router.get(
  '/:address/history',
  validate(transactionQuerySchema, 'query'),
  asyncHandler(async (req, res) => {
    const { address } = req.params;
    const { network, type, limit, offset } = req.query;

    const history = await transactionService.getTransactionHistory(address, {
      network,
      type,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      success: true,
      data: history,
    });
  })
);

/**
 * GET /api/transaction/:txHash
 * Get transaction details by hash
 */
router.get(
  '/:txHash',
  asyncHandler(async (req, res) => {
    const { txHash } = req.params;

    const transaction = await transactionService.getTransactionByHash(txHash);

    res.json({
      success: true,
      data: transaction,
    });
  })
);

/**
 * PUT /api/transaction/:txHash/status
 * Update transaction status (internal use)
 */
router.put(
  '/:txHash/status',
  asyncHandler(async (req, res) => {
    const { txHash } = req.params;
    const { status, confirmations, blockNumber, gasUsed, error } = req.body;

    const transaction = await transactionService.updateTransactionStatus(txHash, status, {
      confirmations,
      blockNumber,
      gasUsed,
      error,
    });

    res.json({
      success: true,
      data: transaction,
      message: 'Transaction status updated',
    });
  })
);

export default router;
