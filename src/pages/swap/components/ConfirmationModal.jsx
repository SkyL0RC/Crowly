import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConfirmationModal = ({ 
  fromToken, 
  toToken, 
  fromAmount, 
  toAmount, 
  priceData, 
  slippage,
  onConfirm, 
  onCancel, 
  isLoading 
}) => {
  const minimumReceived = (parseFloat(toAmount) * (1 - slippage / 100)).toFixed(6);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-surface border border-border rounded-xl shadow-2xl max-w-md w-full p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Confirm Swap</h2>
            <button
              onClick={onCancel}
              className="text-muted-foreground hover:text-foreground transition-colors"
              disabled={isLoading}
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Swap Details */}
          <div className="space-y-4 mb-6">
            {/* From */}
            <div className="p-4 bg-background rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">You pay</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon name={fromToken.icon} size={32} className="text-accent" />
                  <div>
                    <div className="text-lg font-semibold text-foreground">
                      {parseFloat(fromAmount).toFixed(6)}
                    </div>
                    <div className="text-sm text-muted-foreground">{fromToken.symbol}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <div className="p-2 rounded-full bg-accent/10">
                <Icon name="ArrowDown" size={20} className="text-accent" />
              </div>
            </div>

            {/* To */}
            <div className="p-4 bg-background rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">You receive (estimated)</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon name={toToken.icon} size={32} className="text-accent" />
                  <div>
                    <div className="text-lg font-semibold text-success">
                      {parseFloat(toAmount).toFixed(6)}
                    </div>
                    <div className="text-sm text-muted-foreground">{toToken.symbol}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-3 mb-6 p-4 bg-background rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Exchange Rate</span>
              <span className="text-foreground font-medium">
                1 {fromToken.symbol} = {priceData?.rate.toFixed(6)} {toToken.symbol}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Minimum Received</span>
              <span className="text-foreground font-medium">
                {minimumReceived} {toToken.symbol}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price Impact</span>
              <span className={`font-medium ${priceData?.impact > 1 ? 'text-warning' : 'text-success'}`}>
                ~{priceData?.impact.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Slippage Tolerance</span>
              <span className="text-foreground font-medium">{slippage}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Network Fee</span>
              <span className="text-foreground font-medium">~{priceData?.fee}%</span>
            </div>
          </div>

          {/* Warning */}
          <div className="mb-6 p-3 bg-warning/10 border border-warning rounded-lg">
            <div className="flex items-start gap-2">
              <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5 flex-shrink-0" />
              <p className="text-xs text-warning">
                Output is estimated. You will receive at least {minimumReceived} {toToken.symbol} or the transaction will revert.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" size={18} className="animate-spin mr-2" />
                  Swapping...
                </>
              ) : (
                'Confirm Swap'
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmationModal;
