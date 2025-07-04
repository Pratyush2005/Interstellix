import React from 'react';
import { Compass, Volume2, VolumeX } from 'lucide-react'; // Import Volume2 and VolumeX icons

interface NavigationProps {
  onLaunchDiagnosticsClick: () => void;
  isMuted: boolean; // New prop for mute state
  onToggleMute: () => void; // New prop for toggling mute
}

const Navigation: React.FC<NavigationProps> = ({ onLaunchDiagnosticsClick, isMuted, onToggleMute }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/15 backdrop-blur-xl border-b border-cyan-500/10 py-2 md:py-3 lg:py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-x-4 overflow-hidden">
          <div className="flex items-center space-x-2 min-w-0">
            <img
              src="/interlogo.png"
              alt="Interstellix Logo"
              className="h-10 w-10 md:h-12 md:w-12 lg:h-20 lg:w-20 object-contain mr-2 flex-shrink-0"
            />
            <span className="hidden sm:inline text-white font-bold text-sm sm:text-base md:text-lg tracking-wider truncate">
              INTERSTELLIX
            </span>
          </div>
          <div className="flex items-center space-x-4 ml-auto">
            <button
              onClick={onToggleMute}
              className="group bg-transparent border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 rounded-full p-2 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-cyan-500/30"
              aria-label={isMuted ? "Unmute background sound" : "Mute background sound"}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <div className="sm:static sm:translate-x-0 absolute left-1/2 -translate-x-1/2 sm:relative sm:left-auto sm:ml-0">
              <button
                onClick={onLaunchDiagnosticsClick}
                className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-black px-2 py-1 rounded-full font-semibold text-[10px] sm:text-xs md:px-3 md:py-1.5 md:text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-cyan-500/30 cosmic-glow"
              >
                LAUNCH DIAGNOSTICS
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;