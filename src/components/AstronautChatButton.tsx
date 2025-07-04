import React from 'react';
import AstronautHint from './AstronautHint';

interface AstronautChatButtonProps {
  isOpen: boolean; // Whether the chat window is open
  onToggle: () => void; // Function to toggle chat window
  showHint: boolean; // Whether to show the hint
  idleMessage: string | null; // New prop for dynamic idle/hint messages
}

const AstronautChatButton: React.FC<AstronautChatButtonProps> = ({ isOpen, onToggle, showHint, idleMessage }) => {
  return (
    <div className="fixed bottom-0 left-0 z-40 pointer-events-none">
      {/* Astronaut Hint positioned relative to the astronaut button */}
      {showHint && idleMessage && ( // Only show hint if showHint is true AND there's a message
        <div className="absolute bottom-[calc(100%+1rem)] left-1/2 -translate-x-1/2 ml-[0.5rem] md:ml-[1rem] lg:ml-[2rem]">
          <AstronautHint message={idleMessage} />
        </div>
      )}

      {/* Astronaut toggle button */}
      <button
        onClick={onToggle}
        className="relative w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 pointer-events-auto cursor-pointer animate-float hover:scale-110 transition-transform duration-300"
        aria-label={isOpen ? "Close chat" : "Open chat with astronaut"}
      >
        <img
          src="/lovable-uploads/astronaut.png"
          alt="Floating Astronaut"
          className="w-full h-full object-contain"
        />
      </button>
    </div>
  );
};

export default AstronautChatButton;