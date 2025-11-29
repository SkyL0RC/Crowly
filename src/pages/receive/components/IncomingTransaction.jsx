import React from 'react';
import Icon from '../../../components/AppIcon';
import TransactionStatus from '../../../components/TransactionsStatus';

const IncomingTransactions = ({ network }) => {
  // TODO: Replace with API call - GET /api/transaction/:address/history?type=receive&network={network}
  // MOCK DATA - Remove when backend is ready
  const transactions = [
    {
      id: 1,
      hash: '0x8f3c2a1b9e4d5f6a7c8b9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
      amount: '0.5',
      symbol: 'ETH',
      usdValue: '1,250.00',
      from: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      timestamp: new Date(Date.now() - 300000),
      confirmations: 12,
      requiredConfirmations: 12,
      status: 'success'
    },
    {
      id: 2,
      hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
      amount: '100',
      symbol: 'USDT',
      usdValue: '100.00',
      from: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8',
      timestamp: new Date(Date.now() - 120000),
      confirmations: 5,
      requiredConfirmations: 12,
      status: 'pending'
    },
    {
      id: 3,
      hash: '0x3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4',
      amount: '0.025',
      symbol: 'BTC',
      usdValue: '875.50',
      from: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      timestamp: new Date(Date.now() - 600000),
      confirmations: 6,
      requiredConfirmations: 6,
      status: 'success'
    }
  ];

  const formatTimestamp = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const truncateHash = (hash) => {
    return `${hash?.slice(0, 10)}...${hash?.slice(-8)}`;
  };

  return (
    <div className="glass-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Icon name="ArrowDownCircle" size={20} color="var(--color-accent)" />
          <h3 className="text-lg font-semibold text-foreground">Incoming Transactions</h3>
        </div>
        <div className="px-3 py-1 rounded-full bg-accent bg-opacity-20 border border-accent border-opacity-30">
          <span className="text-xs font-medium text-accent-foreground">{transactions?.length} Recent</span>
        </div>
      </div>
      <div className="space-y-3">
        {transactions?.map((tx) => (
          <div
            key={tx?.id}
            className="p-4 bg-background rounded-lg border border-border hover:border-accent transition-all duration-150"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-semibold text-foreground">
                    +{tx?.amount} {tx?.symbol}
                  </span>
                  <TransactionStatus status={tx?.status} />
                </div>
                <div className="text-sm text-muted-foreground">
                  ≈ ${tx?.usdValue} USD
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground mb-1">
                  {formatTimestamp(tx?.timestamp)}
                </div>
                {tx?.status === 'pending' && (
                  <div className="text-xs text-accent">
                    {tx?.confirmations}/{tx?.requiredConfirmations} confirmations
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">From:</span>
                <span className="font-mono text-xs text-foreground">{truncateHash(tx?.from)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Hash:</span>
                <span className="font-mono text-xs text-foreground">{truncateHash(tx?.hash)}</span>
              </div>
            </div>

            {tx?.status === 'pending' && (
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <Icon name="Clock" size={14} color="var(--color-accent)" />
                  <span className="text-xs text-muted-foreground">
                    Estimated arrival: {Math.ceil((tx?.requiredConfirmations - tx?.confirmations) * 2)} minutes
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncomingTransactions;