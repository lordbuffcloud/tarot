'use client';

import { motion } from 'framer-motion';
import type { SpreadCard } from '@/lib/tarot-types';
import type { TarotSpread } from '@/lib/tarotSpreadTypes';
import CardThumbnail from './CardThumbnail'; // Re-using for display
import LoadingOracle from './LoadingOracle'; // Import the new loading component

interface InterpretationScreenProps {
  question: string;
  spread: TarotSpread;
  drawnCards: SpreadCard[];
  interpretation: string;
  onStartOver: () => void;
  onAdjustCards: () => void; // To go back to CardInputScreen
  isLoading?: boolean; // Added isLoading prop
}

export default function InterpretationScreen({
  question,
  spread,
  drawnCards,
  interpretation,
  onStartOver,
  onAdjustCards,
  isLoading = false, // Default to false
}: InterpretationScreenProps) {
  if (isLoading) {
    return <LoadingOracle />;
  }

  // const backgroundStyle = { // Removed local background style
  //   backgroundImage: `url('/images/backgrounds/card-reading-background/wood.png')`,
  //   backgroundSize: 'cover',
  //   backgroundPosition: 'center',
  //   backgroundRepeat: 'no-repeat',
  // };

  // Animation variants for staggered reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, duration: 0.5 } // Stagger children, overall screen fade-in
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="min-h-screen text-slate-100 p-4 sm:p-8 flex flex-col items-center selection:bg-sky-500 selection:text-white"
      // style={backgroundStyle} // Removed local background style
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      <motion.header variants={itemVariants} className="mb-10 text-center max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-purple-300 filter drop-shadow-[0_0_6px_rgba(192,132,252,0.7)] mb-3">
          The Veil is Lifted
        </h1>
        <p className="text-lg text-slate-300/90 italic">
          Regarding your query: &quot;{question}&quot;
        </p>
      </motion.header>

      <motion.main variants={itemVariants} className="w-full max-w-5xl bg-slate-800/60 backdrop-blur-sm shadow-2xl shadow-purple-900/40 rounded-xl p-6 sm:p-8 ring-1 ring-purple-700/60">
        <motion.section
          variants={itemVariants}
          className="mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold text-sky-300 mb-6 text-center filter drop-shadow-[0_0_4px_rgba(125,211,252,0.5)]">
            Your Reading: {spread.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-6 place-items-center">
            {drawnCards.map((spreadCard, index) => (
              <motion.div
                key={index} 
                className="flex flex-col items-center text-center p-2 bg-slate-700/30 rounded-lg shadow-md ring-1 ring-slate-600/50"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <h3 className="text-sm font-semibold text-sky-200 mb-1 truncate w-full px-1">
                  {spread.card_positions[index]?.name || `Position ${index + 1}`}
                </h3>
                <CardThumbnail card={spreadCard.card} size="sm" /> 
                <p className="text-xs text-slate-300 mt-1">
                  {spreadCard.card.name} {spreadCard.is_reversed ? '(Reversed)' : '(Upright)'}
                </p>
                 <p className="text-xs text-slate-400 italic mt-0.5 px-1 line-clamp-2 h-8">
                  ({spread.card_positions[index]?.description})
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          variants={itemVariants}
          className="mt-10 pt-6 border-t border-purple-700/40"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-purple-300 text-center filter drop-shadow-[0_0_5px_rgba(192,132,252,0.6)]">The Oracle&apos;s Message:</h2>
          <div
            className="whitespace-pre-wrap text-slate-200 text-lg leading-relaxed bg-slate-900/70 p-4 sm:p-6 rounded-lg ring-1 ring-purple-600/50 shadow-inner prose prose-sm sm:prose-base prose-invert prose-headings:text-sky-300 prose-p:text-slate-200 prose-strong:text-slate-100 max-w-none"
            dangerouslySetInnerHTML={{ __html: interpretation.replace(/\n/g, '<br />') }}
          ></div>
        </motion.section>

        <motion.div
          variants={itemVariants}
          className="mt-10 pt-6 border-t border-purple-700/40 text-center flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6"
        >
          <button 
            onClick={onAdjustCards}
            className="w-full sm:w-auto bg-sky-600 hover:bg-sky-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-sky-500/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-800"
          >
            Adjust Reading Focus
          </button>
          <button 
            onClick={onStartOver}
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-purple-500/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-800"
          >
            Begin Anew
          </button>
        </motion.div>
      </motion.main>

      <motion.footer variants={itemVariants} className="mt-12 mb-6 text-center text-sm text-slate-400/80">
        <p>May these insights guide your path. The stars shift, and so does understanding.</p>
      </motion.footer>
    </motion.div>
  );
} 