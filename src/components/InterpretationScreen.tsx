'use client';

import { motion } from 'framer-motion';
import type { SpreadCard } from '@/lib/tarot-types';
import type { TarotSpread } from '@/lib/tarotSpreadTypes';
import CardThumbnail from './CardThumbnail'; // Re-using for display

interface InterpretationScreenProps {
  question: string;
  spread: TarotSpread;
  drawnCards: SpreadCard[];
  interpretation: string;
  onStartOver: () => void;
  onAdjustCards: () => void; // To go back to CardInputScreen
}

export default function InterpretationScreen({
  question,
  spread,
  drawnCards,
  interpretation,
  onStartOver,
  onAdjustCards,
}: InterpretationScreenProps) {
  return (
    <motion.div 
      className="min-h-screen bg-mystic-dark text-mystic-text p-4 sm:p-8 flex flex-col items-center"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="mb-10 text-center max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-astral-amethyst filter drop-shadow-[0_0_5px_rgba(106,13,173,0.8)] mb-3">
          The Veil is Lifted
        </h1>
        <p className="text-lg text-mystic-text/90 italic">
          Regarding your query: &quot;{question}&quot;
        </p>
      </header>

      <main className="w-full max-w-5xl bg-midnight-ink shadow-2xl shadow-astral-amethyst/30 rounded-lg p-6 sm:p-8 ring-1 ring-astral-amethyst/50">
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-starlight-gold mb-4 text-center">
            Your Reading: {spread.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-6 place-items-center">
            {drawnCards.map((spreadCard, index) => (
              <motion.div
                key={index} 
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
              >
                <h3 className="text-sm font-semibold text-ethereal-blue mb-1 truncate w-full px-1">
                  {spread.card_positions[index]?.name || `Position ${index + 1}`}
                </h3>
                <CardThumbnail card={spreadCard.card} size="sm" /> 
                <p className="text-xs text-mystic-text/70 mt-1">
                  {spreadCard.card.name} {spreadCard.is_reversed ? '(Reversed)' : '(Upright)'}
                </p>
                 <p className="text-xs text-mystic-text/60 italic mt-0.5 px-1 line-clamp-2 h-8">
                  ({spread.card_positions[index]?.description})
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="mt-10 pt-6 border-t border-astral-amethyst/30 prose-tarot max-w-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-starlight-gold text-center">The Oracle&apos;s Message:</h2>
          <div
            className="whitespace-pre-wrap text-mystic-text/90 text-md leading-relaxed bg-shadow-purple/50 p-4 sm:p-6 rounded-md ring-1 ring-ethereal-blue/30"
            dangerouslySetInnerHTML={{ __html: interpretation.replace(/\n/g, '<br />') }}
          ></div>
        </motion.section>

        <motion.div
          className="mt-10 pt-6 border-t border-astral-amethyst/30 text-center space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <button 
            onClick={onAdjustCards}
            className="bg-ethereal-blue hover:bg-opacity-80 text-mystic-dark font-semibold py-2 px-6 rounded-md shadow-md hover:shadow-ethereal-blue/40 transition-all duration-200"
          >
            Adjust Cards/Question
          </button>
          <button 
            onClick={onStartOver}
            className="bg-astral-amethyst hover:bg-opacity-80 text-white font-semibold py-2 px-6 rounded-md shadow-md hover:shadow-astral-amethyst/40 transition-all duration-200"
          >
            Begin Anew (Start Over)
          </button>
        </motion.div>
      </main>

      <footer className="mt-16 mb-8 text-center text-xs text-mystic-text/50">
        <p>May these insights guide your path. The stars shift, and so does understanding.</p>
      </footer>
    </motion.div>
  );
} 