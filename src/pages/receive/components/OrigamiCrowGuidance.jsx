import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const OrigimiCrowGuidance = () => {
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    {
      id: 1,
      title: 'Address Reuse Best Practices',
      content: 'For enhanced privacy, consider generating a new address for each transaction. While reusing addresses is safe, fresh addresses provide better transaction privacy and security.',
      icon: 'Shield'
    },
    {
      id: 2,
      title: 'Network Selection Guide',
      content: 'Always verify the network matches your sender\'s network. Ethereum addresses work for ETH and ERC-20 tokens, TRON for TRC-20, Bitcoin for BTC, and Solana for SOL and SPL tokens.',
      icon: 'Network'
    },
    {
      id: 3,
      title: 'Security Considerations',
      content: 'Never share your private keys or seed phrase. Only share your public receiving address. Verify addresses character-by-character when sharing through messaging apps to prevent clipboard attacks.',
      icon: 'Lock'
    },
    {
      id: 4,
      title: 'QR Code Scanning Tips',
      content: 'Ensure good lighting when displaying QR codes for scanning. The QR code contains your full address and is safe to share. Always verify the scanned address matches your displayed address.',
      icon: 'QrCode'
    }
  ];

  const handleNextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips?.length);
  };

  const handlePrevTip = () => {
    setCurrentTip((prev) => (prev - 1 + tips?.length) % tips?.length);
  };

  const tip = tips?.[currentTip];

  return (
    <div className="glass-card relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-5 rounded-full blur-3xl"></div>
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-accent to-primary opacity-20">
          <Icon name="Bird" size={32} color="var(--color-accent)" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-foreground">Origami Crow Tips</h3>
            <div className="px-2 py-0.5 rounded-full bg-accent bg-opacity-20 border border-accent border-opacity-30">
              <span className="text-xs font-medium text-accent-foreground">
                {currentTip + 1}/{tips?.length}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Smart guidance for secure receiving</p>
        </div>
      </div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Icon name={tip?.icon} size={18} color="var(--color-accent)" />
          <h4 className="font-medium text-foreground">{tip?.title}</h4>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{tip?.content}</p>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button
          onClick={handlePrevTip}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border hover:border-accent transition-all duration-150"
          disabled={currentTip === 0}
        >
          <Icon name="ChevronLeft" size={16} />
          <span className="text-sm">Previous</span>
        </button>

        <div className="flex gap-1.5">
          {tips?.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTip(index)}
              className={`w-2 h-2 rounded-full transition-all duration-150 ${
                index === currentTip
                  ? 'bg-accent w-6' :'bg-border hover:bg-accent hover:bg-opacity-50'
              }`}
              aria-label={`Go to tip ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNextTip}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border hover:border-accent transition-all duration-150"
          disabled={currentTip === tips?.length - 1}
        >
          <span className="text-sm">Next</span>
          <Icon name="ChevronRight" size={16} />
        </button>
      </div>
    </div>
  );
};

export default OrigimiCrowGuidance;