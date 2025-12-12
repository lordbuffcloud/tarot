'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import type { TarotSpread } from '@/lib/tarotSpreadTypes';
// REMOVE: import Image from 'next/image'; // For image preview
import { allCardsData, type TarotCardInfo } from '@/lib/allCardsData'; // Import card data
import CardThumbnail from './CardThumbnail'; // Import CardThumbnail
import type { FullCardType } from '@/lib/tarot-types'; // Import FullCardType

// Define the structure for a selected card (for digital selection)
interface DigitallySelectedCard {
  card_id: string; // e.g., "major_0", "wands_ace"
  name: string;    // e.g., "The Fool", "Ace of Wands"
  imagePath?: string; // Store imagePath for display on workbench
  is_reversed: boolean;
  slotId?: string; // To map selected card to a workbench slot
}

interface CardInputScreenProps {
  chosenSpread: TarotSpread;
  currentQuestion: string;
  // Update onReadingComplete to handle only digital cards
  onReadingComplete: (question: string, data: { selectedCards?: DigitallySelectedCard[] }) => void; 
  onBack: () => void;
}

// REMOVE 'image' mode
type InputMode = 'digital_select' | 'app_draw';

export default function CardInputScreen({ 
  chosenSpread, 
  currentQuestion,
  onReadingComplete, 
  onBack 
}: CardInputScreenProps) {
  const [question, setQuestion] = useState(currentQuestion);
  // Default to digital_select
  const [inputMode, setInputMode] = useState<InputMode>('digital_select'); 

  
  // States for digital card selection
  const [digitallySelectedCards, setDigitallySelectedCards] = useState<DigitallySelectedCard[]>([]);
  const [activeCardForPlacement, setActiveCardForPlacement] = useState<TarotCardInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setQuestion(currentQuestion);
    setDigitallySelectedCards([]);
    setActiveCardForPlacement(null);
    setError(null);
  }, [chosenSpread, currentQuestion]);

  const generateAppDrawnCards = (): DigitallySelectedCard[] => {
    if (!allCardsData || allCardsData.length === 0) {
      console.error("Error: allCardsData is empty or unavailable.");
      setError("Card data is missing. Cannot draw cards.");
      return [];
    }
    if (!chosenSpread || !chosenSpread.card_positions || chosenSpread.card_positions.length === 0) {
      console.error("Error: chosenSpread has no card positions defined.");
      setError("Spread information is incomplete. Cannot draw cards.");
      return [];
    }

    const numberOfCardsToDraw = chosenSpread.card_positions.length;
    const availableCards = [...allCardsData];
    const drawnCards: DigitallySelectedCard[] = [];

    if (availableCards.length < numberOfCardsToDraw) {
      console.error("Error: Not enough unique cards in allCardsData to draw for the spread.");
      setError("Not enough unique cards available to draw for this spread.");
      return []; // Not enough unique cards
    }

    for (let i = 0; i < numberOfCardsToDraw; i++) {
      // No need to check availableCards.length === 0 here due to the check above
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      const cardInfo = availableCards.splice(randomIndex, 1)[0];
      if (!cardInfo || !cardInfo.id || !cardInfo.name) {
        console.error("Error: Drawn card has missing id or name.", cardInfo);
        // Skip this card and try to continue, or handle error more gracefully
        // For now, let it proceed and potentially fail validation later if critical fields are missing for API
      }
      drawnCards.push({
        card_id: cardInfo.id,
        name: cardInfo.name,
        imagePath: cardInfo.imagePath,
        is_reversed: Math.random() < 0.5
      });
    }
    return drawnCards;
  };

  const handleSubmitReading = () => {
    if (!question.trim()) {
      setError('A question must guide the stars. Please enter your query.');
      return;
    }
    setError(null);

    if (inputMode === 'digital_select') {
      if (digitallySelectedCards.length !== chosenSpread.card_positions.length) {
        setError(`Please select all ${chosenSpread.card_positions.length} cards for the ${chosenSpread.name} spread.`);
        return;
      }
      if (digitallySelectedCards.some(card => !card.card_id || !card.name)) {
        setError('Some selected cards are missing details. Please reselect.');
        return;
      }
      onReadingComplete(question, { selectedCards: digitallySelectedCards });
    } else { // inputMode === 'app_draw'
      const appDrawn = generateAppDrawnCards();
      if (appDrawn.length === 0) {
        // setError was likely already set by generateAppDrawnCards if it returned empty
        // But ensure there is an error if it wasn't set for some reason.
        if (!error) setError("Failed to draw cards for the application. Please try again or select another mode.");
        return;
      }
      if (appDrawn.length !== chosenSpread.card_positions.length) {
        setError(`The application could not draw the required ${chosenSpread.card_positions.length} cards. Drew ${appDrawn.length} instead. Please try again.`);
        return;
      }
      // Ensure critical fields are present for the API call for each drawn card
      if (appDrawn.some(card => !card.card_id || !card.name)) {
        setError("Some cards drawn by the app are missing details. Please try again.");
        return;
      }
      onReadingComplete(question, { selectedCards: appDrawn });
    }
  };

  // Click handler for cards in the source list
  const handleSourceCardClick = (card: TarotCardInfo) => {
    if (digitallySelectedCards.length < chosenSpread.card_positions.length) {
      setActiveCardForPlacement(card);
      setError(null); // Clear previous errors
    } else {
      setError(`All ${chosenSpread.card_positions.length} card positions are filled.`);
    }
  };

  // Click handler for slots on the workbench
  const handleSlotClick = (slotId: string, slotName?: string) => {
    if (!activeCardForPlacement) {
      // If a card is already in the slot, maybe allow toggling reversal or removing it?
      const existingCardInSlot = digitallySelectedCards.find(c => c.slotId === slotId);
      if (existingCardInSlot) {
        // Toggle reversal for now
        setDigitallySelectedCards(prev => 
          prev.map(c => c.slotId === slotId ? { ...c, is_reversed: !c.is_reversed } : c)
        );
      } else {
        setError("Select a card from the deck first to place it.");
      }
      return;
    }

    // Check if card is already selected (by id)
    if (digitallySelectedCards.some(c => c.card_id === activeCardForPlacement.id)) {
      setError(`"${activeCardForPlacement.name}" is already in your spread. Choose a different card.`);
      setActiveCardForPlacement(null); // Clear active card to force re-selection from source
      return;
    }
    
    // Check if slot is already filled
    if (digitallySelectedCards.some(c => c.slotId === slotId)){
      setError(`Slot "${slotName || slotId}" is already filled. Click the card in the slot to change it, or choose an empty slot.`);
      return;
    }

    if (digitallySelectedCards.length < chosenSpread.card_positions.length) {
      setDigitallySelectedCards(prev => [
        ...prev,
        {
          card_id: activeCardForPlacement.id,
          name: activeCardForPlacement.name,
          imagePath: activeCardForPlacement.imagePath,
          is_reversed: false, // Default to upright
          slotId: slotId
        }
      ]);
      setActiveCardForPlacement(null); // Clear after placement
      setError(null);
    } else {
      setError("All card positions are filled.");
    }
  };
  
  // Function to remove a card from a slot or from the selection
  const handleRemoveCard = (cardIdToRemove: string) => {
    setDigitallySelectedCards(prev => prev.filter(c => c.card_id !== cardIdToRemove));
    // If active card was the one removed, clear it (though not strictly necessary with current flow)
    if (activeCardForPlacement && activeCardForPlacement.id === cardIdToRemove) {
      setActiveCardForPlacement(null);
    }
  };

  if (!chosenSpread) {
    return (
      <div className="min-h-screen bg-mystic-dark text-mystic-text p-8 flex flex-col items-center justify-center">
        <p className="text-xl text-red-400 mb-4">The threads of fate are tangled. No spread chosen. Please return.</p>
        <button onClick={onBack} className="text-mystic-text/70 hover:text-starlight-gold underline transition-colors duration-200">
          &larr; Reconsult the Constellations
        </button>
      </div>
    );
  }


  const renderDigitalSelectionUI = () => {
    const remainingCardsInDeck = allCardsData.filter(
      (deckCard) => !digitallySelectedCards.some(selectedCard => selectedCard.card_id === deckCard.id)
    );

    return (
      <div className="space-y-8 w-full">
        {/* Instructions */}
        <div className="text-center p-4 bg-slate-800/50 rounded-lg shadow-md border border-purple-700/30">
          <h2 className="text-2xl font-semibold text-purple-300 mb-2 filter drop-shadow-[0_0_4px_rgba(192,132,252,0.5)]">
            Craft Your Constellation
          </h2>
          <p className="text-slate-300 text-sm">
            Select <strong className="text-sky-300">{chosenSpread.card_positions.length} cards</strong> for your <strong className="text-sky-300">{chosenSpread.name}</strong> spread.
          </p>
          <p className="text-slate-400 text-xs mt-1">
            Click a card from the deck, then an empty slot. Click a placed card to toggle its orientation.
          </p>
          {activeCardForPlacement && (
            <p className="text-sky-200 mt-2 text-sm p-2 bg-sky-700/30 rounded-md">
              Selected for placement: <strong className="font-bold">{activeCardForPlacement.name}</strong>. Click an empty slot on the workbench.
            </p>
          )}
        </div>

        {/* The Deck of available cards */}
        <div className="p-4 bg-slate-800/50 rounded-lg shadow-inner border border-purple-700/30">
          <h3 className="text-xl font-semibold text-center text-sky-200 mb-4 filter drop-shadow-[0_0_3px_rgba(125,211,252,0.4)]">
            The Deck <span className="text-sm text-slate-400">({remainingCardsInDeck.length} left)</span>
          </h3>
          {remainingCardsInDeck.length === 0 && digitallySelectedCards.length === chosenSpread.card_positions.length && (
             <p className="text-center text-slate-400 py-4">All cards for your spread have been chosen from the deck.</p>
          )}
          <div className="max-h-96 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 p-2 bg-slate-900/30 rounded scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-slate-700">
            {remainingCardsInDeck.map((cardInfo) => {
              // Map TarotCardInfo to FullCardType before passing to CardThumbnail
              const cardForThumbnail: FullCardType = {
                id: cardInfo.id,
                name: cardInfo.name,
                imagePath: cardInfo.imagePath, // Corrected from image_path
                // The following properties are not part of FullCardType (DetailedCardSchema)
                // number: 0, 
                // suit: 'Major Arcana', 
                // arcana: 'Major', 
                // meaning_up: '', 
                // meaning_rev: '', 
              };
              return (
                <motion.div
                  key={cardInfo.id}
                  layout // Enables animation when items are added/removed
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                  className="aspect-[2/3]" // Maintain aspect ratio for cards
                >
                  <CardThumbnail
                    card={cardForThumbnail}
                    size="md"
                    onClick={() => handleSourceCardClick(cardInfo)}
                    selected={activeCardForPlacement?.id === cardInfo.id}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Workbench - Spread Layout */}
        <div className="p-4 bg-slate-800/50 rounded-lg shadow-inner border border-purple-700/30">
          <h3 className="text-xl font-semibold text-center text-sky-200 mb-4 filter drop-shadow-[0_0_3px_rgba(125,211,252,0.4)]">
            {chosenSpread.name} 
            <span className="text-sm text-slate-400"> ({digitallySelectedCards.filter(c => c.slotId).length} / {chosenSpread.card_positions.length} cards)</span>
          </h3>
          <div 
            className={`grid gap-4 place-items-center ${
              chosenSpread.card_positions.length === 1 ? 'grid-cols-1' :
              chosenSpread.card_positions.length === 2 ? 'grid-cols-2' :
              chosenSpread.card_positions.length === 3 ? 'grid-cols-3' :
              chosenSpread.card_positions.length === 4 ? 'grid-cols-2 sm:grid-cols-4' :
              chosenSpread.card_positions.length === 5 ? 'grid-cols-3' : // Example: adjust as needed
              chosenSpread.card_positions.length <= 6 ? 'grid-cols-3' : 
              chosenSpread.card_positions.length <= 8 ? 'grid-cols-4' :
              chosenSpread.card_positions.length <= 10 ? 'grid-cols-5' : 
              'grid-cols-3 sm:grid-cols-4 md:grid-cols-5' // Default for larger spreads
            }`}
          >
            {chosenSpread.card_positions.map((position, index) => {
              const slotId = `slot-${index}`;
              const selectedCardInSlot = digitallySelectedCards.find(c => c.slotId === slotId);
              let cardForDisplay: FullCardType | undefined = undefined;
              if (selectedCardInSlot) {
                 const originalCardInfo = allCardsData.find(c => c.id === selectedCardInSlot.card_id);
                 if (originalCardInfo) {
                    cardForDisplay = {
                        id: originalCardInfo.id,
                        name: originalCardInfo.name,
                        imagePath: originalCardInfo.imagePath, // Corrected from image_path
                        // The following properties are not part of FullCardType (DetailedCardSchema)
                        // number: 0, suit: 'Major Arcana', arcana: 'Major', meaning_up: '', meaning_rev: '', 
                    };
                 }
              }

              return (
                <motion.div
                  key={slotId}
                  layout
                  className="w-full aspect-[2/3] p-1 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-purple-500/40 hover:border-sky-400 transition-colors text-center relative bg-slate-900/40 focus-within:ring-2 focus-within:ring-sky-400"
                  onClick={() => handleSlotClick(slotId, position.name)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSlotClick(slotId, position.name);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Place card in position: ${position.name}`}
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                >
                  {selectedCardInSlot && cardForDisplay ? (
                    <div className="w-full h-full relative">
                       <CardThumbnail 
                          card={cardForDisplay} 
                          size="md" 
                          // No onClick needed here as slot click handles interaction
                       />
                       <div 
                         className={`absolute top-1 right-1 px-1.5 py-0.5 text-xs font-bold rounded-full shadow ${
                           selectedCardInSlot.is_reversed 
                           ? 'bg-red-500 text-white' 
                           : 'bg-green-500 text-white'
                         }`}
                       >
                         {selectedCardInSlot.is_reversed ? 'R' : 'U'}
                       </div>
                       <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent slot click
                            handleRemoveCard(selectedCardInSlot.card_id);
                          }}
                          className="absolute bottom-1 right-1 bg-red-600 hover:bg-red-500 text-white p-1 rounded-full shadow-md text-xs"
                          aria-label="Remove card"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-slate-400 mb-1 truncate w-full px-1">{position.name || `Position ${index + 1}`}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500/60 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-xs text-slate-500">Empty Slot</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderAppDrawUI = () => (
    <div className="text-center p-4 border-2 border-dashed border-purple-500/60 rounded-lg bg-purple-900/30 shadow-inner mt-4">
      <h2 className="text-xl font-semibold text-purple-300 mb-2">
        Let the App Draw Your Cards
      </h2>
      <p className="text-sm text-mystic-text/80 mb-4">
        The application will randomly draw <strong className="text-purple-400">{chosenSpread.card_positions.length} cards</strong> for your <strong className="text-purple-400">{chosenSpread.name}</strong> spread, including their orientations.
      </p>
      <p className="text-xs text-mystic-text/70 italic mt-2">
        Click &quot;Unveil the Oracle&apos;s Wisdom&quot; below when ready.
      </p>
      {/* Display cards if they were just drawn by app for confirmation before submit? Maybe not needed as submit is one step. */}
    </div>
  );

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-slate-100 p-4 sm:p-6 flex flex-col items-center selection:bg-sky-500 selection:text-white"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="mb-6 text-center max-w-3xl w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-purple-300 filter drop-shadow-[0_0_6px_rgba(192,132,252,0.7)] mb-3">
          Present Your Vision: The {chosenSpread.name}
        </h1>
        <p className="text-md text-slate-300/80 italic mb-1">Your Guiding Question: &quot;{question}&quot;</p>
        <textarea 
          value={question} 
          onChange={(e) => setQuestion(e.target.value)} 
          placeholder="Refine your query to the cosmos..."
          rows={2}
          className="w-full mt-2 mb-4 p-3 bg-slate-800/70 border-2 border-purple-700/50 rounded-lg text-white placeholder:text-slate-400 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 shadow-lg transition-colors duration-300 ease-in-out"
        />
      </header>

      <div className="mb-6 flex flex-wrap justify-center gap-3 sm:gap-4">
        <button 
          onClick={() => setInputMode('digital_select')}
          className={`py-2 px-5 rounded-md font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${inputMode === 'digital_select' ? 'bg-sky-400 text-mystic-dark shadow-lg ring-sky-400/70' : 'bg-slate-700 text-sky-300 hover:bg-slate-600 ring-1 ring-slate-600'}`}
        >
          Select Cards
        </button>
              <button 
          onClick={() => setInputMode('app_draw')}
          className={`py-2 px-5 rounded-md font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${inputMode === 'app_draw' ? 'bg-purple-400 text-mystic-dark shadow-lg ring-purple-400/70' : 'bg-slate-700 text-purple-300 hover:bg-slate-600 ring-1 ring-slate-600'}`}
        >
          App Draws Cards
              </button>
            </div>

      <main className="w-full max-w-5xl xl:max-w-6xl bg-slate-800/50 shadow-2xl shadow-purple-900/40 rounded-xl p-4 sm:p-6 ring-1 ring-purple-700/60">
        <div className="space-y-6">
          {inputMode === 'digital_select' ? renderDigitalSelectionUI() : renderAppDrawUI()}

          {error && (
            <motion.div 
              className="p-3 bg-red-700/70 border border-red-500 text-red-100 rounded-md text-sm text-center shadow-lg"
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            >
              {error}
          </motion.div>
          )}

          <button
            onClick={handleSubmitReading}
            disabled={
              (inputMode === 'digital_select' && (digitallySelectedCards.length !== chosenSpread.card_positions.length || !question.trim())) ||
              (inputMode === 'app_draw' && !question.trim())
            }
            aria-label="Submit reading for interpretation"
            className="w-full bg-gradient-to-r from-purple-500 to-sky-500 hover:from-purple-600 hover:to-sky-600 text-white font-bold py-4 px-6 rounded-lg shadow-xl hover:shadow-purple-500/40 focus:outline-none focus:ring-4 focus:ring-purple-400/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out text-lg filter hover:brightness-110 disabled:filter-none transform hover:scale-102 disabled:scale-100"
          >
            Unveil the Oracle&apos;s Wisdom
          </button>
          </div>
      </main>

      <footer className="mt-10 text-center">
        <button 
          onClick={onBack}
          className="text-slate-400 hover:text-sky-300 underline transition-colors duration-200 text-sm"
        >
          &larr; Reconsider Constellations
        </button>
      </footer>
    </motion.div>
  );
} 