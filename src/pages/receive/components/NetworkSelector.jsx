import React from 'react';
import Icon from '../../../components/AppIcon';

const NetworkSelector = ({ selectedNetwork, onNetworkChange }) => {
  const networks = [
    {
      id: 'ethereum',
      name: 'Ethereum',
      icon: 'Hexagon',
      symbol: 'ETH',
      color: 'var(--color-accent)'
    },
    {
      id: 'tron',
      name: 'TRON',
      icon: 'Triangle',
      symbol: 'TRX',
      color: '#E51A31'
    },
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      icon: 'Circle',
      symbol: 'BTC',
      color: '#F7931A'
    },
    {
      id: 'solana',
      name: 'Solana',
      icon: 'Zap',
      symbol: 'SOL',
      color: '#14F195'
    }
  ];

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-6">
        <Icon name="Network" size={20} color="var(--color-accent)" />
        <h3 className="text-lg font-semibold text-foreground">Select Network</h3>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {networks?.map((network) => (
          <button
            key={network?.id}
            onClick={() => onNetworkChange(network?.id)}
            className={`p-4 rounded-xl border transition-all duration-200 ${
              selectedNetwork === network?.id
                ? 'bg-surface border-accent shadow-[0_0_20px_rgba(72,214,176,0.3)]'
                : 'bg-surface border-border hover:border-accent hover:shadow-[0_0_10px_rgba(72,214,176,0.2)]'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`p-3 rounded-lg ${
                selectedNetwork === network?.id ? 'bg-background' : 'bg-background opacity-70'
              }`}>
                <Icon name={network?.icon} size={24} color={network?.color} />
              </div>
              <div className="text-center">
                <div className="font-medium text-foreground text-sm">{network?.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{network?.symbol}</div>
              </div>
              {selectedNetwork === network?.id && (
                <Icon name="CheckCircle2" size={16} color="var(--color-accent)" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NetworkSelector;