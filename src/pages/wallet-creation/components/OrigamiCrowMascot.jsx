import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const OrigamiCrowMascot = ({ tip, position = 'bottom-right' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState(tip);

  useEffect(() => {
    setIsVisible(true);
    setCurrentTip(tip);
  }, [tip]);

  const positionClasses = {
    'bottom-right': 'fixed bottom-8 right-8',
    'top-right': 'fixed top-24 right-8',
    'bottom-left': 'fixed bottom-8 left-8'
  };

  const tips = {
    security: {
      icon: 'ShieldCheck',
      title: 'Security Tip',
      message: 'Your seed phrase is the master key to your wallet. Store it offline in multiple secure locations.',
      color: 'var(--color-accent)'
    },
    backup: {
      icon: 'Archive',
      title: 'Backup Reminder',
      message: 'Write down your seed phrase on paper. Digital backups can be compromised by hackers.',
      color: 'var(--color-warning)'
    },
    verification: {
      icon: 'CheckCircle2',
      title: 'Verification',
      message: 'Verifying your seed phrase ensures you can recover your wallet if needed. Take your time!',
      color: 'var(--color-success)'
    },
    encryption: {
      icon: 'Lock',
      title: 'Encryption',
      message: 'All wallet data is encrypted locally on your device. Your keys never leave your browser.',
      color: 'var(--color-primary)'
    }
  };

  const tipConfig = tips?.[currentTip] || tips?.security;

  if (!isVisible) return null;

  return (
    <div className={`${positionClasses?.[position]} z-50 hidden lg:block`}>
      <div className="flex items-start gap-4 max-w-sm">
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-surface to-background border border-accent border-opacity-30 flex items-center justify-center animate-glow">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="animate-pulse"
            >
              <path
                d="M20 5L25 15L35 20L25 25L20 35L15 25L5 20L15 15L20 5Z"
                fill="var(--color-background)"
                stroke="var(--color-accent)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <circle cx="18" cy="16" r="1.5" fill="var(--color-accent)" className="animate-pulse" />
              <circle cx="22" cy="16" r="1.5" fill="var(--color-accent)" className="animate-pulse" />
              <path
                d="M15 22L20 25L25 22"
                stroke="var(--color-accent)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-ping" />
        </div>

        <div className="glass-card flex-1 animate-fade-in">
          <div className="flex items-start gap-3 mb-2">
            <Icon name={tipConfig?.icon} size={18} color={tipConfig?.color} />
            <h4 className="text-sm font-semibold text-foreground">{tipConfig?.title}</h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{tipConfig?.message}</p>
        </div>
      </div>
    </div>
  );
};

export default OrigamiCrowMascot;