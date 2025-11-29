import React from 'react';
import Icon from '../../../components/AppIcon';

const MascotGuidance = ({ network, selectedSpeed, amount, balance }) => {
  const getGuidanceMessage = () => {
    if (!amount || parseFloat(amount) === 0) {
      return "Enter the amount you wish to send. I'll help you optimize the transaction fees.";
    }

    if (parseFloat(amount) > parseFloat(balance)) {
      return "Insufficient balance detected. Please reduce the amount or add more funds to your wallet.";
    }

    if (selectedSpeed === 'fast') {
      return `Fast speed selected for ${network}. Your transaction will be prioritized, but fees are higher. Consider standard speed if not urgent.`;
    }

    if (selectedSpeed === 'slow') {
      return `Slow speed selected. You'll save on fees, but confirmation may take longer during high network activity.`;
    }

    if (network === 'ethereum' && selectedSpeed === 'standard') {
      return "Standard speed is optimal for most Ethereum transactions. Current gas prices are moderate.";
    }

    if (network === 'tron') {
      return "TRON transactions are energy-efficient. Ensure you have sufficient bandwidth or energy to avoid TRX consumption.";
    }

    if (network === 'bitcoin') {
      return "Bitcoin fees are calculated per byte. Your transaction size affects the total fee amount.";
    }

    if (network === 'solana') {
      return "Solana offers consistently fast and low-cost transactions. All speeds provide excellent performance.";
    }

    return "Transaction details look good. Review the preview and confirm when ready to proceed.";
  };

  const getIconColor = () => {
    if (!amount || parseFloat(amount) === 0) return 'var(--color-accent)';
    if (parseFloat(amount) > parseFloat(balance)) return 'var(--color-error)';
    if (selectedSpeed === 'fast') return 'var(--color-warning)';
    return 'var(--color-success)';
  };

  return (
    <div className="glass-card bg-gradient-to-br from-surface to-background">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-background border border-accent/30 animate-glow">
          <Icon name="Bird" size={24} color="var(--color-accent)" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-sm font-semibold text-foreground">Origami Crow Insight</h4>
            <Icon name="Sparkles" size={14} color={getIconColor()} />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {getGuidanceMessage()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MascotGuidance;