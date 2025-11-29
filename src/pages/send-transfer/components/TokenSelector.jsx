import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TokenSelector = ({ selectedToken, onTokenSelect, tokens }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTokenSelect = (token) => {
    onTokenSelect(token);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-foreground mb-2">
        Select Token
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-surface border border-border rounded-xl hover:border-accent transition-all duration-150"
      >
        <div className="flex items-center gap-3">
          <Image
            src={selectedToken?.icon}
            alt={selectedToken?.iconAlt}
            className="w-8 h-8 rounded-full"
          />
          <div className="text-left">
            <div className="font-medium text-foreground">{selectedToken?.symbol}</div>
            <div className="text-xs text-muted-foreground">{selectedToken?.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">
              {selectedToken?.balance} {selectedToken?.symbol}
            </div>
            <div className="text-xs text-muted-foreground">
              ${selectedToken?.usdValue?.toLocaleString()}
            </div>
          </div>
          <Icon name={isOpen ? 'ChevronUp' : 'ChevronDown'} size={20} />
        </div>
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
            {tokens?.map((token) => (
              <button
                key={token?.id}
                type="button"
                onClick={() => handleTokenSelect(token)}
                className="w-full flex items-center justify-between p-4 hover:bg-background transition-all duration-150 border-b border-border last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={token?.icon}
                    alt={token?.iconAlt}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="text-left">
                    <div className="font-medium text-foreground">{token?.symbol}</div>
                    <div className="text-xs text-muted-foreground">{token?.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">
                    {token?.balance} {token?.symbol}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ${token?.usdValue?.toLocaleString()}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TokenSelector;