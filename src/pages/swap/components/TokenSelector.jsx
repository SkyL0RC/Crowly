import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const TokenSelector = ({ tokens, selectedToken, onSelectToken, excludeToken }) => {
  const [isOpen, setIsOpen] = useState(false);

  const filteredTokens = tokens.filter(token => token.id !== excludeToken?.id);

  const handleSelect = (token) => {
    onSelectToken(token);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 rounded-lg bg-surface border border-border hover:border-accent transition-colors min-w-[140px]"
      >
        {selectedToken ? (
          <>
            <Icon name={selectedToken.icon} size={20} className="text-accent" />
            <span className="font-medium text-foreground">{selectedToken.symbol}</span>
          </>
        ) : (
          <span className="text-muted-foreground">Select token</span>
        )}
        <Icon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          className="ml-auto text-muted-foreground"
        />
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
              className="absolute top-full mt-2 left-0 w-72 bg-surface border border-border rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
            >
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                  Select a token
                </div>
                {filteredTokens.map((token) => (
                  <button
                    key={token.id}
                    onClick={() => handleSelect(token)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-background transition-colors text-left"
                  >
                    <Icon name={token.icon} size={24} className="text-accent" />
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{token.symbol}</div>
                      <div className="text-xs text-muted-foreground">{token.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">
                        {parseFloat(token.balance).toFixed(4)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ${token.usdValue.toFixed(2)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TokenSelector;
