import Image from 'next/image';
import { FullCardType as Card } from '@/lib/tarot-types';
import { useState } from 'react';

interface CardThumbnailProps {
  card: Card;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  selected?: boolean;
}

const sizeClasses = {
  xs: 'w-12 h-16',
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

  // Construct the image path using the imagePath from the card prop and the correct base directory
  const basePath = '/images/tarot-images/cards/';
  const finalImagePath = card.imagePath ? `${basePath}${card.imagePath}` : ''; 
  // Fallback if card.imagePath is somehow not provided, though it should be
  const placeholderPath = `${basePath}placeholder.png`; // Assume you might have a placeholder

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
      {!imageError && finalImagePath ? (
        <Image
          src={finalImagePath}
          alt={card.name}
          fill
          className="object-cover"
          sizes={`(max-width: 768px) ${size === 'sm' ? '80px' : size === 'md' ? '112px' : '144px'}`}
          onError={(e) => {
            console.error('Image failed to load:', finalImagePath, e);
            setImageError(true);
          }}
          priority={true}
        />
      ) : (
        <div className="w-full h-full bg-slate-700/50 flex flex-col items-center justify-center text-center p-2 border border-slate-600 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400/70 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-slate-400 text-xs">Image <br/>Missing</p>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-2 pt-4">
        <p className="text-slate-100 text-xs font-semibold text-center truncate filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]">{card.name}</p>
      </div>
    </div>
  );
} 