import React from 'react';
import Icon from '../../../components/AppIcon';

const SwapPreview = ({ fromToken, toToken, fromAmount, toAmount, priceData, slippage }) => {
  if (!fromToken || !toToken || !fromAmount || !toAmount) return null;

  const minimumReceived = (parseFloat(toAmount) * (1 - slippage / 100)).toFixed(6);

  return (
    <div className="card-elevated">
      <h3 className="text-lg font-semibold text-foreground mb-4">Swap Summary</h3>
      
      <div className="space-y-4">
        {/* From */}
        <div className="flex items-center justify-between p-3 bg-surface/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Icon name={fromToken.icon} size={32} className="text-accent" />
            <div>
              <div className="text-sm text-muted-foreground">You pay</div>
              <div className="font-medium text-foreground">{fromToken.name}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-foreground">
              {parseFloat(fromAmount).toFixed(6)}
            </div>
            <div className="text-sm text-muted-foreground">{fromToken.symbol}</div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="p-2 rounded-full bg-accent/10">
            <Icon name="ArrowDown" size={20} className="text-accent" />
          </div>
        </div>

        {/* To */}
        <div className="flex items-center justify-between p-3 bg-surface/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Icon name={toToken.icon} size={32} className="text-accent" />
            <div>
              <div className="text-sm text-muted-foreground">You receive (estimated)</div>
              <div className="font-medium text-foreground">{toToken.name}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-success">
              {parseFloat(toAmount).toFixed(6)}
            </div>
            <div className="text-sm text-muted-foreground">{toToken.symbol}</div>
          </div>
        </div>

        {/* Details */}
        <div className="pt-4 border-t border-border space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Exchange Rate</span>
            <span className="text-foreground font-medium">
              1 {fromToken.symbol} = {priceData?.rate.toFixed(6)} {toToken.symbol}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Minimum Received</span>
            <span className="text-foreground font-medium">
              {minimumReceived} {toToken.symbol}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Estimated Fee</span>
            <span className="text-foreground font-medium">~{priceData?.fee}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapPreview;
