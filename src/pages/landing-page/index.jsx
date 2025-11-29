import React, { useEffect } from 'react';
import HeroSection from './components/HeroSection';
import FeatureCards from './components/FeatureCards';
import HowItWorks from './components/HowItWorks';
import TrustSignals from './components/TrustSignals';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

const LandingPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <HeroSection />
      <FeatureCards />
      <HowItWorks />
      <TrustSignals />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;