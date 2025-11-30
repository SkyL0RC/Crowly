import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadges = () => {
  const badges = [
    {
      icon: 'Shield',
      label: 'On-Device Encryption',
      description: 'Keys never leave your browser'
    },
    {
      icon: 'Lock',
      label: 'BIP39 Compliant',
      description: 'Industry standard security'
    },
    {
      icon: 'Eye',
      label: 'Open Source',
      description: 'Audited and transparent'
    },
    {
      icon: 'Zap',
      label: 'Multi-Chain',
      description: 'EVM, TRON, BTC, Solana'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {badges?.map((badge, index) => (
        <div
          key={index}
          className="glass-card text-center hover:border-accent hover:border-opacity-50 transition-all duration-300"
        >
          <div className="inline-flex p-3 rounded-lg bg-accent bg-opacity-20 mb-3">
            <Icon name={badge?.icon} size={24} color="var(--color-accent)" />
          </div>
          <h4 className="text-sm font-semibold text-foreground mb-1">{badge?.label}</h4>
          <p className="text-xs text-muted-foreground">{badge?.description}</p>
        </div>
      ))}
    </div>
  );
};

export default SecurityBadges;