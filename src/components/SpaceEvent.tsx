import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface SpaceEventProps {
  event: {
    year: number;
    title: string;
    description: string;
    type: 'launch' | 'discovery' | 'mission' | 'milestone';
    image?: string;
    wikipediaLink?: string;
  };
}

const SpaceEvent: React.FC<SpaceEventProps> = ({ event }) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'launch':
        return '🚀';
      case 'discovery':
        return '🔭';
      case 'mission':
        return '🛰️';
      case 'milestone':
        return '⭐';
      default:
        return '🌌';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'launch':
        return 'from-red-500 to-orange-500';
      case 'discovery':
        return 'from-purple-500 to-pink-500';
      case 'mission':
        return 'from-blue-500 to-cyan-500';
      case 'milestone':
        return 'from-yellow-500 to-amber-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="group relative bg-black/50 backdrop-blur-xl rounded-2xl border border-cyan-500/15 hover:border-cyan-400/40 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/15 overflow-hidden">
      {/* Event Type label */}
      <div className="absolute top-6 left-6 z-10">
        <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-4 py-2 rounded-full text-xs font-bold tracking-wider shadow-md group-hover:scale-105 transition-transform duration-300 uppercase">
          {event.type}
        </span>
      </div>

      {/* Card content */}
      <div className="p-6 pt-16 md:p-8 md:pt-20"> {/* Adjusted padding for responsiveness */}
        {/* Year and icon */}
        <div className="text-center mb-8">
          <div className="text-5xl md:text-6xl font-bold text-cyan-300 mb-4"> {/* Adjusted font size for responsiveness */}
            {event.year}
          </div>
          <div className="text-4xl mb-4">
            {event.image || getEventIcon(event.type)}
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white mb-6 leading-tight uppercase tracking-wide group-hover:text-cyan-200 transition-colors"> {/* Adjusted font size for responsiveness */}
            {event.title}
          </h3>
        </div>

        <p className="text-white/70 text-sm leading-relaxed text-center">
          {event.description}
        </p>
      </div>

      {/* Learn More button */}
      {event.wikipediaLink && (
        <div className="p-6 pt-0">
          <Button
            asChild
            variant="outline"
            className="w-full bg-transparent border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 rounded-full text-base font-medium transition-all duration-300 active:scale-95"
          >
            <a href={event.wikipediaLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center space-x-2">
              <span>Learn More</span>
              <ExternalLink size={16} />
            </a>
          </Button>
        </div>
      )}

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getEventColor(event.type)} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
    </div>
  );
};

export default SpaceEvent;