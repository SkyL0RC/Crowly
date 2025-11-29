import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, transactionData }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!password) {
      setError('Password is required to confirm transaction');
      return;
    }

    if (password !== 'SecurePass123!') {
      setError('Incorrect password. Please try again.');
      return;
    }

    setIsProcessing(true);
    setError('');

    setTimeout(() => {
      onConfirm();
      setIsProcessing(false);
      setPassword('');
    }, 2000);
  };

  const handleClose = () => {
    if (!isProcessing) {
      setPassword('');
      setError('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-md bg-surface border border-border rounded-2xl shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-background">
                <Icon name="ShieldCheck" size={24} color="var(--color-accent)" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Confirm Transaction</h2>
            </div>
            <button
              onClick={handleClose}
              disabled={isProcessing}
              className="p-2 rounded-lg hover:bg-background transition-colors disabled:opacity-50"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="p-4 bg-background rounded-xl border border-border">
              <div className="text-sm text-muted-foreground mb-1">You are sending</div>
              <div className="text-2xl font-bold text-foreground">
                {transactionData?.amount} {transactionData?.token}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                ≈ ${transactionData?.usdValue}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Network Fee</span>
                <span className="text-foreground font-medium">{transactionData?.fee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="text-foreground font-semibold">{transactionData?.total}</span>
              </div>
            </div>

            <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg">
              <div className="flex items-start gap-2">
                <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
                <p className="text-xs text-warning">
                  This transaction cannot be reversed. Please verify all details before confirming.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <Input
              type="password"
              label="Enter Password"
              placeholder="Enter your wallet password"
              value={password}
              onChange={(e) => {
                setPassword(e?.target?.value);
                setError('');
              }}
              error={error}
              required
              disabled={isProcessing}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Mock Password: <span className="font-mono text-accent">SecurePass123!</span>
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isProcessing}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleConfirm}
              loading={isProcessing}
              disabled={!password}
              fullWidth
            >
              {isProcessing ? 'Processing...' : 'Confirm & Send'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;