import React from 'react';
import Icon from '../../../components/AppIcon';
import TransactionStatus from '../../../components/TransactionsStatus';

const RecentTransactions = ({ transactions }) => {
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'send':
        return 'ArrowUpRight';
      case 'receive':
        return 'ArrowDownLeft';
      case 'swap':
        return 'ArrowLeftRight';
      default:
        return 'Activity';
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'send':
        return 'text-error';
      case 'receive':
        return 'text-success';
      case 'swap':
        return 'text-accent';
      default:
        return 'text-foreground';
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 60000);
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="glass-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Recent Transactions</h2>
        <button className="text-sm font-medium text-accent hover:text-accent-foreground transition-colors">
          View All
        </button>
      </div>
      <div className="space-y-3">
        {transactions?.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Inbox" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No transactions yet</p>
          </div>
        ) : (
          transactions?.map((tx) => (
            <div
              key={tx?.id}
              className="flex items-center justify-between p-4 rounded-lg bg-background border border-border hover:border-accent transition-all duration-150 cursor-pointer"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`p-2 rounded-lg bg-surface ${getTransactionColor(tx?.type)}`}>
                  <Icon name={getTransactionIcon(tx?.type)} size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-foreground">{tx?.description}</p>
                    <TransactionStatus status={tx?.status} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon name={tx?.networkIcon} size={12} />
                      {tx?.network}
                    </span>
                    <span>•</span>
                    <span>{formatDate(tx?.timestamp)}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className={`font-semibold ${getTransactionColor(tx?.type)}`}>
                  {tx?.type === 'send' ? '-' : '+'}{tx?.amount}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  ${tx?.usdValue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;