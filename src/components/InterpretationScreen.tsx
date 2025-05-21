'use client';

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
    <div className="min-h-screen bg-astral-dark text-astral-light p-4 sm:p-8 flex flex-col items-center">
      <header className="mb-10 text-center max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-esoteric-purple filter drop-shadow-[0_0_5px_rgba(126,87,194,0.8)] mb-3">
          The Veil is Lifted
        </h1>
        <p className="text-lg text-astral-light/80 italic">
          Regarding your query: &quot;{question}&quot;
        </p>
      </header>

      <main className="w-full max-w-5xl bg-astral-bg shadow-2xl shadow-esoteric-purple/30 rounded-lg p-6 sm:p-8 ring-1 ring-esoteric-purple/50">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-starlight-gold mb-4 text-center">
            Your Reading: {spread.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-6 place-items-center">
            {drawnCards.map((spreadCard, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <h3 className="text-sm font-semibold text-cosmic-blue mb-1 truncate w-full px-1">
                  {spread.card_positions[index]?.name || `Position ${index + 1}`}
                </h3>
                <CardThumbnail card={spreadCard.card} size="sm" /> 
                <p className="text-xs text-astral-light/70 mt-1">
                  {spreadCard.card.name} {spreadCard.is_reversed ? '(Reversed)' : '(Upright)'}
                </p>
                 <p className="text-xs text-astral-light/60 italic mt-0.5 px-1 line-clamp-2 h-8">
                  ({spread.card_positions[index]?.description})
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 pt-6 border-t border-esoteric-purple/30 prose-tarot max-w-none">
          <h2 className="text-3xl font-bold mb-4 text-starlight-gold text-center">The Oracle&apos;s Message:</h2>
          <div
            className="whitespace-pre-wrap text-astral-light/90 text-md leading-relaxed bg-shadow-blue/30 p-4 sm:p-6 rounded-md ring-1 ring-cosmic-blue/30"
            dangerouslySetInnerHTML={{ __html: interpretation.replace(/\n/g, '<br />') }}
          ></div>
        </section>

        <div className="mt-10 pt-6 border-t border-esoteric-purple/30 text-center space-x-4">
          <button 
            onClick={onAdjustCards}
            className="bg-cosmic-blue hover:bg-opacity-80 text-astral-light font-semibold py-2 px-6 rounded-md shadow-md hover:shadow-cosmic-blue/40 transition-all duration-200"
          >
            Adjust Cards/Question
          </button>
          <button 
            onClick={onStartOver}
            className="bg-esoteric-purple hover:bg-opacity-80 text-white font-semibold py-2 px-6 rounded-md shadow-md hover:shadow-esoteric-purple/40 transition-all duration-200"
          >
            Begin Anew (Start Over)
          </button>
        </div>
      </main>

      <footer className="mt-16 mb-8 text-center text-xs text-astral-light/50">
        <p>May these insights guide your path. The stars shift, and so does understanding.</p>
      </footer>
    </div>
  );
} 