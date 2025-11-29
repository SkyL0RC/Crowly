import React from 'react';
import Icon from '../../../components/AppIcon';

const AddressHistory = ({ network }) => {
  const addressHistory = [
    {
      id: 1,
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      network: 'ethereum',
      generatedAt: new Date('2025-11-20T10:30:00'),
      lastUsed: new Date('2025-11-26T09:15:00'),
      transactionCount: 15
    },
    {
      id: 2,
      address: 'TYDzsYUEpvnYmQk4zGP9sWWcTEd2MiAtW6',
      network: 'tron',
      generatedAt: new Date('2025-11-18T14:20:00'),
      lastUsed: new Date('2025-11-25T16:45:00'),
      transactionCount: 8
    },
    {
      id: 3,
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      network: 'bitcoin',
      generatedAt: new Date('2025-11-15T08:00:00'),
      lastUsed: new Date('2025-11-24T11:30:00'),
      transactionCount: 3
    }
  ];

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const truncateAddress = (addr) => {
    return `${addr?.slice(0, 10)}...${addr?.slice(-8)}`;
  };

  const getNetworkIcon = (net) => {
    const icons = {
      ethereum: 'Hexagon',
      tron: 'Triangle',
      bitcoin: 'Circle',
      solana: 'Zap'
    };
    return icons?.[net] || 'Wallet';
  };

  return (
    <div className="glass-card">
      <div className="flex items-center gap-2 mb-6">
        <Icon name="History" size={20} color="var(--color-accent)" />
        <h3 className="text-lg font-semibold text-foreground">Address History</h3>
      </div>
      <div className="space-y-3">
        {addressHistory?.map((item) => (
          <div
            key={item?.id}
            className="p-4 bg-background rounded-lg border border-border hover:border-accent transition-all duration-150"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 rounded-lg bg-surface">
                  <Icon name={getNetworkIcon(item?.network)} size={20} color="var(--color-accent)" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="font-mono text-sm text-foreground mb-1">
                    {truncateAddress(item?.address)}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {item?.network}
                  </div>
                </div>
              </div>
              <button
                className="p-2 rounded-lg bg-surface border border-border hover:border-accent transition-all duration-150"
                title="Copy address"
                onClick={() => navigator.clipboard?.writeText(item?.address)}
              >
                <Icon name="Copy" size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Generated</div>
                <div className="text-xs text-foreground">{formatDate(item?.generatedAt)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Last Used</div>
                <div className="text-xs text-foreground">{formatDate(item?.lastUsed)}</div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Transactions</span>
                <span className="text-xs font-medium text-accent">{item?.transactionCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressHistory;