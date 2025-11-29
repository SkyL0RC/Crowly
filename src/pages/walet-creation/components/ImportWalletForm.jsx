import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ImportWalletForm = ({ onImport, loading }) => {
  const [importMethod, setImportMethod] = useState('seed');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [errors, setErrors] = useState({});

  const importMethods = [
    { value: 'seed', label: 'Seed Phrase (12/24 words)' },
    { value: 'private', label: 'Private Key' },
    { value: 'hardware', label: 'Hardware Wallet' }
  ];

  const validateSeedPhrase = (phrase) => {
    const words = phrase?.trim()?.split(/\s+/);
    return words?.length === 12 || words?.length === 24;
  };

  const validatePrivateKey = (key) => {
    return /^(0x)?[0-9a-fA-F]{64}$/?.test(key?.trim());
  };

  const handleImport = () => {
    const newErrors = {};

    if (importMethod === 'seed') {
      if (!seedPhrase?.trim()) {
        newErrors.seedPhrase = 'Seed phrase is required';
      } else if (!validateSeedPhrase(seedPhrase)) {
        newErrors.seedPhrase = 'Invalid seed phrase. Must be 12 or 24 words';
      }
    } else if (importMethod === 'private') {
      if (!privateKey?.trim()) {
        newErrors.privateKey = 'Private key is required';
      } else if (!validatePrivateKey(privateKey)) {
        newErrors.privateKey = 'Invalid private key format';
      }
    }

    if (Object.keys(newErrors)?.length > 0) {
      setErrors(newErrors);
      return;
    }

    // Seed phrase'i temizle ve formatla
    const cleanedData = importMethod === 'seed' 
      ? seedPhrase.trim().toLowerCase().replace(/\s+/g, ' ')
      : privateKey.trim();

    onImport({ 
      method: importMethod, 
      data: cleanedData
    });
  };

  return (
    <div className="space-y-6">
      <div className="glass-card">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-lg bg-primary bg-opacity-20">
            <Icon name="Download" size={24} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Import Your Wallet</h3>
            <p className="text-sm text-muted-foreground">
              Choose your import method and enter your credentials securely.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Select
            label="Import Method"
            options={importMethods}
            value={importMethod}
            onChange={setImportMethod}
          />

          {importMethod === 'seed' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Seed Phrase
                </label>
                <textarea
                  value={seedPhrase}
                  onChange={(e) => {
                    setSeedPhrase(e?.target?.value);
                    setErrors(prev => ({ ...prev, seedPhrase: '' }));
                  }}
                  placeholder="Enter your 12 or 24 word seed phrase separated by spaces"
                  rows={4}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                />
                {errors?.seedPhrase && (
                  <p className="text-sm text-error mt-2">{errors?.seedPhrase}</p>
                )}
              </div>

              <div className="flex items-start gap-3 p-4 bg-warning bg-opacity-10 border border-warning border-opacity-30 rounded-lg">
                <Icon name="AlertTriangle" size={16} color="var(--color-warning)" />
                <p className="text-xs text-muted-foreground">
                  Make sure you're entering your seed phrase in a secure environment. Never share it with anyone.
                </p>
              </div>
            </div>
          )}

          {importMethod === 'private' && (
            <div className="space-y-4">
              <Input
                label="Private Key"
                type="password"
                value={privateKey}
                onChange={(e) => {
                  setPrivateKey(e?.target?.value);
                  setErrors(prev => ({ ...prev, privateKey: '' }));
                }}
                placeholder="0x..."
                error={errors?.privateKey}
                description="Enter your private key with or without 0x prefix"
              />

              <div className="flex items-start gap-3 p-4 bg-error bg-opacity-10 border border-error border-opacity-30 rounded-lg">
                <Icon name="ShieldAlert" size={16} color="var(--color-error)" />
                <p className="text-xs text-muted-foreground">
                  Private keys provide full access to your wallet. Ensure you're on the correct website and in a secure environment.
                </p>
              </div>
            </div>
          )}

          {importMethod === 'hardware' && (
            <div className="space-y-4">
              <div className="p-8 bg-background border-2 border-dashed border-border rounded-lg text-center">
                <Icon name="Usb" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-foreground mb-2">Connect Hardware Wallet</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect your Ledger or Trezor device to continue
                </p>
                <Button variant="outline" iconName="Plug" iconPosition="left">
                  Connect Device
                </Button>
              </div>

              <div className="flex items-start gap-3 p-4 bg-accent bg-opacity-10 border border-accent border-opacity-30 rounded-lg">
                <Icon name="Info" size={16} color="var(--color-accent)" />
                <p className="text-xs text-muted-foreground">
                  Hardware wallets provide the highest level of security by keeping your private keys offline.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {importMethod !== 'hardware' && (
        <Button
          variant="default"
          fullWidth
          iconName="Check"
          iconPosition="right"
          onClick={handleImport}
          disabled={loading}
        >
          {loading ? 'Importing...' : 'Import Wallet'}
        </Button>
      )}
    </div>
  );
};

export default ImportWalletForm;