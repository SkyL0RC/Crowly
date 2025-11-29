import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CTASection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/wallet-creation');
  };

  return (
    <section className="relative py-24 px-4 bg-black overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#26A17B] to-[#48D6B0] rounded-full blur-[150px] opacity-20"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="bg-gradient-to-br from-[#1C1E22] to-[#0F1115] rounded-3xl p-12 lg:p-16 border border-[#48D6B0] border-opacity-30 shadow-2xl shadow-[#48D6B0]/20">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#26A17B] bg-opacity-20 border border-[#48D6B0] border-opacity-30 mb-4">
              <Icon name="Rocket" size={16} color="#48D6B0" />
              <span className="text-sm text-[#48D6B0] font-medium">Start Your Journey</span>
            </div>

            <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
              Ready to Take Control of
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#26A17B] to-[#48D6B0]">
                Your Crypto Assets?
              </span>
            </h2>

            <p className="text-xl text-[#B5B9C3] max-w-3xl mx-auto leading-relaxed">
              Join thousands of users who trust Tether WDK Wallet for secure, multi-chain cryptocurrency management. Get started in less than 2 minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                variant="default"
                size="lg"
                iconName="ArrowRight"
                iconPosition="right"
                onClick={handleGetStarted}
                className="bg-[#26A17B] hover:bg-[#1A7C5E] text-white border-0 shadow-lg shadow-[#26A17B]/30 hover:shadow-[#26A17B]/50 transition-all duration-300"
              >
                Create Wallet Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                iconName="BookOpen"
                iconPosition="left"
                className="border-[#48D6B0] text-[#48D6B0] hover:bg-[#48D6B0] hover:text-black transition-all duration-300"
              >
                Read Documentation
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 pt-12 border-t border-[#2A2D32]">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#48D6B0] mb-2">&lt; 2 min</div>
                <div className="text-sm text-[#B5B9C3]">Setup Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#48D6B0] mb-2">100%</div>
                <div className="text-sm text-[#B5B9C3]">Free Forever</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#48D6B0] mb-2">24/7</div>
                <div className="text-sm text-[#B5B9C3]">Support Available</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-3 bg-[#1C1E22] border border-[#48D6B0] border-opacity-30 rounded-2xl px-6 py-4 max-w-2xl mx-auto">
          <Icon name="Sparkles" size={20} color="#48D6B0" />
          <p className="text-sm text-[#B5B9C3]">
            <span className="text-[#48D6B0] font-semibold">Crow's Wisdom:</span> The best time to secure your crypto was yesterday. The second best time is now.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;