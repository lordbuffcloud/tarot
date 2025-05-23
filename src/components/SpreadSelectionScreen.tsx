'use client';

import { motion } from 'framer-motion';
import type { TarotSpread } from '@/lib/tarotSpreadTypes';
import tarotSpreadsData from '../../data/tarotSpreads.json'; // Adjust path if needed

interface SpreadSelectionScreenProps {
  onSelectSpread: (spread: TarotSpread) => void;
  onBack: () => void;
}

const spreads: TarotSpread[] = tarotSpreadsData as TarotSpread[];

export default function SpreadSelectionScreen({ onSelectSpread, onBack }: SpreadSelectionScreenProps) {
  return (
    <motion.div 
      className="min-h-screen bg-mystic-dark text-mystic-text p-4 sm:p-8 flex flex-col items-center"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="mb-10 text-center max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-astral-amethyst filter drop-shadow-[0_0_5px_rgba(106,13,173,0.8)] mb-4">
          Choose Your Constellation
        </h1>
        <p className="text-lg text-mystic-text/90 leading-relaxed">
          Select a Tarot spread that resonates with your query. Each configuration of cards opens a unique portal to insight.
        </p>
      </header>

      <main className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spreads.map((spread) => (
            <motion.button
              key={spread.id}
              onClick={() => onSelectSpread(spread)}
              className="bg-midnight-ink hover:bg-shadow-purple p-6 rounded-lg shadow-xl shadow-astral-amethyst/20 ring-1 ring-astral-amethyst/40 hover:ring-starlight-gold/70 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-starlight-gold text-left flex flex-col justify-between h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: spreads.indexOf(spread) * 0.1 }}
            >
              <div>
                <h2 className="text-2xl font-semibold text-starlight-gold mb-2">{spread.name}</h2>
                <p className="text-sm text-mystic-text/80 mb-3 leading-relaxed line-clamp-3">
                  {spread.description}
                </p>
              </div>
              <p className="text-xs text-ethereal-blue mt-auto">
                {spread.card_positions.length} Cards
              </p>
            </motion.button>
          ))}
        </div>
      </main>

      <footer className="mt-12 text-center">
        <button 
          onClick={onBack}
          className="text-mystic-text/70 hover:text-starlight-gold underline transition-colors duration-200"
        >
          &larr; Back to Preparation
        </button>
      </footer>
    </motion.div>
  );
} 