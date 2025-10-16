import React from 'react';
import Navigation from './components/Navigation';
import HeroSection from './sections/HeroSection';
import KeyFeaturesSection from './sections/KeyFeaturesSection';
import WhyChooseUsSection from './sections/WhyChooseUsSection';
import FeaturesSection from './sections/FeaturesSection';
import QuickPromptsSection from './sections/QuickPromptsSection';
import StatsSection from './sections/StatsSection';
import FAQSection from './sections/FAQSection';
import FooterSection from './sections/FooterSection';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="w-full landing-page">
      <Navigation />
      <HeroSection />
      <KeyFeaturesSection />
      <WhyChooseUsSection />
      {/* <div id="features">
        <FeaturesSection />
      </div> */}
      <div id="quick-start">
        <QuickPromptsSection />
      </div>
      <div id="stats">
        <StatsSection />
      </div>
      <FAQSection />
      <FooterSection />
    </div>
  );
};

export default LandingPage; 