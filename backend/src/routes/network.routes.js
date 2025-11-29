import express from 'express';
import { asyncHandler } from '../middlewares/error.middleware.js';
import * as networkService from '../services/network.service.js';

const router = express.Router();

/**
 * GET /api/network/status
 * Get status of all networks
 */
router.get(
  '/status',
  asyncHandler(async (req, res) => {
    const status = await networkService.getNetworkStatus();

    res.json({
      success: true,
      data: status,
    });
  })
);

/**
 * GET /api/network/status/:networkId
 * Get status of a specific network
 */
router.get(
  '/status/:networkId',
  asyncHandler(async (req, res) => {
    const { networkId } = req.params;

    const status = await networkService.getNetworkStatusById(networkId);

    res.json({
      success: true,
      data: status,
    });
  })
);

/**
 * GET /api/network/supported
 * Get list of supported networks
 */
router.get(
  '/supported',
  asyncHandler(async (req, res) => {
    const networks = networkService.getSupportedNetworks();

    res.json({
      success: true,
      data: networks,
    });
  })
);

/**
 * GET /api/network/:networkId/congestion
 * Check if network is congested
 */
router.get(
  '/:networkId/congestion',
  asyncHandler(async (req, res) => {
    const { networkId } = req.params;

    const isCongested = await networkService.isNetworkCongested(networkId);

    res.json({
      success: true,
      data: {
        networkId,
        isCongested,
        timestamp: new Date().toISOString(),
      },
    });
  })
);

export default router;
