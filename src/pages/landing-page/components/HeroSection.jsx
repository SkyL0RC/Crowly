import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

import Button from '../../../components/ui/Button';

const HeroSection = () => {
  const navigate = useNavigate();
  const [crowAnimated, setCrowAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCrowAnimated(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateWallet = () => {
    navigate('/wallet-creation');
  };

  const handleImportWallet = () => {
    navigate('/wallet-creation');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0F1115] to-black"></div>
      
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#26A17B] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#48D6B0] rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left space-y-8">
            <div className={`transform transition-all duration-1000 ${crowAnimated ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#1C1E22] border border-[#48D6B0] border-opacity-30 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#48D6B0] animate-pulse"></div>
                <span className="text-sm text-[#B5B9C3]">Powered by Tether Wallet Development Kit</span>
              </div>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              <span className="text-white">Your Gateway to</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#26A17B] to-[#48D6B0]">
                Multi-Chain Freedom
              </span>
            </h1>

            <p className="text-xl text-[#B5B9C3] leading-relaxed max-w-2xl">
              Secure, intelligent wallet management across EVM, TRON, Bitcoin, and Solana networks. Built with developer-grade architecture and futuristic user experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                variant="default"
                size="lg"
                iconName="Plus"
                iconPosition="left"
                onClick={handleCreateWallet}
                className="bg-[#26A17B] hover:bg-[#1A7C5E] text-white border-0 shadow-lg shadow-[#26A17B]/30 hover:shadow-[#26A17B]/50 transition-all duration-300"
              >
                Create New Wallet
              </Button>
              <Button
                variant="outline"
                size="lg"
                iconName="Download"
                iconPosition="left"
                onClick={handleImportWallet}
                className="border-[#48D6B0] text-[#48D6B0] hover:bg-[#48D6B0] hover:text-black transition-all duration-300"
              >
                Import Existing Wallet
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-8">
              <div className="flex items-center gap-2">
                <Icon name="Shield" size={20} color="#48D6B0" />
                <span className="text-sm text-[#B5B9C3]">Bank-Grade Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Zap" size={20} color="#48D6B0" />
                <span className="text-sm text-[#B5B9C3]">Lightning Fast</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Lock" size={20} color="#48D6B0" />
                <span className="text-sm text-[#B5B9C3]">On-Device Keys</span>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className={`relative transform transition-all duration-1000 delay-300 ${crowAnimated ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
              <div className="absolute inset-0 bg-gradient-to-r from-[#26A17B] to-[#48D6B0] rounded-full blur-3xl opacity-30 animate-pulse"></div>
              
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                <svg viewBox="0 0 400 400" className="w-full h-full">
                  <defs>
                    <linearGradient id="crowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3A3A3E" />
                      <stop offset="100%" stopColor="#0F1115" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  <g transform="translate(200, 200)">
                    <path d="M 0,-80 L -60,-40 L -40,0 L -60,40 L 0,60 L 60,40 L 40,0 L 60,-40 Z" 
                          fill="url(#crowGradient)" 
                          stroke="#5EDFC4" 
                          strokeWidth="2" 
                          filter="url(#glow)"/>
                    
                    <path d="M -30,-50 L -50,-30 L -30,-20 Z" 
                          fill="url(#crowGradient)" 
                          stroke="#5EDFC4" 
                          strokeWidth="1.5"/>
                    <path d="M 30,-50 L 50,-30 L 30,-20 Z" 
                          fill="url(#crowGradient)" 
                          stroke="#5EDFC4" 
                          strokeWidth="1.5"/>
                    
                    <circle cx="-25" cy="-30" r="4" fill="#48D6B0" className="animate-pulse"/>
                    <circle cx="25" cy="-30" r="4" fill="#48D6B0" className="animate-pulse"/>
                    
                    <path d="M 0,-10 L -15,10 L 0,5 L 15,10 Z" 
                          fill="#5EDFC4" 
                          opacity="0.8"/>
                  </g>
                </svg>
              </div>

              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-[#1C1E22] border border-[#48D6B0] border-opacity-30 rounded-2xl px-6 py-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <Icon name="Sparkles" size={20} color="#48D6B0" />
                  <p className="text-sm text-[#B5B9C3]">
                    <span className="text-[#48D6B0] font-semibold">Smart Tip:</span> Your keys, your crypto. Always.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;