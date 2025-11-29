import express from 'express';
import { asyncHandler } from '../middlewares/error.middleware.js';
import { validate, gasEstimateSchema } from '../middlewares/validation.middleware.js';
import * as gasService from '../services/gas.service.js';

const router = express.Router();

/**
 * GET /api/gas/estimate
 * Get gas fee estimates
 */
router.get(
  '/estimate',
  validate(gasEstimateSchema, 'query'),
  asyncHandler(async (req, res) => {
    const { network, transactionType } = req.query;

    const estimate = await gasService.getGasEstimate(network, transactionType);

    res.json({
      success: true,
      data: estimate,
    });
  })
);

/**
 * GET /api/gas/history/:network
 * Get historical gas prices
 */
router.get(
  '/history/:network',
  asyncHandler(async (req, res) => {
    const { network } = req.params;
    const { hours = 24 } = req.query;

    const history = await gasService.getGasHistory(network, parseInt(hours));

    res.json({
      success: true,
      data: history,
    });
  })
);

export default router;
