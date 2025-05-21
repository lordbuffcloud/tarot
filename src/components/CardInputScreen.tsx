'use client';

import { useState, useEffect } from 'react';
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

  if (!chosenSpread) return <p>Loading spread information...</p>; // Should not happen if flow is right

  return (
    <div className="min-h-screen bg-astral-dark text-astral-light p-4 sm:p-8 flex flex-col items-center">
      <header className="mb-8 text-center max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-esoteric-purple filter drop-shadow-[0_0_5px_rgba(126,87,194,0.8)] mb-3">
          {chosenSpread.name}
        </h1>
        <p className="text-md text-astral-light/80 italic mb-1">Your Question: &quot;{question}&quot;</p>
        {/* Optional: Allow editing question here */} 
        {/* <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} className="..." /> */}
      </header>

      <main className="w-full max-w-3xl bg-astral-bg shadow-2xl shadow-esoteric-purple/30 rounded-lg p-6 sm:p-8 ring-1 ring-esoteric-purple/50">
        {currentPosition && drawnSpreadCards.length < chosenSpread.card_positions.length ? (
          <div className="space-y-6">
            <div className="text-center p-4 border border-cosmic-blue/50 rounded-lg bg-shadow-blue/50">
              <h2 className="text-xl font-semibold text-starlight-gold mb-1">
                Position {currentPositionIndex + 1}: {currentPosition.name}
              </h2>
              <p className="text-sm text-astral-light/70 italic">
                ({currentPosition.description})
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-astral-light/80 mb-2">
                Select the card you physically drew for this position:
              </label>
              <CardPicker
                allCards={allCardsForPicker}
                selectedCards={currentlySelectedCard ? [currentlySelectedCard] : []}
                setSelectedCards={(cards) => setCurrentlySelectedCard(cards[0] || null)}
                limit={1} // Only allow one card for this picker instance
                placeholder={`Choose card for ${currentPosition.name}...`}
              />
            </div>

            <div className="flex items-center justify-center space-x-3 my-4">
              <label htmlFor="isReversedToggle" className="text-sm text-astral-light/80">
                Is the card reversed?
              </label>
              <button 
                id="isReversedToggle"
                onClick={() => setIsCurrentCardReversed(!isCurrentCardReversed)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${isCurrentCardReversed 
                    ? 'bg-starlight-gold text-astral-dark ring-2 ring-starlight-gold' 
                    : 'bg-shadow-blue hover:bg-esoteric-purple/70 text-astral-light ring-1 ring-astral-light/30'}
                `}
              >
                {isCurrentCardReversed ? 'Yes, Reversed' : 'No, Upright'}
              </button>
            </div>

            <button
              onClick={handleAddCardToSpread}
              disabled={!currentlySelectedCard}
              className="w-full bg-esoteric-purple hover:bg-starlight-gold hover:text-astral-dark text-white font-semibold py-3 px-6 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-astral-bg focus:ring-starlight-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Confirm Card for Position {currentPositionIndex + 1}
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg text-starlight-gold">All cards for the spread have been recorded.</p>
            {/* This part is implicitly handled by onReadingComplete navigating away */}
          </div>
        )}

        {/* Display confirmed cards so far */}
        {drawnSpreadCards.length > 0 && (
          <div className="mt-8 pt-6 border-t border-esoteric-purple/30">
            <h3 className="text-lg font-semibold text-cosmic-blue mb-3 text-center">Your Drawn Cards:</h3>
            <ul className="space-y-2 text-sm">
              {drawnSpreadCards.map((sc, index) => (
                <li key={index} className="p-2 bg-shadow-blue/30 rounded-md ring-1 ring-astral-light/10">
                  <strong>{sc.position_name}:</strong> {sc.card.name} {sc.is_reversed ? '(Reversed)' : '(Upright)'}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      <footer className="mt-12 text-center">
        <button 
          onClick={onBack}
          className="text-astral-light/70 hover:text-starlight-gold underline transition-colors duration-200"
        >
          &larr; Back to Spread Selection
        </button>
      </footer>
    </div>
  );
} 