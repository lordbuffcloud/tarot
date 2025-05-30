'use client';

import { motion } from 'framer-motion';

interface SetIntentScreenProps {
  userQuestion: string;
  onIntentSet: () => void;
  onBack: () => void;
}

export default function SetIntentScreen({ 
  userQuestion,
  onIntentSet,
  onBack
}: SetIntentScreenProps) {
  return (
    <motion.div 
      className="min-h-screen bg-mystic-dark text-mystic-text p-4 sm:p-8 flex flex-col items-center justify-center"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-slate-900/70 backdrop-blur-sm p-6 sm:p-10 rounded-xl shadow-2xl shadow-purple-900/50 ring-1 ring-purple-700/60 max-w-4xl w-full">
        <header className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-purple-300 filter drop-shadow-[0_0_6px_rgba(192,132,252,0.7)] mb-4">
            Attune with Your Deck
          </h1>
          <p className="text-lg text-slate-200/90 leading-relaxed mb-6">
            Your question is set: <strong className='text-sky-300'>&quot;{userQuestion}&quot;</strong>
          </p>
          <div className="text-left text-slate-300/90 leading-relaxed space-y-4 bg-slate-800/50 p-6 rounded-lg shadow-lg border border-purple-600/40">
            <p className="text-xl text-center text-sky-200 mb-4">Prepare for Revelation:</p>
            <p>
              <strong className="text-slate-100">1. Hold Your Tarot Deck:</strong> Gently cradle your physical cards. Feel their texture, their history, their accumulated wisdom. This is your conduit to the symbolic language of the Tarot.
            </p>
            <p>
              <strong className="text-slate-100">2. Focus on Your Question:</strong> Bring your question—<em className='text-sky-300/90'>&quot;{userQuestion}&quot;</em>—to the forefront of your mind. Let it permeate your thoughts and emotions.
            </p>
            <p>
              <strong className="text-slate-100">3. Shuffle with Intent:</strong> As you shuffle the cards, visualize your query infusing the deck. There&apos;s no right or wrong way to shuffle; do what feels natural. Continue until you feel a sense of completion or connection.
            </p>
            <p>
              <strong className="text-slate-100">4. The Next Step:</strong> Once you feel attuned and your cards are imbued with your energy, you will select a spread pattern (a constellation) for your reading.
            </p>
          </div>
        </header>

        <footer className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10">
          <button 
            onClick={onBack}
            className="text-slate-300/70 hover:text-sky-300 underline transition-colors duration-200 order-2 sm:order-1 py-2 px-4"
          >
            &larr; Refine Question
          </button>
          <button 
            onClick={onIntentSet}
            className="bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out text-xl order-1 sm:order-2"
          >
            I Am Attuned, Proceed to Constellations &rarr;
          </button>
        </footer>
      </div>
    </motion.div>
  );
} 