import React from 'react';
import Icon from '../../../components/AppIcon';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      icon: 'Plus',
      title: 'Create or Import Wallet',
      description: 'Generate a new wallet with secure seed phrase or import your existing wallet using private keys or recovery phrase.',
      color: '#26A17B'
    },
    {
      id: 2,
      icon: 'Network',
      title: 'Select Your Network',
      description: 'Choose from Ethereum, TRON, Bitcoin, or Solana networks. Switch between chains seamlessly anytime.',
      color: '#48D6B0'
    },
    {
      id: 3,
      icon: 'Wallet',
      title: 'Manage Your Assets',
      description: 'View balances, send and receive tokens, swap assets, and track your portfolio across all supported networks.',
      color: '#5EDFC4'
    },
    {
      id: 4,
      icon: 'TrendingUp',
      title: 'Track & Optimize',
      description: 'Monitor real-time gas fees, transaction history, and portfolio performance with intelligent analytics.',
      color: '#66F0D0'
    }
  ];

  return (
    <section className="relative py-24 px-4 bg-[#0F1115]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C1E22] border border-[#48D6B0] border-opacity-30 mb-6">
            <Icon name="Lightbulb" size={16} color="#48D6B0" />
            <span className="text-sm text-[#B5B9C3]">Simple Process</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-[#B5B9C3] max-w-3xl mx-auto">
            Get started with your multi-chain wallet in four simple steps. No technical expertise required.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#26A17B] via-[#48D6B0] to-[#66F0D0] transform -translate-y-1/2 opacity-30"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps?.map((step, index) => (
              <div
                key={step?.id}
                className="relative"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`
                }}
              >
                <div className="bg-[#1C1E22] rounded-2xl p-8 border border-[#2A2D32] hover:border-[#48D6B0] transition-all duration-300 hover:shadow-xl hover:shadow-[#48D6B0]/20 h-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 rounded-full flex items-center justify-center"
                           style={{ 
                             background: `linear-gradient(135deg, ${step?.color}20, ${step?.color}40)`,
                             boxShadow: `0 0 30px ${step?.color}30`
                           }}>
                        <Icon name={step?.icon} size={32} color={step?.color} />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                           style={{ 
                             background: `linear-gradient(135deg, ${step?.color}, ${step?.color}dd)`,
                             color: '#000000'
                           }}>
                        {step?.id}
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-3">
                      {step?.title}
                    </h3>

                    <p className="text-[#B5B9C3] leading-relaxed">
                      {step?.description}
                    </p>
                  </div>
                </div>

                {index < steps?.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-4 z-20">
                    <Icon name="ArrowRight" size={24} color="#48D6B0" className="opacity-50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-[#1C1E22] border border-[#48D6B0] border-opacity-30 rounded-2xl px-8 py-4">
            <Icon name="Info" size={20} color="#48D6B0" />
            <p className="text-[#B5B9C3]">
              <span className="text-[#48D6B0] font-semibold">Pro Tip:</span> Always backup your seed phrase in a secure location. Never share it with anyone.
            </p>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;