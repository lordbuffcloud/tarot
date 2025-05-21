'use client';

import type { TarotSpread } from '@/lib/tarotSpreadTypes';
import tarotSpreadsData from '../../data/tarotSpreads.json'; // Adjust path if needed

interface SpreadSelectionScreenProps {
  onSelectSpread: (spread: TarotSpread) => void;
  onBack: () => void;
}

const spreads: TarotSpread[] = tarotSpreadsData as TarotSpread[];

export default function SpreadSelectionScreen({ onSelectSpread, onBack }: SpreadSelectionScreenProps) {
  return (
    <div className="min-h-screen bg-astral-dark text-astral-light p-4 sm:p-8 flex flex-col items-center">
      <header className="mb-10 text-center max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-esoteric-purple filter drop-shadow-[0_0_5px_rgba(126,87,194,0.8)] mb-4">
          Choose Your Constellation
        </h1>
        <p className="text-lg text-astral-light/90 leading-relaxed">
          Select a Tarot spread that resonates with your query. Each configuration of cards opens a unique portal to insight.
        </p>
      </header>

      <main className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spreads.map((spread) => (
            <button
              key={spread.id}
              onClick={() => onSelectSpread(spread)}
              className="bg-astral-bg hover:bg-shadow-blue p-6 rounded-lg shadow-xl shadow-esoteric-purple/20 ring-1 ring-esoteric-purple/40 hover:ring-starlight-gold/70 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-starlight-gold text-left flex flex-col justify-between h-full"
            >
              <div>
                <h2 className="text-2xl font-semibold text-starlight-gold mb-2">{spread.name}</h2>
                <p className="text-sm text-astral-light/80 mb-3 leading-relaxed line-clamp-3">
                  {spread.description}
                </p>
              </div>
              <p className="text-xs text-cosmic-blue mt-auto">
                {spread.card_positions.length} Cards
              </p>
            </button>
          ))}
        </div>
      </main>

      <footer className="mt-12 text-center">
        <button 
          onClick={onBack}
          className="text-astral-light/70 hover:text-starlight-gold underline transition-colors duration-200"
        >
          &larr; Back to Preparation
        </button>
      </footer>
    </div>
  );
} 