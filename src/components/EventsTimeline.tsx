import React, { useState, useEffect, forwardRef } from 'react';
import SpaceEvent from './SpaceEvent';
import DatePicker from './DatePicker';
import { toast } from 'sonner';

// Import the local JSON data
import allSpaceEvents from '@/data/spaceEventsData.json';

interface EventsTimelineProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const EventsTimeline = forwardRef<HTMLDivElement, EventsTimelineProps>(({ selectedDate, onDateChange }, ref) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const month = selectedDate.getMonth() + 1; // getMonth() is 0-indexed
    const day = selectedDate.getDate();

    // Filter events from the local JSON data
    const filteredEvents = allSpaceEvents.filter(event => 
      event.month === month && event.day === day
    );

    setEvents(filteredEvents);
    setLoading(false);

  }, [selectedDate]);

  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <div ref={ref} className="relative py-32 px-4">
      <div className="container mx-auto max-w-7xl">
        <DatePicker onDateChange={onDateChange} selectedDate={selectedDate} />

        {/* Events Grid Title */}
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 tracking-wider leading-tight uppercase">
            SPACE EVENTS ON <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {formatSelectedDate(selectedDate)}
            </span>
          </h3>
          <p className="text-cyan-400 text-base md:text-lg">
            {loading ? 'Loading cosmic events...' : ''}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {events.map((event, index) => (
              <div
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <SpaceEvent event={event} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🌌</div>
            <h3 className="text-3xl font-bold text-white mb-4">No Events Found</h3>
            <p className="text-white/70 text-lg">
              No recorded space events found for {formatSelectedDate(selectedDate)}. 
              <br />Try selecting a different date to explore more cosmic history!
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

export default EventsTimeline;