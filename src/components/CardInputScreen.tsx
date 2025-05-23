'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Card, SpreadCard } from '@/lib/tarot-types';
import type { TarotSpread, TarotCardPosition } from '@/lib/tarotSpreadTypes';
import CardPicker from '@/components/CardPicker';
import allCardsData from '../../data/tarot.json'; // All available cards

interface CardInputScreenProps {
  chosenSpread: TarotSpread;
  currentQuestion: string; // Pass the question to display it
  onReadingComplete: (drawnCards: SpreadCard[], question: string) => void;
  onBack: () => void;
}

const allCardsForPicker: Card[] = allCardsData as Card[];

export default function CardInputScreen({ 
  chosenSpread, 
  currentQuestion,
  onReadingComplete, 
  onBack 
}: CardInputScreenProps) {
  // State to hold the card selected for the current position being focused on
  const [currentlySelectedCard, setCurrentlySelectedCard] = useState<Card | null>(null);
  const [isCurrentCardReversed, setIsCurrentCardReversed] = useState(false);
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
  
  // Final list of cards drawn by the user for the spread
  const [drawnSpreadCards, setDrawnSpreadCards] = useState<SpreadCard[]>([]);

  // Store the question locally, allow editing if needed (optional feature)
  const [question, setQuestion] = useState(currentQuestion);

  const currentPosition = chosenSpread.card_positions[currentPositionIndex];

  const handleAddCardToSpread = () => {
    if (!currentlySelectedCard) {
      alert('Please select a card from the picker.'); // Simple alert, can be a modal/toast
      return;
    }

    const newSpreadCard: SpreadCard = {
      card: currentlySelectedCard,
      is_reversed: isCurrentCardReversed,
      position_name: currentPosition.name, // or currentPosition.id
    };

    const updatedDrawnCards = [...drawnSpreadCards, newSpreadCard];
    setDrawnSpreadCards(updatedDrawnCards);

    if (currentPositionIndex < chosenSpread.card_positions.length - 1) {
      setCurrentPositionIndex(currentPositionIndex + 1);
      setCurrentlySelectedCard(null); // Reset picker for next card
      setIsCurrentCardReversed(false); // Reset reversal toggle
    } else {
      // All cards for the spread have been entered
      onReadingComplete(updatedDrawnCards, question);
    }
  };
  
  // Effect to reset if the spread changes (e.g., user goes back and picks another)
  useEffect(() => {
    setDrawnSpreadCards([]);
    setCurrentPositionIndex(0);
    setCurrentlySelectedCard(null);
    setIsCurrentCardReversed(false);
  }, [chosenSpread]);

  if (!chosenSpread) {
    return (
      <div className="min-h-screen bg-mystic-dark text-mystic-text p-8 flex flex-col items-center justify-center">
        <p className="text-xl text-red-400 mb-4">Error: No spread selected. Returning to spread selection.</p>
        {/* Consider a more robust way to handle this, e.g., redirecting via onBack() or similar */}
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-mystic-dark text-mystic-text p-4 sm:p-8 flex flex-col items-center"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="mb-8 text-center max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-astral-amethyst filter drop-shadow-[0_0_5px_rgba(106,13,173,0.8)] mb-3">
          {chosenSpread.name}
        </h1>
        <p className="text-md text-mystic-text/80 italic mb-1">Your Question: &quot;{question}&quot;</p>
        {/* Optional: Allow editing question here */}
        <input 
          type="text" 
          value={question} 
          onChange={(e) => setQuestion(e.target.value)} 
          placeholder="Type your question for the tarot..."
          className="w-full mt-2 mb-4 p-3 bg-bg-card text-text-main border border-border-accent/50 rounded-md focus:ring-2 focus:ring-theme-light-gray focus:border-theme-light-gray outline-none transition-colors"
        />
      </header>

      <main className="w-full max-w-3xl bg-midnight-ink shadow-2xl shadow-astral-amethyst/30 rounded-lg p-6 sm:p-8 ring-1 ring-astral-amethyst/50">
        {currentPosition && drawnSpreadCards.length < chosenSpread.card_positions.length ? (
          <motion.div
            key={currentPositionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="text-center p-4 border border-ethereal-blue/50 rounded-lg bg-shadow-purple/50">
              <h2 className="text-xl font-semibold text-starlight-gold mb-1">
                Position {currentPositionIndex + 1}: {currentPosition.name}
              </h2>
              <p className="text-sm text-mystic-text/70 italic">
                ({currentPosition.description})
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-mystic-text/80 mb-2">
                Select the card you physically drew for this position:
              </label>
              <CardPicker
                allCards={allCardsForPicker}
                selectedCards={currentlySelectedCard ? [currentlySelectedCard] : []}
                setSelectedCards={(cards) => setCurrentlySelectedCard(cards[0] || null)}
                limit={1}
                placeholder={`Choose card for ${currentPosition.name}...`}
              />
            </div>

            <div className="flex items-center justify-center space-x-3 my-4">
              <label htmlFor="isReversedToggle" className="text-sm text-mystic-text/80">
                Is the card reversed?
              </label>
              <button 
                id="isReversedToggle"
                onClick={() => setIsCurrentCardReversed(!isCurrentCardReversed)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${isCurrentCardReversed 
                    ? 'bg-starlight-gold text-mystic-dark ring-2 ring-starlight-gold' 
                    : 'bg-shadow-purple hover:bg-esoteric-indigo/70 text-mystic-text ring-1 ring-mystic-text/30'}
                `}
              >
                {isCurrentCardReversed ? 'Yes, Reversed' : 'No, Upright'}
              </button>
            </div>

            <button
              onClick={handleAddCardToSpread}
              disabled={!currentlySelectedCard}
              className="w-full bg-astral-amethyst hover:bg-starlight-gold hover:text-mystic-dark text-white font-semibold py-3 px-6 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-mystic-dark focus:ring-starlight-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Confirm Card for Position {currentPositionIndex + 1}
            </button>
          </motion.div>
        ) : (
          <div className="text-center">
            <p className="text-lg text-starlight-gold">All cards for the spread have been recorded.</p>
            {/* This part is implicitly handled by onReadingComplete navigating away */}
          </div>
        )}

        {/* Display confirmed cards so far */}
        {drawnSpreadCards.length > 0 && (
          <div className="mt-8 pt-6 border-t border-astral-amethyst/30">
            <h3 className="text-lg font-semibold text-ethereal-blue mb-3 text-center">Your Drawn Cards:</h3>
            <ul className="space-y-2 text-sm">
              {drawnSpreadCards.map((sc, index) => (
                <li key={index} className="p-2 bg-shadow-purple/30 rounded-md ring-1 ring-mystic-text/10">
                  <strong className="text-starlight-gold">{sc.position_name}:</strong> {sc.card.name} {sc.is_reversed ? '(Reversed)' : '(Upright)'}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      <footer className="mt-12 text-center">
        <button 
          onClick={onBack}
          className="text-mystic-text/70 hover:text-starlight-gold underline transition-colors duration-200"
        >
          &larr; Back to Spread Selection
        </button>
      </footer>
    </motion.div>
  );
} 