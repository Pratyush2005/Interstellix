import React from 'react';

const SpaceTimeIntro = () => {
  return (
    <div className="relative py-32 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Section Title */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-wider">
            Your Journey Through <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Space-Time
            </span> Begins Here!
          </h2>
          <p className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Explore historical space events that occurred on any date throughout history
          </p>
        </div>

        {/* Planet visual element */}
        <div className="flex justify-center mb-16">
          <div className="relative">
            <div className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-800 shadow-2xl shadow-blue-500/30 animate-float">
              {/* Planet surface details */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-400/30 to-transparent"></div>
              <div className="absolute top-8 left-12 w-6 h-6 rounded-full bg-white/20"></div>
              <div className="absolute bottom-16 right-8 w-4 h-4 rounded-full bg-white/15"></div>
            </div>
            {/* Orbital rings */}
            <div className="absolute inset-0 border-2 border-cyan-400/20 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
            <div className="absolute inset-8 border border-blue-400/15 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
          </div>
        </div>

        {/* Floating satellite */}
        <div className="absolute top-20 right-10 w-24 h-24 opacity-60 animate-float">
          <div className="text-6xl">🛰️</div>
        </div>
      </div>
    </div>
  );
};

export default SpaceTimeIntro;