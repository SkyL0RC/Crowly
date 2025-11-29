import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Security', href: '#security' },
      { label: 'Networks', href: '#networks' },
      { label: 'Pricing', href: '#pricing' }
    ],
    resources: [
      { label: 'Documentation', href: '#docs' },
      { label: 'API Reference', href: '#api' },
      { label: 'Tutorials', href: '#tutorials' },
      { label: 'Community', href: '#community' }
    ],
    company: [
      { label: 'About Us', href: '#about' },
      { label: 'Blog', href: '#blog' },
      { label: 'Careers', href: '#careers' },
      { label: 'Contact', href: '#contact' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' },
      { label: 'Cookie Policy', href: '#cookies' },
      { label: 'Disclaimer', href: '#disclaimer' }
    ]
  };

  const socialLinks = [
    { icon: 'Twitter', href: '#twitter', label: 'Twitter' },
    { icon: 'Github', href: '#github', label: 'GitHub' },
    { icon: 'MessageCircle', href: '#discord', label: 'Discord' },
    { icon: 'Send', href: '#telegram', label: 'Telegram' }
  ];

  return (
    <footer className="relative bg-black border-t border-[#2A2D32]">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          <div className="lg:col-span-2">
            <Link to="/landing-page" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#26A17B] to-[#48D6B0] flex items-center justify-center">
                <Icon name="Wallet" size={24} color="#000000" />
              </div>
              <span className="text-xl font-bold text-white">Tether WDK Wallet</span>
            </Link>
            <p className="text-[#B5B9C3] leading-relaxed mb-6">
              Your secure gateway to multi-chain cryptocurrency management. Built with Tether WDK for the future of decentralized finance.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks?.map((social) => (
                <a
                  key={social?.label}
                  href={social?.href}
                  className="w-10 h-10 rounded-lg bg-[#1C1E22] border border-[#2A2D32] hover:border-[#48D6B0] flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-[#48D6B0]/20"
                  aria-label={social?.label}
                >
                  <Icon name={social?.icon} size={18} color="#B5B9C3" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks?.product?.map((link) => (
                <li key={link?.label}>
                  <a
                    href={link?.href}
                    className="text-[#B5B9C3] hover:text-[#48D6B0] transition-colors duration-200"
                  >
                    {link?.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks?.resources?.map((link) => (
                <li key={link?.label}>
                  <a
                    href={link?.href}
                    className="text-[#B5B9C3] hover:text-[#48D6B0] transition-colors duration-200"
                  >
                    {link?.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks?.company?.map((link) => (
                <li key={link?.label}>
                  <a
                    href={link?.href}
                    className="text-[#B5B9C3] hover:text-[#48D6B0] transition-colors duration-200"
                  >
                    {link?.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks?.legal?.map((link) => (
                <li key={link?.label}>
                  <a
                    href={link?.href}
                    className="text-[#B5B9C3] hover:text-[#48D6B0] transition-colors duration-200"
                  >
                    {link?.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#2A2D32]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#B5B9C3]">
              &copy; {currentYear} Tether WDK Wallet. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#48D6B0] animate-pulse"></div>
                <span className="text-sm text-[#B5B9C3]">All Systems Operational</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Shield" size={16} color="#48D6B0" />
                <span className="text-sm text-[#B5B9C3]">Secured by Tether</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3 bg-[#1C1E22] border border-[#48D6B0] border-opacity-30 rounded-2xl px-6 py-4">
          <Icon name="Info" size={20} color="#48D6B0" />
          <p className="text-sm text-[#B5B9C3]">
            <span className="text-[#48D6B0] font-semibold">Disclaimer:</span> Cryptocurrency investments carry risk. Always do your own research and never invest more than you can afford to lose.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;