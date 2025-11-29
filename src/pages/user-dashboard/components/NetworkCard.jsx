import React from 'react';
import Icon from '../../../components/AppIcon';

const NetworkCard = ({ network, balance, usdValue, gasInfo, status, icon }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'healthy':
        return 'text-success';
      case 'congested':
        return 'text-warning';
      case 'slow':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'healthy':
        return 'CheckCircle2';
      case 'congested':
        return 'AlertCircle';
      case 'slow':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  return (
    <div className="glass-card hover:shadow-lg transition-all duration-150 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-background border border-border group-hover:border-accent transition-all duration-150">
            <Icon name={icon} size={24} color="var(--color-accent)" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{network}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Icon name={getStatusIcon()} size={14} className={getStatusColor()} />
              <span className={`text-xs font-medium ${getStatusColor()}`}>
                {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-2xl font-bold text-foreground">{balance}</p>
          <p className="text-sm text-muted-foreground mt-1">
            ≈ ${usdValue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Gas Fee</span>
            <span className="text-xs font-medium text-foreground">{gasInfo}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkCard;