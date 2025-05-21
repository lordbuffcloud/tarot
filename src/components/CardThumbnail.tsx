import Image from 'next/image';
import { Card } from '@/lib/tarot-types';
import { useState } from 'react';

interface CardThumbnailProps {
  card: Card;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  selected?: boolean;
}

const sizeClasses = {
  sm: 'w-20 h-32',
  md: 'w-28 h-44',
  lg: 'w-36 h-56',
};

export default function CardThumbnail({ 
  card, 
  size = 'md', 
  onClick,
  selected = false 
}: CardThumbnailProps) {
  const [imageError, setImageError] = useState(false);
  const imagePath = `/cards/${card.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
  
  return (
    <div 
      className={`
        relative rounded-lg overflow-hidden shadow-xl shadow-esoteric-purple/20 transition-all duration-300 ease-in-out transform hover:scale-105
        ${sizeClasses[size]}
        ${selected ? 'ring-4 ring-starlight-gold shadow-starlight-gold/40' : 'hover:ring-2 hover:ring-cosmic-blue/70'}
        ${onClick ? 'cursor-pointer' : ''}
        border border-astral-light/10 hover:border-cosmic-blue/50
      `}
      onClick={onClick}
    >
      {!imageError ? (
        <Image
          src={imagePath}
          alt={card.name}
          fill
          className="object-cover"
          sizes={`(max-width: 768px) ${size === 'sm' ? '80px' : size === 'md' ? '112px' : '144px'}`}
          onError={(e) => {
            console.error('Image failed to load:', imagePath, e);
            setImageError(true);
          }}
          priority={true}
        />
      ) : (
        <div className="w-full h-full bg-shadow-blue flex flex-col items-center justify-center text-center p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-astral-light/30 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-astral-light/50 text-xs">Image <br/>Unavailable</p>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-2 pt-4">
        <p className="text-astral-light text-xs font-semibold text-center truncate filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]">{card.name}</p>
      </div>
    </div>
  );
} 