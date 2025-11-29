import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from './AppIcon';
import { clearStoredWallet } from '../utils/secureStorage';
import { useNetwork } from '../contexts/NetworkContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { networkMode, toggleNetwork, isTestnet } = useNetwork();

  const navItems = [
    { label: 'Dashboard', path: '/user-dashboard', icon: 'LayoutDashboard' },
    { label: 'Send', path: '/send-transfer', icon: 'Send' },
    { label: 'Receive', path: '/receive', icon: 'Download' },
    { label: 'Swap', path: '/swap', icon: 'ArrowLeftRight' },
    { label: 'History', path: '/history', icon: 'History' }
  ];

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    if (window.confirm('🔐 Wallet\'tan çıkış yapmak istediğinizden emin misiniz?\n\nÖnemli: Seed phrase\'inizi yedeklemediyseniz, wallet\'ınıza tekrar erişemezsiniz!')) {
      // Tüm wallet verilerini temizle
      clearStoredWallet();
      localStorage.removeItem('walletAddress');
      localStorage.removeItem('walletNetwork');
      
      // Ana sayfaya yönlendir
      navigate('/');
    }
  };

  const isActive = (path) => location?.pathname === path;

  return (
    <>
      <button
        className="mobile-menu-button"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle mobile menu"
      >
        <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={24} />
      </button>
      {mobileMenuOpen && (
        <div 
          className="mobile-menu-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <div className="flex items-center gap-3">
            <div className="logo-icon">
              <Icon name="Wallet" size={24} color="var(--color-accent)" />
            </div>
            <span className="logo-text">Crowly</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-background transition-colors"
            aria-label="Close menu"
          >
            <Icon name="X" size={20} />
          </button>
        </div>
        <nav className="mobile-menu-items">
          {/* Network Toggle for Mobile */}
          <button
            onClick={toggleNetwork}
            className="mobile-nav-item hover:bg-background"
          >
            <div className={`w-2 h-2 rounded-full ${isTestnet ? 'bg-warning' : 'bg-success'}`} />
            <span>{isTestnet ? 'Testnet Mode' : 'Mainnet Mode'}</span>
            <Icon name="RefreshCw" size={16} className="ml-auto" />
          </button>

          {navItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`mobile-nav-item ${isActive(item?.path) ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Icon name={item?.icon} size={20} />
              <span>{item?.label}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="mobile-nav-item text-error hover:bg-error hover:bg-opacity-10"
          >
            <Icon name="LogOut" size={20} />
            <span>Çıkış Yap</span>
          </button>
        </nav>
      </div>
      <header className="header-nav">
        <div className="header-container">
          <Link to="/user-dashboard" className="header-logo">
            <div className="logo-icon">
              <Icon name="Wallet" size={24} color="var(--color-accent)" />
            </div>
            <span className="logo-text">Crowly</span>
          </Link>

          <nav className="nav-menu hidden lg:flex">
            {navItems?.slice(0, 5)?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`nav-item ${isActive(item?.path) ? 'active' : ''}`}
              >
                {item?.label}
              </Link>
            ))}
          </nav>

          <div className="nav-actions hidden lg:flex">
            {/* Network Toggle */}
            <button
              onClick={toggleNetwork}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-border hover:border-accent transition-all duration-150"
              title={`Switch to ${isTestnet ? 'Mainnet' : 'Testnet'}`}
            >
              <div className={`w-2 h-2 rounded-full ${isTestnet ? 'bg-warning' : 'bg-success'} animate-pulse`} />
              <span className="text-sm font-medium text-foreground">
                {isTestnet ? 'Testnet' : 'Mainnet'}
              </span>
            </button>

            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg bg-surface border border-border hover:border-error hover:bg-error hover:bg-opacity-10 transition-all duration-150"
              title="Çıkış Yap"
            >
              <Icon name="LogOut" size={20} color="var(--color-error)" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;