import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const RecipientInput = ({ value, onChange, error, onScan, recentRecipients, onSelectRecent }) => {
  const [showRecents, setShowRecents] = useState(false);

  const handleSelectRecent = (address) => {
    onSelectRecent(address);
    setShowRecents(false);
  };

  return (
    <div className="relative">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Input
            label="Recipient Address"
            type="text"
            placeholder="Enter wallet address or ENS name"
            value={value}
            onChange={(e) => onChange(e?.target?.value)}
            error={error}
            required
          />
        </div>
        <button
          type="button"
          onClick={onScan}
          className="p-3 mb-1 rounded-lg bg-surface border border-border hover:border-accent transition-all duration-150"
          title="Scan QR Code"
        >
          <Icon name="QrCode" size={20} />
        </button>
      </div>
      {recentRecipients?.length > 0 && (
        <button
          type="button"
          onClick={() => setShowRecents(!showRecents)}
          className="mt-2 text-xs text-accent hover:text-accent/80 transition-colors flex items-center gap-1"
        >
          <Icon name="History" size={14} />
          Recent Recipients
        </button>
      )}
      {showRecents && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowRecents(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
            {recentRecipients?.map((recipient) => (
              <button
                key={recipient?.id}
                type="button"
                onClick={() => handleSelectRecent(recipient?.address)}
                className="w-full flex items-center justify-between p-4 hover:bg-background transition-all duration-150 border-b border-border last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-background">
                    <Icon name="User" size={16} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-foreground">{recipient?.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {recipient?.address?.slice(0, 10)}...{recipient?.address?.slice(-8)}
                    </div>
                  </div>
                </div>
                <Icon name="ChevronRight" size={16} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RecipientInput;