import React, { useState } from "react";
import { Compass, Volume2, VolumeX, Search as SearchIcon } from "lucide-react";

interface NavigationProps {
  onLaunchDiagnosticsClick: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onLaunchQuizClick: () => void;
  
}

const Navigation: React.FC<NavigationProps> = ({
  onLaunchDiagnosticsClick,
  isMuted,
  onToggleMute,
  onLaunchQuizClick,
  
}) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/15 backdrop-blur-xl border-b border-cyan-500/10 py-2 md:py-3 lg:py-3">
      <div className="container mx-auto px-4 flex items-center justify-between gap-x-4">
        {/* LOGO and existing buttons */}
        <div className="flex items-center space-x-2 min-w-0">
          <img
            src="/lovable-uploads/image copy.png"
            alt="Interstellix Logo"
            className="h-10 w-10 md:h-12 md:w-12 lg:h-16 lg:w-16 object-contain flex-shrink-0"
          />
          <img
            src="/lovable-uploads/image.png"
            alt="Lovable Upload"
            className="h-10 w-10 md:h-12 md:w-12 lg:h-16 lg:w-16 object-contain flex-shrink-0"
          />
        </div>

        

        {/* EXISTING BUTTONS */}
        <div className="flex items-center space-x-4 ml-auto">
          <button
            onClick={onToggleMute}
            className="group bg-transparent border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 rounded-full p-2 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-cyan-500/30"
            aria-label={isMuted ? "Unmute background sound" : "Mute background sound"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button
            onClick={onLaunchDiagnosticsClick}
            className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-black px-2 py-1 rounded-full font-semibold text-xs md:px-3 md:py-1.5 md:text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-cyan-500/30"
          >
            LAUNCH DIAGNOSTICS
          </button>
          <button
            onClick={onLaunchQuizClick}
            className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-black px-2 py-1 rounded-full font-semibold text-xs md:px-3 md:py-1.5 md:text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-cyan-500/30"
          >
            LAUNCH QUIZ
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
