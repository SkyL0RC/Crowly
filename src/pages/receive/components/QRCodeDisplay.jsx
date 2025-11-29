import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const QRCodeDisplay = ({ address, network }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(address)}&bgcolor=000000&color=48D6B0&margin=20`;

  return (
    <div className="glass-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Icon name="QrCode" size={20} color="var(--color-accent)" />
          <h3 className="text-lg font-semibold text-foreground">QR Code</h3>
        </div>
        <div className="px-3 py-1 rounded-full bg-accent bg-opacity-20 border border-accent border-opacity-30">
          <span className="text-xs font-medium text-accent-foreground uppercase">{network}</span>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="p-6 bg-white rounded-2xl mb-6 shadow-[0_0_30px_rgba(72,214,176,0.2)]">
          <img
            src={qrCodeUrl}
            alt={`QR code for ${network} wallet address ${address}`}
            className="w-64 h-64 lg:w-80 lg:h-80"
            loading="lazy"
          />
        </div>

        <div className="w-full p-4 bg-background rounded-xl border border-border">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 overflow-hidden">
              <div className="text-xs text-muted-foreground mb-1">Wallet Address</div>
              <div className="font-mono text-sm text-foreground break-all">{address}</div>
            </div>
            <button
              onClick={handleCopy}
              className="p-3 rounded-lg bg-surface border border-border hover:border-accent transition-all duration-150 flex-shrink-0"
              title={copied ? 'Copied!' : 'Copy address'}
            >
              <Icon 
                name={copied ? 'Check' : 'Copy'} 
                size={20} 
                color={copied ? 'var(--color-success)' : 'currentColor'}
              />
            </button>
          </div>
        </div>

        <div className="mt-4 p-4 bg-accent bg-opacity-10 rounded-lg border border-accent border-opacity-30 w-full">
          <div className="flex items-start gap-3">
            <Icon name="AlertCircle" size={18} color="var(--color-accent)" className="flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-accent">Security Notice:</span> Only send {network} assets to this address. Sending assets from other networks may result in permanent loss.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeDisplay;