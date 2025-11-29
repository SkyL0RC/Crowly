import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SeedPhraseDisplay = ({ seedPhrase, onContinue }) => {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(seedPhrase?.join(' '));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy seed phrase:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-lg bg-warning bg-opacity-20">
            <Icon name="ShieldAlert" size={24} color="var(--color-warning)" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Security Warning</h3>
            <p className="text-sm text-muted-foreground">
              Never share your seed phrase with anyone. Anyone with access to your seed phrase can access your funds. Store it securely offline.
            </p>
          </div>
        </div>

        <div className="relative">
          {!revealed && (
            <div className="absolute inset-0 backdrop-blur-md bg-surface bg-opacity-80 rounded-lg flex items-center justify-center z-10">
              <Button
                variant="default"
                iconName="Eye"
                iconPosition="left"
                onClick={() => setRevealed(true)}
              >
                Reveal Seed Phrase
              </Button>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-6 bg-background rounded-lg border border-border">
            {seedPhrase?.map((word, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border"
              >
                <span className="text-xs font-mono text-muted-foreground w-6">{index + 1}.</span>
                <span className="font-mono text-sm text-foreground">{word}</span>
              </div>
            ))}
          </div>
        </div>

        {revealed && (
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              fullWidth
              iconName={copied ? 'Check' : 'Copy'}
              iconPosition="left"
              onClick={handleCopy}
            >
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </Button>
            <Button
              variant="outline"
              fullWidth
              iconName="Download"
              iconPosition="left"
            >
              Download Backup
            </Button>
          </div>
        )}
      </div>
      <div className="glass-card bg-error bg-opacity-10 border-error border-opacity-30">
        <div className="flex items-start gap-3">
          <Icon name="AlertTriangle" size={20} color="var(--color-error)" />
          <div className="space-y-2">
            <p className="text-sm font-medium text-error">Critical Security Reminders:</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Write down your seed phrase on paper and store it securely</li>
              <li>Never store your seed phrase digitally or take screenshots</li>
              <li>Tether will never ask for your seed phrase</li>
              <li>You are solely responsible for keeping your seed phrase safe</li>
            </ul>
          </div>
        </div>
      </div>
      <Button
        variant="default"
        fullWidth
        iconName="ArrowRight"
        iconPosition="right"
        onClick={onContinue}
        disabled={!revealed}
      >
        I Have Saved My Seed Phrase
      </Button>
    </div>
  );
};

export default SeedPhraseDisplay;