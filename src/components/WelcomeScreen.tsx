'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface WelcomeScreenProps {
  onNext: () => void; // Callback to proceed to the next step
}

export default function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <motion.div 
      className="min-h-screen text-mystic-text p-4 sm:p-8 flex flex-col items-center justify-center cursor-pointer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onNext}
    >
      <div className="relative w-full max-w-2xl md:max-w-3xl lg:max-w-4xl aspect-[4/3]">
        <Image 
          src="/images/background/land.png"
          alt="Welcome to the Tarot Oracle - Click to Enter"
          fill
          priority
          className="rounded-lg shadow-xl object-contain
                     filter drop-shadow-[0_0_8px_rgba(255,215,0,0.6)] drop-shadow-[0_0_16px_rgba(255,215,0,0.4)] 
                     hover:drop-shadow-[0_0_12px_rgba(255,215,0,0.8)] hover:drop-shadow-[0_0_24px_rgba(255,215,0,0.6)] 
                     hover:scale-105 
                     transition-all duration-500 ease-in-out"
        />
      </div>
    </motion.div>
  );
} 