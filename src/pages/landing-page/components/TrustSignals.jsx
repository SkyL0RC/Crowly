import React from 'react';
import Icon from '../../../components/AppIcon';


const TrustSignals = () => {
  const trustBadges = [
    {
      id: 1,
      icon: 'Shield',
      title: 'Tether Certified',
      description: 'Secure Multi-Chain Integration'
    },
    {
      id: 2,
      icon: 'Lock',
      title: 'End-to-End Encryption',
      description: '256-bit AES Encryption'
    },
    {
      id: 3,
      icon: 'Eye',
      title: 'Open Source',
      description: 'Audited & Transparent Code'
    },
    {
      id: 4,
      icon: 'Users',
      title: 'Community Driven',
      description: '50,000+ Active Users'
    }
  ];

  const securityFeatures = [
    'Private keys stored locally on your device',
    'No server-side storage of sensitive data',
    'Multi-signature transaction support',
    'Hardware wallet integration ready',
    'Biometric authentication support',
    'Regular security audits and updates'
  ];

  return (
    <section className="relative py-24 px-4 bg-gradient-to-b from-[#0F1115] to-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C1E22] border border-[#48D6B0] border-opacity-30 mb-6">
            <Icon name="ShieldCheck" size={16} color="#48D6B0" />
            <span className="text-sm text-[#B5B9C3]">Security First</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Built on Trust & Security
          </h2>
          <p className="text-xl text-[#B5B9C3] max-w-3xl mx-auto">
            Your assets deserve the highest level of protection. We implement industry-leading security standards.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {trustBadges?.map((badge, index) => (
            <div
              key={badge?.id}
              className="bg-[#1C1E22] rounded-xl p-6 border border-[#2A2D32] hover:border-[#48D6B0] transition-all duration-300 text-center"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#26A17B] to-[#48D6B0] flex items-center justify-center mx-auto mb-4">
                <Icon name={badge?.icon} size={28} color="#000000" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {badge?.title}
              </h3>
              <p className="text-sm text-[#B5B9C3]">
                {badge?.description}
              </p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="bg-[#1C1E22] rounded-2xl p-8 border border-[#2A2D32]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#26A17B] to-[#48D6B0] flex items-center justify-center">
                <Icon name="Lock" size={24} color="#000000" />
              </div>
              <h3 className="text-2xl font-bold text-white">Security Features</h3>
            </div>

            <div className="space-y-4">
              {securityFeatures?.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1">
                    <Icon name="CheckCircle2" size={20} color="#48D6B0" />
                  </div>
                  <p className="text-[#B5B9C3]">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#26A17B] to-[#48D6B0] rounded-2xl blur-3xl opacity-20"></div>
            <div className="relative bg-[#1C1E22] rounded-2xl p-8 border border-[#48D6B0] border-opacity-30">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#26A17B] to-[#48D6B0] flex items-center justify-center">
                  <Icon name="Award" size={32} color="#000000" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Tether Certified</h3>
                  <p className="text-[#B5B9C3]">Official WDK Partner</p>
                </div>
              </div>

              <p className="text-[#B5B9C3] leading-relaxed mb-6">
                Crowly is built with advanced security standards, ensuring compatibility, security, and reliability across all supported blockchain networks.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0F1115] rounded-lg p-4 border border-[#2A2D32]">
                  <div className="text-3xl font-bold text-[#48D6B0] mb-1">99.9%</div>
                  <div className="text-sm text-[#B5B9C3]">Uptime</div>
                </div>
                <div className="bg-[#0F1115] rounded-lg p-4 border border-[#2A2D32]">
                  <div className="text-3xl font-bold text-[#48D6B0] mb-1">50K+</div>
                  <div className="text-sm text-[#B5B9C3]">Users</div>
                </div>
                <div className="bg-[#0F1115] rounded-lg p-4 border border-[#2A2D32]">
                  <div className="text-3xl font-bold text-[#48D6B0] mb-1">4</div>
                  <div className="text-sm text-[#B5B9C3]">Networks</div>
                </div>
                <div className="bg-[#0F1115] rounded-lg p-4 border border-[#2A2D32]">
                  <div className="text-3xl font-bold text-[#48D6B0] mb-1">24/7</div>
                  <div className="text-sm text-[#B5B9C3]">Support</div>
                </div>
              </div>
            </div>
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

export default TrustSignals;