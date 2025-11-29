import React from 'react';
import Icon from '../../../components/AppIcon';

const FeatureCards = () => {
  const features = [
    {
      id: 1,
      icon: 'Network',
      title: 'Multi-Chain Support',
      description: 'Seamlessly manage assets across Ethereum, TRON, Bitcoin, and Solana networks from a single interface.',
      gradient: 'from-[#26A17B] to-[#48D6B0]',
      stats: '4 Networks'
    },
    {
      id: 2,
      icon: 'Shield',
      title: 'Bank-Grade Security',
      description: 'Your private keys never leave your device. Military-grade encryption protects your assets at all times.',
      gradient: 'from-[#48D6B0] to-[#66F0D0]',
      stats: '256-bit AES'
    },
    {
      id: 3,
      icon: 'Code2',
      title: 'Developer-Grade Architecture',
      description: 'Built with clean APIs, comprehensive documentation, and extensible architecture.',
      gradient: 'from-[#5EDFC4] to-[#48D6B0]',
      stats: 'Open Source'
    },
    {
      id: 4,
      icon: 'Zap',
      title: 'Lightning Fast Transactions',
      description: 'Optimized gas fee estimation and real-time network monitoring ensure quick, cost-effective transfers.',
      gradient: 'from-[#26A17B] to-[#5EDFC4]',
      stats: '< 2s Response'
    },
    {
      id: 5,
      icon: 'Wallet',
      title: 'Unified Asset Management',
      description: 'View all your tokens, NFTs, and balances across multiple chains in one beautiful dashboard.',
      gradient: 'from-[#48D6B0] to-[#26A17B]',
      stats: 'All Assets'
    },
    {
      id: 6,
      icon: 'TrendingUp',
      title: 'Real-Time Analytics',
      description: 'Track portfolio performance, transaction history, and network fees with live data updates.',
      gradient: 'from-[#66F0D0] to-[#26A17B]',
      stats: 'Live Updates'
    }
  ];

  return (
    <section className="relative py-24 px-4 bg-gradient-to-b from-black to-[#0F1115]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C1E22] border border-[#48D6B0] border-opacity-30 mb-6">
            <Icon name="Sparkles" size={16} color="#48D6B0" />
            <span className="text-sm text-[#B5B9C3]">Powerful Features</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Everything You Need in One Wallet
          </h2>
          <p className="text-xl text-[#B5B9C3] max-w-3xl mx-auto">
            Experience the future of cryptocurrency management with cutting-edge features designed for security, speed, and simplicity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features?.map((feature, index) => (
            <div
              key={feature?.id}
              className="group relative bg-[#1C1E22] rounded-2xl p-8 border border-[#2A2D32] hover:border-[#48D6B0] transition-all duration-300 hover:shadow-xl hover:shadow-[#48D6B0]/20"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              <div 
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 rounded-bl-full blur-2xl group-hover:opacity-20 transition-opacity duration-300 ${feature?.gradient}`}
              >
              </div>

              <div className="relative z-10">
                <div 
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${feature?.gradient}`}
                >
                  <Icon name={feature?.icon} size={28} color="#000000" />
                </div>

                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-white group-hover:text-[#48D6B0] transition-colors duration-300">
                    {feature?.title}
                  </h3>
                  <span className="text-xs font-mono text-[#48D6B0] bg-[#48D6B0] bg-opacity-10 px-2 py-1 rounded">
                    {feature?.stats}
                  </span>
                </div>

                <p className="text-[#B5B9C3] leading-relaxed">
                  {feature?.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-[#48D6B0] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium">Learn more</span>
                  <Icon name="ArrowRight" size={16} />
                </div>
              </div>
            </div>
          ))}
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

export default FeatureCards;