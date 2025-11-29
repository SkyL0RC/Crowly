import express from 'express';
import { asyncHandler } from '../middlewares/error.middleware.js';
import { validate, tokenSymbolsSchema } from '../middlewares/validation.middleware.js';
import * as priceService from '../services/price.service.js';

const router = express.Router();

/**
 * GET /api/prices
 * Get token prices
 */
router.get(
  '/',
  validate(tokenSymbolsSchema, 'query'),
  asyncHandler(async (req, res) => {
    const { symbols } = req.query;
    const symbolArray = symbols.split(',').map(s => s.trim().toUpperCase());

    const prices = await priceService.getTokenPrices(symbolArray);

    res.json({
      success: true,
      data: prices,
    });
  })
);

/**
 * GET /api/prices/:symbol
 * Get price for a specific token
 */
router.get(
  '/:symbol',
  asyncHandler(async (req, res) => {
    const { symbol } = req.params;

    const price = await priceService.getTokenPrice(symbol.toUpperCase());

    res.json({
      success: true,
      data: price,
    });
  })
);

/**
 * GET /api/prices/market/data
 * Get market data for tokens
 */
router.get(
  '/market/data',
  asyncHandler(async (req, res) => {
    const { symbols } = req.query;
    
    if (!symbols) {
      return res.status(400).json({
        success: false,
        error: { message: 'Symbols parameter is required' },
      });
    }

    const symbolArray = symbols.split(',').map(s => s.trim().toUpperCase());
    const marketData = await priceService.getMarketData(symbolArray);

    res.json({
      success: true,
      data: marketData,
    });
  })
);

export default router;
