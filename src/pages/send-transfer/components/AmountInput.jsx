import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const AmountInput = ({ 
  amount, 
  onChange, 
  error, 
  selectedToken, 
  usdValue, 
  onMaxClick 
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-foreground">Amount</label>
        <button
          type="button"
          onClick={onMaxClick}
          className="text-xs text-accent hover:text-accent/80 transition-colors flex items-center gap-1"
        >
          <Icon name="Wallet" size={12} />
          Max: {selectedToken?.balance} {selectedToken?.symbol}
        </button>
      </div>
      <div className="relative">
        <Input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => onChange(e?.target?.value)}
          error={error}
          required
          className="pr-20"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
          {selectedToken?.symbol}
        </div>
      </div>
      {amount && !error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Icon name="DollarSign" size={14} />
          <span>≈ ${usdValue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      )}
    </div>
  );
};

export default AmountInput;