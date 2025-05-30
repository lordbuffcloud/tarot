'use client';

import { motion } from 'framer-motion';

interface AskQuestionScreenProps {
  userQuestion: string;
  setUserQuestion: (question: string) => void;
  onQuestionSubmit: (question: string) => void;
  onBack: () => void;
}

export default function AskQuestionScreen({ 
  userQuestion, 
  setUserQuestion, 
  onQuestionSubmit,
  onBack
}: AskQuestionScreenProps) {
  
  const handleSubmit = () => {
    if (userQuestion.trim()) {
      onQuestionSubmit(userQuestion);
    } else {
      // Optional: Add some visual feedback if the question is empty
      alert("Please scribe your query before proceeding.");
    }
  };

  return (
    <motion.div 
      className="min-h-screen text-slate-100 p-4 sm:p-8 flex flex-col items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <header className="mb-10 text-center max-w-2xl w-full bg-slate-900/70 backdrop-blur-sm p-6 rounded-xl shadow-2xl shadow-purple-900/50 ring-1 ring-purple-700/60">
        <h1 className="text-4xl sm:text-5xl font-bold text-purple-300 filter drop-shadow-[0_0_6px_rgba(192,132,252,0.7)] mb-6">
          Consult the Oracle
        </h1>
        <p className="text-lg text-slate-200/90 leading-relaxed">
          The veil thins. What answers do you seek from the Tarot&apos;s wisdom?
          Focus your mind, quiet your spirit, and scribe your question below. This will be the beacon for your reading.
        </p>
      </header>

      <main className="w-full max-w-xl mb-10 bg-slate-900/70 backdrop-blur-sm p-6 rounded-xl shadow-2xl shadow-purple-900/50 ring-1 ring-purple-700/60">
        <textarea
          rows={4}
          value={userQuestion}
          onChange={(e) => setUserQuestion(e.target.value)}
          placeholder="E.g., What should I focus on in my career right now? or How can I improve my relationship with...?"
          className="w-full p-4 bg-slate-800 border-2 border-purple-600/70 rounded-lg text-slate-100 text-base sm:text-lg placeholder:text-slate-400 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 shadow-xl transition-colors duration-300 ease-in-out"
          aria-label="Your question for the tarot"
        />
      </main>

      <footer className="flex flex-col sm:flex-row items-center gap-4 mt-6 sm:mt-0 bg-slate-900/70 backdrop-blur-sm p-6 rounded-xl shadow-2xl shadow-purple-900/50 ring-1 ring-purple-700/60">
        <button 
          onClick={onBack}
          className="text-slate-300 hover:text-sky-300 underline transition-colors duration-200 order-2 sm:order-1 py-2 px-4"
        >
          &larr; Return to Welcome
        </button>
        <button 
          onClick={handleSubmit}
          disabled={!userQuestion.trim()}
          className="bg-gradient-to-r from-purple-600 to-sky-600 hover:from-purple-700 hover:to-sky-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out text-xl order-1 sm:order-2"
        >
          Set My Question &rarr;
        </button>
      </footer>
    </motion.div>
  );
} 