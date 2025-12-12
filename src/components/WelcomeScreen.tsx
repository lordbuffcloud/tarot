'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getReadingHistory } from '../lib/readingHistory';

interface WelcomeScreenProps {
  onNext: () => void; // Callback to proceed to the next step
  onViewHistory?: () => void; // Callback to view reading history
}

export default function WelcomeScreen({ onNext, onViewHistory }: WelcomeScreenProps) {
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    const history = getReadingHistory();
    setHasHistory(history.length > 0);
  }, []);

  return (
    <motion.div 
      className="min-h-screen text-mystic-text p-4 sm:p-8 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div 
        className="relative w-full max-w-2xl md:max-w-3xl lg:max-w-4xl aspect-[4/3] cursor-pointer mb-8"
        onClick={onNext}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onNext();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Click or press Enter to begin a new reading"
      >
        <Image 
          src="/images/background/land.png"
          alt="Welcome to the Astral Oracle - Click to Enter"
          fill
          priority
          className="rounded-lg shadow-xl object-contain
                     filter drop-shadow-[0_0_8px_rgba(255,215,0,0.6)] drop-shadow-[0_0_16px_rgba(255,215,0,0.4)] 
                     hover:drop-shadow-[0_0_12px_rgba(255,215,0,0.8)] hover:drop-shadow-[0_0_24px_rgba(255,215,0,0.6)] 
                     hover:scale-105 
                     transition-all duration-500 ease-in-out"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <motion.button
          onClick={onNext}
          className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-purple-500/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900 text-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Begin a new tarot reading"
        >
          Begin New Reading
        </motion.button>
        
        {hasHistory && onViewHistory && (
          <motion.button
            onClick={onViewHistory}
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-slate-500/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900 text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="View reading history"
          >
            View History
          </motion.button>
        )}
      </div>
    </motion.div>
  );
} 