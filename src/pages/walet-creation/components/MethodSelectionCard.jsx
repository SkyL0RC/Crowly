import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MethodSelectionCard = ({ method, onSelect, isSelected }) => {
  const methodConfig = {
    generate: {
      icon: 'Sparkles',
      title: 'Generate New Wallet',
      description: 'Create a new wallet with a secure 12-word seed phrase. Your keys are generated locally and never leave your device.',
      features: ['Secure on-device generation', 'BIP39 compliant seed phrase', 'Multi-chain support'],
      badge: 'Recommended',
      badgeColor: 'bg-accent bg-opacity-20 text-accent-foreground border border-accent border-opacity-30'
    },
    import: {
      icon: 'Download',
      title: 'Import Existing Wallet',
      description: 'Restore your wallet using a seed phrase or private key. Supports multiple import formats for maximum compatibility.',
      features: ['Seed phrase import', 'Private key support', 'Hardware wallet connection'],
      badge: 'Advanced',
      badgeColor: 'bg-primary bg-opacity-20 text-primary-foreground border border-primary border-opacity-30'
    }
  };

  const config = methodConfig?.[method];

  return (
    <div
      className={`glass-card cursor-pointer transition-all duration-300 ${
        isSelected ? 'border-accent shadow-lg' : 'hover:border-accent hover:border-opacity-50'
      }`}
      onClick={() => onSelect(method)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-background">
          <Icon name={config?.icon} size={32} color="var(--color-accent)" />
        </div>
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${config?.badgeColor}`}>
          {config?.badge}
        </span>
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{config?.title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{config?.description}</p>
      <div className="space-y-2 mb-6">
        {config?.features?.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <Icon name="Check" size={16} color="var(--color-accent)" />
            <span className="text-sm text-foreground">{feature}</span>
          </div>
        ))}
      </div>
      <Button
        variant={isSelected ? 'default' : 'outline'}
        fullWidth
        iconName={isSelected ? 'Check' : 'ArrowRight'}
        iconPosition="right"
      >
        {isSelected ? 'Selected' : 'Choose This Method'}
      </Button>
    </div>
  );
};

export default MethodSelectionCard;