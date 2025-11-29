import React from 'react';
import Icon from '../../../components/AppIcon';

const MascotGuidance = ({ step, fromToken, toToken }) => {
  const getTip = () => {
    if (!fromToken || !toToken) {
      return {
        title: "Select Tokens to Swap",
        message: "Choose the token you want to swap from and the token you want to receive. Make sure to check the exchange rate before proceeding.",
        icon: "ArrowLeftRight",
        color: "text-accent"
      };
    }

    return {
      title: "Ready to Swap!",
      message: "Review the exchange rate and slippage tolerance. The minimum amount you'll receive is guaranteed, protecting you from price changes.",
      icon: "CheckCircle",
      color: "text-success"
    };
  };

  const tips = [
    {
      icon: "Shield",
      text: "Always check the exchange rate before confirming"
    },
    {
      icon: "TrendingDown",
      text: "Lower slippage = safer, but higher chance of failure"
    },
    {
      icon: "Clock",
      text: "Swap during low network congestion for better rates"
    },
    {
      icon: "AlertTriangle",
      text: "Never swap more than you can afford to lose"
    }
  ];

  const guidance = getTip();

  return (
    <div className="space-y-6">
      {/* Mascot Card */}
      <div className="card-elevated">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-surface to-background border border-accent flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 5L25 15L35 20L25 25L20 35L15 25L5 20L15 15L20 5Z" fill="var(--color-accent)" opacity="0.2"/>
                <path d="M20 5L25 15L35 20L25 25L20 35L15 25L5 20L15 15L20 5Z" stroke="var(--color-accent)" strokeWidth="2" strokeLinejoin="bevel"/>
                <circle cx="18" cy="16" r="2" fill="var(--color-accent)"/>
                <circle cx="22" cy="16" r="2" fill="var(--color-accent)"/>
              </svg>
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${guidance.color} animate-pulse`}></div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">Crow's Advice</h3>
            <p className="text-sm text-muted-foreground">Your swap assistant</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-surface/50 rounded-lg">
            <Icon name={guidance.icon} size={20} className={guidance.color} />
            <div>
              <h4 className="font-medium text-foreground mb-1">{guidance.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {guidance.message}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Card */}
      <div className="card-elevated">
        <h3 className="text-lg font-semibold text-foreground mb-4">Swap Tips</h3>
        <div className="space-y-3">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-3 text-sm">
              <Icon name={tip.icon} size={16} className="text-accent mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <div className="p-4 bg-accent/10 border border-accent rounded-lg">
        <div className="flex items-start gap-2">
          <Icon name="Info" size={16} className="text-accent mt-0.5 flex-shrink-0" />
          <div className="text-xs text-foreground">
            <p className="font-medium mb-1">Decentralized Exchange</p>
            <p className="text-muted-foreground">
              Swaps are executed on-chain through decentralized liquidity pools, ensuring transparency and security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MascotGuidance;
