import React from 'react';
import Icon from '../../../components/AppIcon';

const NetworkSelector = ({ selectedNetwork, onNetworkChange }) => {
  const networks = [
    { id: 'ethereum', name: 'Ethereum', icon: 'Hexagon', color: 'text-blue-400' },
    { id: 'tron', name: 'TRON', icon: 'Triangle', color: 'text-red-400' },
    { id: 'solana', name: 'Solana', icon: 'Zap', color: 'text-purple-400' },
  ];

  return (
    <div className="card-elevated">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Network</h3>
      <div className="flex gap-3">
        {networks.map((network) => (
          <button
            key={network.id}
            onClick={() => onNetworkChange(network.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
              selectedNetwork === network.id
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border bg-surface hover:border-accent/50 text-foreground'
            }`}
          >
            <Icon name={network.icon} size={18} className={selectedNetwork === network.id ? '' : network.color} />
            <span className="font-medium">{network.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NetworkSelector;
