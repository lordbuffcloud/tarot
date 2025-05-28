'use client';

import { motion } from 'framer-motion';
import type { TarotSpread } from '@/lib/tarotSpreadTypes';
import tarotSpreadsData from '../../data/tarotSpreads.json';

interface SpreadSelectionScreenProps {
  onSelectSpread: (spread: TarotSpread) => void;
  onBack: () => void;
  userQuestion: string;
}

const spreads: TarotSpread[] = tarotSpreadsData as TarotSpread[];

export default function SpreadSelectionScreen({ 
  onSelectSpread, 
  onBack, 
  userQuestion 
}: SpreadSelectionScreenProps) {
  return (
    <motion.div 
      className="min-h-screen bg-mystic-dark text-mystic-text p-4 sm:p-8 flex flex-col items-center"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-slate-900/70 backdrop-blur-sm p-6 sm:p-10 rounded-xl shadow-2xl shadow-purple-900/50 ring-1 ring-purple-700/60 max-w-5xl w-full">
        <header className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-purple-300 filter drop-shadow-[0_0_6px_rgba(192,132,252,0.7)] mb-4">
            Choose Your Constellation
          </h1>
          
          <div className="text-lg bg-slate-800/50 p-4 rounded-md shadow border border-purple-600/40 mb-6">
            <p className="text-slate-200/90 leading-relaxed">
              Your chosen focus for this reading is: 
            </p>
            <p className="text-sky-300 font-semibold text-xl my-2 p-3 bg-slate-700/40 rounded">
              &quot;{userQuestion}&quot;
            </p>
            <p className="text-slate-300/90 leading-relaxed mt-3">
              With your question held firmly in mind and your deck attuned, select a Tarot spread below that resonates with your inquiry. Each configuration of cards opens a unique portal to insight.
            </p>
          </div>
          
          <button 
            onClick={() => alert('Spread information guide coming soon!')}
            className="text-sm text-sky-400 hover:text-sky-200 underline mb-8 transition-colors duration-200"
          >
            Need help choosing? Learn about these Tarot Spreads
          </button>
        </header>

        <main className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spreads.map((spread) => (
              <motion.button
                key={spread.id}
                onClick={() => {
                  if (!userQuestion.trim()) {
                    alert("It seems your question was cleared. Please go back and re-enter it.");
                    return;
                  }
                  onSelectSpread(spread);
                }}
                className="bg-slate-800/60 hover:bg-purple-700/60 p-6 rounded-lg shadow-xl shadow-purple-900/30 ring-1 ring-purple-600/50 hover:ring-sky-400/70 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-400 text-left flex flex-col justify-between h-full disabled:opacity-50 disabled:cursor-not-allowed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: spreads.indexOf(spread) * 0.1 }}
              >
                <div>
                  <h2 className="text-2xl font-semibold text-sky-300 mb-2">{spread.name}</h2>
                  <p className="text-sm text-slate-300/80 mb-3 leading-relaxed line-clamp-3">
                    {spread.description}
                  </p>
                </div>
                <p className="text-xs text-sky-400/80 mt-auto">
                  {spread.card_positions.length} Cards
                </p>
              </motion.button>
            ))}
          </div>
          <p className="text-center text-sm text-slate-400/80 mt-8">
            After selecting your constellation, you will be guided to capture an image of the cards you physically draw.
          </p>
        </main>

        <footer className="mt-12 text-center">
          <button 
            onClick={onBack}
            className="text-slate-300/70 hover:text-sky-300 underline transition-colors duration-200 py-2 px-4"
          >
            &larr; Back to Attunement Step
          </button>
        </footer>
      </div>
    </motion.div>
  );
} 