import React from 'react';
import Navigation from './components/Navigation';
import HeroSection from './sections/HeroSection';
import FeaturesSection from './sections/FeaturesSection';
import QuickPromptsSection from './sections/QuickPromptsSection';
import StatsSection from './sections/StatsSection';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Navigation />
      <HeroSection />
      <div id="features">
        <FeaturesSection />
      </div>
      <div id="quick-start">
        <QuickPromptsSection />
      </div>
      <div id="stats">
        <StatsSection />
      </div>
    </div>
  );
};

export default LandingPage; 