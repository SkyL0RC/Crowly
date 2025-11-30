import React, { useState, useEffect, memo } from 'react';
import Icon from '../../../components/AppIcon';
import CrowChatPanel from './CrowChatPanel';

const OrigamiCrowMascot = memo(() => {
  const [currentTip, setCurrentTip] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const tips = [
    {
      id: 1,
      icon: "TrendingUp",
      message: "Ethereum gas fees are currently low. Great time to make transactions!",
      type: "success"
    },
    {
      id: 2,
      icon: "Shield",
      message: "Remember to backup your seed phrase securely. Never share it with anyone.",
      type: "warning"
    },
    {
      id: 3,
      icon: "Zap",
      message: "Consider diversifying across multiple networks to optimize transaction costs.",
      type: "info"
    },
    {
      id: 4,
      icon: "Lock",
      message: "Enable two-factor authentication for enhanced wallet security.",
      type: "warning"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips?.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [tips?.length]);

  const getTipColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-success text-success';
      case 'warning':
        return 'border-warning text-warning';
      case 'info':
        return 'border-accent text-accent';
      default:
        return 'border-accent text-accent';
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="glass-card relative overflow-hidden">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-background transition-colors"
          aria-label="Close tips"
        >
          <Icon name="X" size={16} />
        </button>
        <div className="flex items-start gap-4">
          <button
            onClick={() => setIsChatOpen(true)}
            className="relative group cursor-pointer"
            aria-label="Open Crow Assistant"
          >
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-surface to-background border border-accent flex items-center justify-center animate-glow transition-transform group-hover:scale-105">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 5L25 15L35 20L25 25L20 35L15 25L5 20L15 15L20 5Z" fill="var(--color-accent)" opacity="0.2"/>
                <path d="M20 5L25 15L35 20L25 25L20 35L15 25L5 20L15 15L20 5Z" stroke="var(--color-accent)" strokeWidth="2" strokeLinejoin="bevel"/>
                <circle cx="18" cy="16" r="2" fill="var(--color-accent)"/>
                <circle cx="22" cy="16" r="2" fill="var(--color-accent)"/>
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-success animate-pulse"></div>
            <div className="absolute inset-0 rounded-lg bg-accent/0 group-hover:bg-accent/10 transition-colors"></div>
          </button>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-semibold text-foreground">Crow's Smart Tip</h3>
              <Icon name={tips?.[currentTip]?.icon} size={14} className={getTipColor(tips?.[currentTip]?.type)} />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">
              {tips?.[currentTip]?.message}
            </p>
            <button
              onClick={() => setIsChatOpen(true)}
              className="text-xs text-accent hover:text-accent/80 transition-colors flex items-center gap-1"
            >
              <Icon name="MessageCircle" size={12} />
              Click to chat with Crow
            </button>
            <div className="flex items-center gap-1 mt-3">
              {tips?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTip(index)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentTip ? 'w-6 bg-accent' : 'w-1 bg-border'
                  }`}
                  aria-label={`View tip ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <CrowChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
});

OrigamiCrowMascot.displayName = 'OrigamiCrowMascot';

export default OrigamiCrowMascot;