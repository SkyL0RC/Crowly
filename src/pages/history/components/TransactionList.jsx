import React from 'react';
import Icon from '../../../components/AppIcon';

const TransactionList = ({ transactions }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'pending':
        return 'text-warning';
      case 'failed':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'send':
        return { name: 'ArrowUpRight', color: 'text-destructive' };
      case 'receive':
        return { name: 'ArrowDownLeft', color: 'text-success' };
      case 'swap':
        return { name: 'ArrowLeftRight', color: 'text-accent' };
      default:
        return { name: 'Activity', color: 'text-foreground' };
    }
  };

  const getNetworkIcon = (network) => {
    switch (network) {
      case 'ethereum':
        return 'Hexagon';
      case 'tron':
        return 'Triangle';
      case 'bitcoin':
        return 'Circle';
      case 'solana':
        return 'Zap';
      default:
        return 'Circle';
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // TODO: Add toast notification
  };

  return (
    <div className="card-elevated overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Network
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Asset
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Address
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((tx) => {
              const typeIcon = getTypeIcon(tx.type);
              return (
                <tr key={tx.id} className="hover:bg-surface/30 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Icon name={typeIcon.name} size={18} className={typeIcon.color} />
                      <span className="text-sm font-medium text-foreground capitalize">
                        {tx.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Icon name={getNetworkIcon(tx.network)} size={16} className="text-accent" />
                      <span className="text-sm text-foreground capitalize">{tx.network}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">{tx.token}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className={`text-sm font-medium ${tx.type === 'send' ? 'text-destructive' : 'text-success'}`}>
                        {tx.type === 'send' ? '-' : '+'}{tx.amount} {tx.token}
                      </div>
                      <div className="text-xs text-muted-foreground">${tx.usdValue}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      onClick={() => copyToClipboard(tx.type === 'send' ? tx.to : tx.from)}
                      className="flex items-center gap-1 text-sm text-accent hover:text-accent/80 transition-colors font-mono"
                      title="Click to copy"
                    >
                      {truncateAddress(tx.type === 'send' ? tx.to : tx.from)}
                      <Icon name="Copy" size={12} />
                    </button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      tx.status === 'completed' ? 'bg-success/10 text-success' :
                      tx.status === 'pending' ? 'bg-warning/10 text-warning' :
                      'bg-destructive/10 text-destructive'
                    }`}>
                      <Icon name={
                        tx.status === 'completed' ? 'CheckCircle' :
                        tx.status === 'pending' ? 'Clock' :
                        'XCircle'
                      } size={12} />
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(tx.timestamp)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <a
                      href={`https://etherscan.io/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent/80 transition-colors"
                      title="View on explorer"
                    >
                      <Icon name="ExternalLink" size={16} />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
