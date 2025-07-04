import React, { useState, useEffect } from 'react';

interface OpeningAnimationProps {
  onComplete: () => void;
}

const OpeningAnimation: React.FC<OpeningAnimationProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 500);
    const timer2 = setTimeout(() => setStage(2), 1500);
    const timer3 = setTimeout(() => setStage(3), 2500);
    const timer4 = setTimeout(() => onComplete(), 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
      {/* Cosmic background */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-900/20 via-purple-900/10 to-black"></div>

      {/* Shooting stars */}
      {stage >= 1 && (
        <>
          <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-bounce"></div>
        </>
      )}

      {/* Main logo/title */}
      <div className="text-center z-10 px-4">
        {stage >= 0 && (
          <div className={`transition-all duration-1000 ${stage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
            <div className="text-[10vw] sm:text-6xl md:text-8xl font-bold text-white mb-4 tracking-wider leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                INTERSTELLIX
              </span>
            </div>
          </div>
        )}

        {stage >= 2 && (
          <div className={`transition-all duration-1000 ${stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-cyan-300 text-lg sm:text-xl md:text-2xl font-light tracking-wide">
              Journey Through Space & Time
            </p>
          </div>
        )}

        {stage >= 3 && (
          <div className={`mt-6 sm:mt-8 transition-all duration-1000 ${stage >= 3 ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto"></div>
          </div>
        )}
      </div>

      {/* Orbiting element */}
      {stage >= 2 && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="animate-orbit">
              <div className="w-2 h-2 sm:w-4 sm:h-4 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpeningAnimation;
