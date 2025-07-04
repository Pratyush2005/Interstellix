import React from 'react';

interface AstronautHintProps {
  message: string | null; // New prop for dynamic messages
}

const AstronautHint: React.FC<AstronautHintProps> = ({ message }) => {
  return (
    <div
      className="w-auto min-w-[100px] h-12 md:h-14 
                 glass text-white 
                 rounded-full 
                 flex items-center justify-center px-4 py-2
                 animate-fade-in relative group pointer-events-none"
    >
      <span className="text-sm md:text-base font-bold font-inter whitespace-nowrap">
        {message || "Click me!"}
      </span>
      
      {/* Speech bubble tail */}
      <div className="absolute bottom-0 left-1/2 w-0 h-0 
                      border-x-8 border-x-transparent border-t-8 border-t-black/20 
                      transform -translate-x-1/2 translate-y-full"></div>
    </div>
  );
};

export default AstronautHint;