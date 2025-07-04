import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ImageOff, Globe } from 'lucide-react';

interface ApodData {
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  service_version: string;
  title: string;
  url: string;
  thumbnail_url?: string; // For video thumbnails
  copyright?: string;
}

const API_KEY = '6iTrgf8z3Tn6wMa3r1CigqmSR9fzLVWHmguFp79m'; // Your NASA API Key
const APOD_API_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

const fetchApod = async (): Promise<ApodData> => {
  const response = await fetch(APOD_API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch APOD data');
  }
  return response.json();
};

const AstronomyPictureOfTheDay: React.FC = () => {
  const { data, isLoading, isError, error } = useQuery<ApodData, Error>({
    queryKey: ['apod'],
    queryFn: fetchApod,
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
    retry: 2,
  });

  return (
    <div className="relative py-32 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Section Title */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-wider">
            ASTRONOMY PICTURE <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              OF THE DAY
            </span>
          </h2>
          <p className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Discover the universe, one stunning image at a time.
          </p>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-16 w-16 text-cyan-500 animate-spin mb-4" />
            <p className="text-cyan-400 text-lg">Loading cosmic masterpiece...</p>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-20 text-red-400">
            <ImageOff className="h-16 w-16 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Failed to load APOD</h3>
            <p className="text-lg text-center">Error: {error?.message || 'Unknown error'}</p>
            <p className="text-sm text-white/70 mt-2">Please try again later or check your network connection.</p>
          </div>
        )}

        {data && (
          <div className="bg-black/50 backdrop-blur-xl rounded-2xl border border-cyan-500/15 shadow-2xl shadow-cyan-500/10 p-6 md:p-8 lg:p-12 max-w-4xl mx-auto animate-fade-in">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 text-center leading-tight">
              {data.title}
            </h3>
            <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden mb-8">
              {data.media_type === 'image' ? (
                <img
                  src={data.url}
                  alt={data.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <iframe
                  src={data.url.replace('http://', 'https://')} // Ensure HTTPS for embedding
                  title={data.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              )}
            </div>
            <p className="text-sm md:text-base lg:text-lg text-white/80 leading-relaxed mb-6">
              {data.explanation}
            </p>
            <div className="flex flex-wrap justify-between items-center text-white/60 text-xs md:text-sm">
              <span>Date: {data.date}</span>
              {data.copyright && <span>© {data.copyright}</span>}
              <a
                href={`https://apod.nasa.gov/apod/ap${data.date.replace(/-/g, '').substring(2)}.html`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <Globe size={14} />
                <span>View on NASA APOD</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AstronomyPictureOfTheDay;