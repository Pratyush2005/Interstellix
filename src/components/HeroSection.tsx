import React, { useState, useEffect } from 'react';
import { Compass } from 'lucide-react';

interface HeroSectionProps {
  isScrolled: boolean;
  onExploreClick: () => void; // Now triggers scroll, not terminal
}

const HeroSection: React.FC<HeroSectionProps> = ({ isScrolled, onExploreClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getSpaceQuote = () => {
    const quotes = [
      "Whether it was the launch of a space telescope, the discovery of a new planet, or the birth of a legendary astronaut — today marks something extraordinary in the stars"
    ];
    return quotes[0];
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 pb-10">
      {/* Animated background elements */}
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        {/* Floating cosmic elements */}
        <div className="absolute top-20 left-10 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-twinkle delay-1"></div>
        <div className="absolute top-32 right-20 w-1.5 h-1.5 bg-blue-400 rounded-full animate-twinkle delay-2"></div>
        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-twinkle delay-3"></div>
        <div className="absolute top-1/3 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-twinkle delay-4"></div>
        <div className="absolute bottom-60 right-1/3 w-2.5 h-2.5 bg-cyan-300 rounded-full animate-twinkle delay-5"></div>
      </div>

      {/* Main content container */}
      <div className="max-w-6xl mx-auto z-10 relative">
        {/* Main title */}
        <h1 className={`text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-6 tracking-wider leading-tight transition-all duration-2000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          TODAY IN <br />
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent animate-glow-pulse transition-all duration-500">
            SPACE HISTORY
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className={`text-lg md:text-xl lg:text-2xl text-cyan-300 mb-10 max-w-4xl mx-auto leading-relaxed font-light transition-all duration-2000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          Journey through time and discover the most significant space missions,
          <br className="hidden md:block" />
          groundbreaking discoveries, and cosmic milestones that happened on this exact date in history.
        </p>

        {/* CTA Button */}
        <button 
          onClick={onExploreClick} // Now triggers scroll
          className={`group-button bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-full font-bold text-base md:px-8 md:py-4 md:text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/30 cosmic-glow mb-16 transition-all duration-2000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="flex items-center space-x-3">
            <Compass className="group-hover:rotate-12 transition-transform duration-300" size={20} />
            <span>EXPLORE THE COSMOS</span>
          </span>
        </button>

        {/* Quote section */}
        <div className={`max-w-4xl mx-auto transition-all duration-2000 delay-1500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-white/90 text-base md:text-lg lg:text-xl italic leading-relaxed font-light">
            "{getSpaceQuote()}"
          </p>
        </div>
      </div>

      {/* Enhanced floating planet decoration */}
      <div 
        className="absolute bottom-20 right-5 w-24 h-24 md:bottom-32 md:right-20 md:w-32 md:h-32 lg:w-48 lg:h-48 opacity-60 floating-element"
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-600 animate-float shadow-2xl shadow-blue-500/20 animate-glow-pulse transition-all duration-500"></div>
        <div className="absolute top-4 left-6 w-4 h-4 bg-white/30 rounded-full animate-twinkle"></div>
        <div className="absolute bottom-8 right-8 w-2 h-2 bg-cyan-400/50 rounded-full animate-twinkle delay-2"></div>
      </div>
    </div>
  );
};

export default HeroSection;