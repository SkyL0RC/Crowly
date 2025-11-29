import React from 'react';
import Icon from '../../../components/AppIcon';

const PriceInfo = ({ fromToken, toToken, priceData, slippage }) => {
  if (!priceData || !fromToken || !toToken) return null;

  const minimumReceived = (parseFloat(priceData.rate) * (1 - slippage / 100)).toFixed(6);

  return (
    <div className="mt-6 p-4 bg-surface/50 rounded-lg border border-border space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Rate</span>
        <span className="font-medium text-foreground">
          1 {fromToken.symbol} = {priceData.rate.toFixed(6)} {toToken.symbol}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Price Impact</span>
        <span className={`font-medium ${priceData.impact > 1 ? 'text-warning' : 'text-success'}`}>
          ~{priceData.impact.toFixed(2)}%
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Slippage Tolerance</span>
        <span className="font-medium text-foreground">{slippage}%</span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Minimum Received</span>
        <span className="font-medium text-foreground">
          {minimumReceived} {toToken.symbol}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Network Fee</span>
        <span className="font-medium text-foreground">~{priceData.fee}%</span>
      </div>

      <div className="pt-3 border-t border-border">
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Icon name="Info" size={14} className="mt-0.5 flex-shrink-0" />
          <p>
            The actual amount you receive may differ due to market volatility and network conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PriceInfo;
