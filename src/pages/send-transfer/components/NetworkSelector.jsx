import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const NetworkSelector = ({ selectedNetwork, onNetworkSelect, networks }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNetworkSelect = (network) => {
    onNetworkSelect(network);
    setIsOpen(false);
  };

  const currentNetwork = networks?.find(n => n?.id === selectedNetwork);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-foreground mb-2">
        Network
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-surface border border-border rounded-xl hover:border-accent transition-all duration-150"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-background">
            <Icon name={currentNetwork?.icon} size={20} color="var(--color-accent)" />
          </div>
          <div className="text-left">
            <div className="font-medium text-foreground">{currentNetwork?.name}</div>
            <div className="text-xs text-muted-foreground">{currentNetwork?.feeLabel}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium text-accent">{currentNetwork?.currentFee}</div>
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
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-lg z-50">
            {networks?.map((network) => (
              <button
                key={network?.id}
                type="button"
                onClick={() => handleNetworkSelect(network?.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-background transition-all duration-150 border-b border-border last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-background">
                    <Icon name={network?.icon} size={20} color="var(--color-accent)" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-foreground">{network?.name}</div>
                    <div className="text-xs text-muted-foreground">{network?.feeLabel}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-accent">{network?.currentFee}</div>
                  </div>
                  {selectedNetwork === network?.id && (
                    <Icon name="Check" size={16} color="var(--color-accent)" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default NetworkSelector;