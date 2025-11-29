import React from 'react';
import Button from '../../../components/ui/Button';

const AmountInput = ({ value, onChange, token, error }) => {
  const handleMaxClick = () => {
    if (token && token.balance) {
      onChange(token.balance);
    }
  };

  const handlePercentage = (percent) => {
    if (token && token.balance) {
      const amount = (parseFloat(token.balance) * percent / 100).toFixed(6);
      onChange(amount);
    }
  };

  return (
    <div className="flex-1">
      <div className={`flex items-center gap-2 input-base ${error ? 'border-destructive' : ''}`}>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
          className="flex-1 bg-transparent text-foreground text-lg font-medium outline-none"
          step="0.000001"
          min="0"
        />
        <div className="flex gap-1">
          <button
            onClick={() => handlePercentage(25)}
            className="px-2 py-1 text-xs font-medium text-accent hover:bg-accent hover:text-background rounded transition-colors"
          >
            25%
          </button>
          <button
            onClick={() => handlePercentage(50)}
            className="px-2 py-1 text-xs font-medium text-accent hover:bg-accent hover:text-background rounded transition-colors"
          >
            50%
          </button>
          <button
            onClick={handleMaxClick}
            className="px-2 py-1 text-xs font-medium text-accent hover:bg-accent hover:text-background rounded transition-colors"
          >
            MAX
          </button>
        </div>
      </div>
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  );
};

export default AmountInput;
