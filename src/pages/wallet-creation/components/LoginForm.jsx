import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const LoginForm = ({ onLogin, loading, error }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="glass-card max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex p-4 rounded-full bg-accent bg-opacity-20 mb-4">
          <Icon name="Lock" size={32} color="var(--color-accent)" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Welcome Back!</h2>
        <p className="text-muted-foreground">
          Enter your password to unlock your wallet
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
            required
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-error bg-opacity-10 border border-error rounded-lg">
            <div className="flex items-center gap-2">
              <Icon name="AlertCircle" size={16} color="var(--color-error)" />
              <p className="text-sm text-foreground">{error}</p>
            </div>
          </div>
        )}

        <Button
          type="submit"
          variant="default"
          fullWidth
          iconName="Unlock"
          iconPosition="right"
          disabled={!password || loading}
        >
          {loading ? 'Unlocking...' : 'Unlock Wallet'}
        </Button>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center mb-3">
            Don't have access to your wallet?
          </p>
          <Button
            type="button"
            variant="outline"
            fullWidth
            iconName="Key"
            onClick={() => window.location.reload()}
          >
            Import with Seed Phrase
          </Button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-accent bg-opacity-10 rounded-lg border border-accent border-opacity-30">
        <div className="flex items-start gap-3">
          <Icon name="ShieldCheck" size={18} color="var(--color-accent)" className="flex-shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <span className="font-medium text-accent">Security Notice:</span> Your password decrypts your wallet locally. We never send your password or seed phrase to any server.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
