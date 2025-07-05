import React, { useState } from "react";
import { Volume2, VolumeX, Search as SearchIcon, Sparkles } from "lucide-react";

interface NavigationProps {
  onLaunchDiagnosticsClick: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onLaunchQuizClick: () => void;
  onSearch: (query: string) => void;
  onToggleFunFacts: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  onLaunchDiagnosticsClick,
  isMuted,
  onToggleMute,
  onLaunchQuizClick,
  onSearch,
  onToggleFunFacts,
}) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchInput.trim() !== "") {
      onSearch(searchInput.trim());
      setSearchInput("");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/15 backdrop-blur-xl border-b border-cyan-500/10 py-2 md:py-3">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
        {/* LOGO */}
        <div className="flex items-center space-x-2">
          <img
            src="/lovable-uploads/image copy.png"
            alt="Interstellix Logo"
            className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 object-contain"
          />
          <img
            src="/lovable-uploads/image.png"
            alt="Lovable Upload"
            className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 object-contain"
          />
        </div>

        {/* SEARCH BAR */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center bg-black/40 rounded-full px-2 py-1 border border-cyan-500/20 w-full md:w-auto"
        >
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search events..."
            className="bg-transparent text-white placeholder-cyan-400 outline-none px-2 py-1 flex-grow md:flex-none"
          />
          <button type="submit" aria-label="Search">
            <SearchIcon size={18} className="text-cyan-400" />
          </button>
        </form>

        {/* BUTTONS */}
        <div className="flex flex-wrap justify-center md:justify-end items-center space-x-2 md:space-x-4 w-full md:w-auto">
          <button
            onClick={onToggleMute}
            className="group bg-transparent border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 rounded-full p-2 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-cyan-500/30"
            aria-label={isMuted ? "Unmute background sound" : "Mute background sound"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <button
            onClick={onLaunchDiagnosticsClick}
            className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-black px-2 py-1 rounded-full font-semibold text-xs md:text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-cyan-500/30"
          >
            LAUNCH DIAGNOSTICS
          </button>

          <button
            onClick={onLaunchQuizClick}
            className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-black px-2 py-1 rounded-full font-semibold text-xs md:text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-cyan-500/30"
          >
            LAUNCH QUIZ
          </button>

          <button
            onClick={onToggleFunFacts}
            className="group bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-black px-2 py-1 rounded-full font-semibold text-xs md:text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/30"
          >
            <Sparkles size={16} className="inline mr-1" />
            FUN FACTS
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
