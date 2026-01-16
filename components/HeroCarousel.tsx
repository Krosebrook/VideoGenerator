
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import { MOCK_VIDEOS } from '../constants';

interface HeroCarouselProps {
  forceMute: boolean;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ forceMute }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const video = MOCK_VIDEOS[currentIndex];

  useEffect(() => {
    if (forceMute) {
      setIsMuted(true);
    }
  }, [forceMute]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % MOCK_VIDEOS.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + MOCK_VIDEOS.length) % MOCK_VIDEOS.length);
  }, []);

  return (
    <div className="absolute inset-0 bg-black group">
      <video
        key={video.id}
        src={video.videoUrl}
        className="w-full h-full object-cover opacity-80"
        autoPlay
        muted={isMuted}
        playsInline
        onEnded={handleNext}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 p-10 w-full md:w-3/4 text-white pointer-events-none">
        <div className="animate-in slide-in-from-bottom-4 fade-in duration-1000">
          <div className="flex items-center gap-2 mb-2">
             <div className="px-2 py-0.5 bg-white/10 backdrop-blur-md rounded text-[10px] uppercase font-bold tracking-widest border border-white/20">Featured Work</div>
          </div>
          <h3 className="text-2xl md:text-3xl font-black mb-2 drop-shadow-xl">{video.title}</h3>
          <p className="text-sm md:text-base text-stone-300 line-clamp-2 max-w-lg leading-relaxed opacity-80">
            {video.description}
          </p>
        </div>
      </div>
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-8 right-8 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/30 transition-all z-20"
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
      <div className="absolute inset-y-0 left-0 flex items-center px-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={handlePrev} className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-all transform hover:scale-110">
          <ChevronLeft size={24} />
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center px-6 opacity-0 group-hover:opacity-100 transition-opacity">
         <button onClick={handleNext} className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-all transform hover:scale-110">
          <ChevronRight size={24} />
        </button>
      </div>
      <div className="absolute bottom-10 right-10 flex gap-2 z-10">
        {MOCK_VIDEOS.map((_, idx) => (
          <div key={idx} className={`h-1 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-10 bg-white' : 'w-2 bg-white/20'}`} />
        ))}
      </div>
    </div>
  );
};
