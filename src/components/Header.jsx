import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from './AppIcon';
import { clearStoredWallet } from '../utils/secureStorage';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');
  const location = useLocation();
  const navigate = useNavigate();
  const networkDropdownRef = useRef(null);

  const navItems = [
    { label: 'Dashboard', path: '/user-dashboard', icon: 'LayoutDashboard' },
    { label: 'Send', path: '/send-transfer', icon: 'Send' },
    { label: 'Receive', path: '/receive', icon: 'Download' },
    { label: 'Settings', path: '/settings', icon: 'Settings' }
  ];

  const networks = [
    { id: 'ethereum', name: 'Ethereum', icon: 'Hexagon', gasPrice: '25 Gwei' },
    { id: 'tron', name: 'TRON', icon: 'Triangle', gasPrice: '420 TRX' },
    { id: 'bitcoin', name: 'Bitcoin', icon: 'Circle', gasPrice: '15 sat/vB' },
    { id: 'solana', name: 'Solana', icon: 'Zap', gasPrice: '0.00025 SOL' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (networkDropdownRef?.current && !networkDropdownRef?.current?.contains(event?.target)) {
        setNetworkDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleNetworkChange = (networkId) => {
    setSelectedNetwork(networkId);
    setNetworkDropdownOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm('🔐 Wallet\'tan çıkış yapmak istediğinizden emin misiniz?\n\nÖnemli: Seed phrase\'inizi yedeklemediyseniz, wallet\'ınıza tekrar erişemezsiniz!')) {
      // Tüm wallet verilerini temizle
      clearStoredWallet();
      localStorage.removeItem('walletAddress');
      localStorage.removeItem('walletNetwork');
      
      // Login sayfasına yönlendir
      navigate('/walet-creation');
    }
  };

  const isActive = (path) => location?.pathname === path;

  const currentNetwork = networks?.find(n => n?.id === selectedNetwork);

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
            <span className="logo-text">Tether WDK</span>
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
            <span className="logo-text">Tether WDK Wallet</span>
          </Link>

          <nav className="nav-menu hidden lg:flex">
            {navItems?.slice(0, 3)?.map((item) => (
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
            <div className="network-selector" ref={networkDropdownRef}>
              <button
                className="network-button"
                onClick={() => setNetworkDropdownOpen(!networkDropdownOpen)}
                aria-expanded={networkDropdownOpen}
                aria-haspopup="true"
              >
                <Icon name={currentNetwork?.icon} size={16} />
                <span>{currentNetwork?.name}</span>
                <Icon name="ChevronDown" size={16} />
              </button>

              {networkDropdownOpen && (
                <div className="network-dropdown">
                  {networks?.map((network) => (
                    <button
                      key={network?.id}
                      className={`network-option ${selectedNetwork === network?.id ? 'active' : ''}`}
                      onClick={() => handleNetworkChange(network?.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon name={network?.icon} size={20} />
                        <div className="text-left">
                          <div className="font-medium">{network?.name}</div>
                          <div className="text-xs text-muted-foreground">{network?.gasPrice}</div>
                        </div>
                      </div>
                      {selectedNetwork === network?.id && (
                        <Icon name="Check" size={16} color="var(--color-accent)" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link to="/settings">
              <button className="p-2 rounded-lg bg-surface border border-border hover:border-accent transition-all duration-150">
                <Icon name="Settings" size={20} />
              </button>
            </Link>

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