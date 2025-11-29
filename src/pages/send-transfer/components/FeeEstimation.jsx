import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const FeeEstimation = ({ network, selectedSpeed, onSpeedSelect, feeOptions }) => {
  const speedConfig = {
    slow: {
      label: 'Slow',
      icon: 'Turtle',
      time: '~5-10 min',
      color: 'text-muted-foreground'
    },
    standard: {
      label: 'Standard',
      icon: 'Zap',
      time: '~2-5 min',
      color: 'text-accent'
    },
    fast: {
      label: 'Fast',
      icon: 'Rocket',
      time: '~30 sec',
      color: 'text-success'
    }
  };

  return (
    <div className="glass-card">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Gauge" size={20} color="var(--color-accent)" />
        <h3 className="text-lg font-semibold text-foreground">Network Fee</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {Object.entries(feeOptions)?.map(([speed, data]) => {
          const config = speedConfig?.[speed];
          const isSelected = selectedSpeed === speed;

          return (
            <button
              key={speed}
              type="button"
              onClick={() => onSpeedSelect(speed)}
              className={`p-4 rounded-xl border transition-all duration-150 text-left ${
                isSelected
                  ? 'border-accent bg-background shadow-lg'
                  : 'border-border bg-surface hover:border-accent/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon 
                  name={config?.icon} 
                  size={16} 
                  className={config?.color}
                />
                <span className="text-sm font-medium text-foreground">
                  {config?.label}
                </span>
              </div>
              <div className="text-lg font-semibold text-foreground mb-1">
                {data?.fee}
              </div>
              <div className="text-xs text-muted-foreground">
                {config?.time}
              </div>
              <div className="text-xs text-accent mt-1">
                ${data?.usdFee?.toFixed(2)}
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-4 p-3 bg-background rounded-lg border border-border">
        <div className="flex items-start gap-2">
          <Icon name="Info" size={16} className="text-accent mt-0.5" />
          <div className="text-xs text-muted-foreground">
            {network === 'ethereum' && 'Gas fees vary based on network congestion. Higher fees ensure faster transaction confirmation.'}
            {network === 'tron' && 'TRON uses bandwidth and energy for transactions. Insufficient resources will consume TRX.'}
            {network === 'bitcoin' && 'Bitcoin fees are calculated per byte. Higher fees prioritize your transaction in the mempool.'}
            {network === 'solana' && 'Solana offers consistently low fees with fast confirmation times across all speeds.'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeEstimation;