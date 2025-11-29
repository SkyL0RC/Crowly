import React from 'react';
import Icon from '../../../components/AppIcon';

const BalanceOverview = ({ totalBalance, percentageChange, lastUpdated }) => {
  const isPositive = percentageChange >= 0;

  return (
    <div className="glass-card">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Total Portfolio Value</p>
          <h1 className="text-5xl font-bold text-foreground mb-2">
            ${totalBalance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h1>
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-success' : 'text-error'}`}>
              <Icon name={isPositive ? 'TrendingUp' : 'TrendingDown'} size={16} />
              {isPositive ? '+' : ''}{percentageChange?.toFixed(2)}%
            </span>
            <span className="text-xs text-muted-foreground">Last 24h</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 rounded-lg bg-background border border-border hover:border-accent transition-all duration-150">
            <Icon name="RefreshCw" size={20} />
          </button>
          <button className="p-3 rounded-lg bg-background border border-border hover:border-accent transition-all duration-150">
            <Icon name="Eye" size={20} />
          </button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
    </div>
  );
};

export default BalanceOverview;