import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const SlippageSettings = ({ slippage, onSlippageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customSlippage, setCustomSlippage] = useState('');

  const presetSlippages = [0.1, 0.5, 1.0];

  const handlePresetClick = (value) => {
    onSlippageChange(value);
    setCustomSlippage('');
  };

  const handleCustomChange = (e) => {
    const value = e.target.value;
    setCustomSlippage(value);
    if (value && !isNaN(value) && parseFloat(value) > 0 && parseFloat(value) <= 50) {
      onSlippageChange(parseFloat(value));
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-accent transition-colors"
      >
        <Icon name="Settings" size={16} className="text-muted-foreground" />
        <span className="text-sm text-foreground">{slippage}%</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 right-0 w-80 bg-surface border border-border rounded-lg shadow-xl z-50 p-4"
            >
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-foreground">Slippage Tolerance</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon name="X" size={16} />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your transaction will revert if the price changes unfavorably by more than this percentage.
                </p>
              </div>

              <div className="flex gap-2 mb-3">
                {presetSlippages.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handlePresetClick(preset)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      slippage === preset && !customSlippage
                        ? 'bg-accent text-background'
                        : 'bg-background border border-border text-foreground hover:border-accent'
                    }`}
                  >
                    {preset}%
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  type="number"
                  value={customSlippage}
                  onChange={handleCustomChange}
                  placeholder="Custom"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm outline-none focus:border-accent transition-colors"
                  min="0"
                  max="50"
                  step="0.1"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </div>

              {slippage > 5 && (
                <div className="mt-3 p-2 bg-warning/10 border border-warning rounded-lg">
                  <div className="flex items-start gap-2">
                    <Icon name="AlertTriangle" size={14} className="text-warning mt-0.5" />
                    <p className="text-xs text-warning">
                      High slippage tolerance may result in unfavorable trades.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SlippageSettings;
