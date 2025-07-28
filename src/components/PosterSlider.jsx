import React from 'react';
import { posters } from '../assets/posters';

export default function PosterSlider() {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      <div className="whitespace-nowrap animate-slide backdrop-blur-sm opacity-60">
        {posters.concat(posters).map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`poster-${i}`}
            className="inline-block h-screen w-auto object-cover mx-1"
          />
        ))}
      </div>
    </div>
  );
}
