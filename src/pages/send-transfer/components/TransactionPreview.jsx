import React from 'react';
import Icon from '../../../components/AppIcon';

const TransactionPreview = ({ 
  selectedToken, 
  amount, 
  recipient, 
  network, 
  fee, 
  totalAmount, 
  estimatedTime 
}) => {
  const truncateAddress = (addr) => {
    if (!addr) return '';
    return `${addr?.slice(0, 10)}...${addr?.slice(-8)}`;
  };

  return (
    <div className="glass-card">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="FileText" size={20} color="var(--color-accent)" />
        <h3 className="text-lg font-semibold text-foreground">Transaction Preview</h3>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-background rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Icon
                name={selectedToken?.icon}
                size={24}
                className="text-accent"
              />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Sending</div>
              <div className="text-lg font-semibold text-foreground">
                {amount} {selectedToken?.symbol}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Value</div>
            <div className="text-lg font-semibold text-foreground">
              ${(parseFloat(amount) * selectedToken?.price)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">To</span>
            <span className="text-sm font-mono text-foreground">{truncateAddress(recipient)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Network</span>
            <span className="text-sm font-medium text-foreground">{network}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Network Fee</span>
            <span className="text-sm font-medium text-foreground">{fee}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Estimated Time</span>
            <span className="text-sm font-medium text-accent">{estimatedTime}</span>
          </div>

          <div className="h-px bg-border my-2" />

          <div className="flex items-center justify-between">
            <span className="text-base font-medium text-foreground">Total Amount</span>
            <div className="text-right">
              <div className="text-base font-semibold text-foreground">
                {totalAmount} {selectedToken?.symbol}
              </div>
              <div className="text-xs text-muted-foreground">
                + {fee} fee
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionPreview;