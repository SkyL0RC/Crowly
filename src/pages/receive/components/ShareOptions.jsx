import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const ShareOptions = ({ address, network }) => {
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [shareLink, setShareLink] = useState('');

  const generateShareLink = () => {
    const baseUrl = window.location?.origin;
    const params = new URLSearchParams({
      address,
      network,
      ...(amount && { amount }),
      ...(memo && { memo })
    });
    const link = `${baseUrl}/send-transfer?${params?.toString()}`;
    console.log('Generated link:', link);
    console.log('Params:', { address, network, amount, memo });
    setShareLink(link);
    return link;
  };

  const handleCopyLink = async () => {
    const link = generateShareLink();
    try {
      await navigator.clipboard?.writeText(link);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleEmailShare = () => {
    const link = generateShareLink();
    const subject = `Request for ${network} Payment`;
    const body = `Please send ${amount || 'payment'} to my ${network} address:\n\n${address}\n\n${memo ? `Note: ${memo}\n\n` : ''}Payment Link: ${link}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSocialShare = async () => {
    const link = generateShareLink();
    const text = `Send ${amount || 'payment'} to my ${network} wallet`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Cryptocurrency Payment Request',
          text,
          url: link
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    }
  };

  return (
    <div className="glass-card">
      <div className="flex items-center gap-2 mb-6">
        <Icon name="Share2" size={20} color="var(--color-accent)" />
        <h3 className="text-lg font-semibold text-foreground">Share Address</h3>
      </div>
      <div className="space-y-4 mb-6">
        <Input
          label="Request Amount (Optional)"
          type="text"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e?.target?.value)}
          description="Specify an amount to request"
        />

        <Input
          label="Memo (Optional)"
          type="text"
          placeholder="Add a note or reference"
          value={memo}
          onChange={(e) => setMemo(e?.target?.value)}
          description="Add context for the payment"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={handleCopyLink}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-surface border border-border hover:border-accent transition-all duration-150"
        >
          <Icon name="Link" size={18} />
          <span className="text-sm font-medium">Copy Link</span>
        </button>

        <button
          onClick={handleEmailShare}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-surface border border-border hover:border-accent transition-all duration-150"
        >
          <Icon name="Mail" size={18} />
          <span className="text-sm font-medium">Email</span>
        </button>

        <button
          onClick={handleSocialShare}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-surface border border-border hover:border-accent transition-all duration-150"
        >
          <Icon name="Share2" size={18} />
          <span className="text-sm font-medium">Share</span>
        </button>
      </div>
      {shareLink && (
        <div className="mt-4 p-4 bg-background rounded-lg border border-border">
          <div className="text-xs text-muted-foreground mb-2">Generated Link</div>
          <div className="font-mono text-xs text-foreground break-all">{shareLink}</div>
        </div>
      )}
    </div>
  );
};

export default ShareOptions;