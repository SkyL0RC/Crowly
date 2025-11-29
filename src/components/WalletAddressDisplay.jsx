import React, { useState } from 'react';
import Icon from './AppIcon';

const WalletAddressDisplay = ({ 
  address = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  network = 'ethereum',
  showQR = false,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const truncateAddress = (addr) => {
    if (!addr) return '';
    return `${addr?.slice(0, 6)}...${addr?.slice(-4)}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const getNetworkIcon = () => {
    const icons = {
      ethereum: 'Hexagon',
      tron: 'Triangle',
      bitcoin: 'Circle',
      solana: 'Zap'
    };
    return icons?.[network] || 'Wallet';
  };

  return (
    <div className={`wallet-address-container ${className}`}>
      <div className="flex items-center gap-3 flex-1">
        <div className="p-2 rounded-lg bg-background">
          <Icon name={getNetworkIcon()} size={20} color="var(--color-accent)" />
        </div>
        <div className="flex-1">
          <div className="text-xs text-muted-foreground mb-1">Wallet Address</div>
          <div className="wallet-address">{truncateAddress(address)}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="copy-button"
          onClick={handleCopy}
          title={copied ? 'Copied!' : 'Copy address'}
        >
          <Icon 
            name={copied ? 'Check' : 'Copy'} 
            size={18} 
            color={copied ? 'var(--color-success)' : 'currentColor'}
          />
        </button>

        {showQR && (
          <button
            className="copy-button"
            title="Show QR code"
          >
            <Icon name="QrCode" size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default WalletAddressDisplay;