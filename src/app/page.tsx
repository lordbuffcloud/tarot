'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeScreen from '../components/WelcomeScreen';
import SpreadSelectionScreen from '../components/SpreadSelectionScreen';
import CardInputScreen from '../components/CardInputScreen';
import InterpretationScreen from '../components/InterpretationScreen';
import { getTarotInterpretationStream } from './actions/interpretAction';
import type { SpreadCard, InterpretationRequest, Card } from '../lib/tarot-types';
import type { TarotSpread } from '../lib/tarotSpreadTypes';
// import allCardsData from '../../data/tarot.json'; // No longer needed directly here

// Types for flow state
type ReadingStep = 'welcome' | 'spread_selection' | 'card_input' | 'interpretation';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<ReadingStep>('welcome');
  const [userQuestion, setUserQuestion] = useState<string>(''); // Store user's initial question
  const [finalDrawnCards, setFinalDrawnCards] = useState<SpreadCard[]>([]); 
  const [chosenSpread, setChosenSpread] = useState<TarotSpread | null>(null);
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleNextStep = (nextStep: ReadingStep) => {
    setCurrentStep(nextStep);
    // Only reset interpretation if not moving to interpretation or if an error occurred previously
    if (nextStep !== 'interpretation' || error) {
        setInterpretation(null);
    }
    // Always clear errors when navigating, except if we are specifically showing an error on interpretation screen
    if (!(nextStep === 'interpretation' && error)) {
        setError(null);
    }

    if (nextStep === 'welcome') {
        setUserQuestion('');
        setFinalDrawnCards([]);
        setChosenSpread(null);
        // Ensure interpretation is also cleared if going all the way back to welcome
        setInterpretation(null); 
    }
  };

  const handleSpreadSelected = (spread: TarotSpread) => {
    setChosenSpread(spread);
    // If question is not set, CardInputScreen will handle it.
    handleNextStep('card_input');
  };

  // This is now called by CardInputScreen when all data is ready
  const handleReadingReadyForInterpretation = async (drawnCards: SpreadCard[], question: string) => {
    setUserQuestion(question); // Update question from CardInputScreen if it was edited
    setFinalDrawnCards(drawnCards);
    setIsLoading(true);
    setError(null);
    setInterpretation(null);

    if (!question.trim()) {
      setError('A question is required for interpretation.');
      setIsLoading(false);
      return;
    }
    if (!chosenSpread) {
      setError('No spread was selected. Critical error.');
      setIsLoading(false);
      return;
    }
    if (drawnCards.length !== chosenSpread.card_positions.length) {
      setError(`Card data incomplete for ${chosenSpread.name}. Critical error.`);
      setIsLoading(false);
      return;
    }

    const requestData: InterpretationRequest = {
      question,
      spread_name: chosenSpread.name,
      cards: drawnCards,
    };

    try {
      const result = await getTarotInterpretationStream(requestData);
      if (result.error) {
        setError(`Interpretation Error: ${result.error}${result.details ? ` - ${JSON.stringify(result.details)}` : ''}`);
        handleNextStep('interpretation'); // Move to interpretation screen to show the error
      } else if (result.interpretation) {
        setInterpretation(result.interpretation);
        handleNextStep('interpretation');
      } else {
        setError('Received an unexpected response structure from interpretation service.');
        handleNextStep('interpretation'); // Also show this error on interpretation screen
      }
    } catch (e: any) {
      setError(`Client-side communication error: ${e.message || 'Unknown error'}`);
      handleNextStep('interpretation'); // And this one too
    } finally {
      setIsLoading(false);
    }
  };
  
  // Conditional Rendering Logic
  // Wrap the screen components with AnimatePresence for exit animations
  // and motion.div for enter/exit animations keyed by currentStep.
  return (
    <AnimatePresence mode="wait">
      {currentStep === 'welcome' && (
        <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <WelcomeScreen onNext={() => handleNextStep('spread_selection')} />
        </motion.div>
      )}

      {currentStep === 'spread_selection' && (
        <motion.div key="spread_selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <SpreadSelectionScreen 
            onSelectSpread={handleSpreadSelected} 
            onBack={() => handleNextStep('welcome')} 
          />
        </motion.div>
      )}
      
      {currentStep === 'card_input' && (
        <motion.div key="card_input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {!chosenSpread ? (
            <div className="min-h-screen bg-mystic-dark text-mystic-text p-8 flex flex-col items-center justify-center">
              <p className="text-xl text-red-400 mb-4">Error: No spread selected.</p>
              <button onClick={() => handleNextStep('spread_selection')} className="bg-esoteric-indigo p-3 rounded-md text-lg">
                  Please Select a Spread First
              </button>
            </div>
          ) : (
            <CardInputScreen 
              chosenSpread={chosenSpread} 
              currentQuestion={userQuestion}
              onReadingComplete={handleReadingReadyForInterpretation} 
              onBack={() => handleNextStep('spread_selection')} 
            />
          )}
        </motion.div>
      )}
      
      {currentStep === 'interpretation' && (
        <motion.div key="interpretation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {isLoading ? (
            <div className="min-h-screen bg-mystic-dark text-mystic-text p-8 flex flex-col items-center justify-center">
              <svg className="animate-spin h-12 w-12 text-starlight-gold mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-xl text-starlight-gold">The Oracle is Conjuring Your Reading...</p>
            </div>
          ) : error || !interpretation || !chosenSpread ? (
             // Fallback for error or missing data on interpretation screen, wrapped in motion.div
            <div className="min-h-screen bg-mystic-dark text-mystic-text p-4 sm:p-8 flex flex-col items-center">
              <header className="mb-10 text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-astral-amethyst filter drop-shadow-[0_0_5px_rgba(106,13,173,0.8)]">
                  Astral Oracle (Status)
                </h1>
              </header>
              <main className="w-full max-w-4xl bg-midnight-ink shadow-2xl shadow-astral-amethyst/30 rounded-lg p-6 sm:p-8 ring-1 ring-astral-amethyst/50">
                <p>Current Step: {currentStep}</p>
                {chosenSpread && <p>Chosen Spread: {chosenSpread.name}</p>}
                {userQuestion && <p>Your Question: &quot;{userQuestion}&quot;</p>}
                <div className="my-6 space-x-4">
                    <button onClick={() => handleNextStep('welcome')} className="bg-esoteric-indigo p-2 rounded">Start Over</button>
                    {(currentStep === 'interpretation' || error) && 
                     <button onClick={() => handleNextStep('card_input')} className="bg-ethereal-blue p-2 rounded text-mystic-dark">Adjust Cards/Question</button>
                    }
                </div>
                {error && (
                  <div className="mt-6 p-5 bg-red-900/50 border border-red-700 text-red-300 rounded-lg shadow-lg">
                    <p className="font-semibold text-lg mb-1">An Unexpected Turn:</p>
                    <p className="text-sm">{error}</p>
                  </div>
                )}
                {!error && <p className="text-mystic-text-muted my-4">Interpretation data is unavailable or an error occurred.</p>}
              </main>
            </div>
          ) : (
            <InterpretationScreen 
              question={userQuestion}
              spread={chosenSpread}
              drawnCards={finalDrawnCards}
              interpretation={interpretation}
              onStartOver={() => handleNextStep('welcome')}
              onAdjustCards={() => handleNextStep('card_input')}
            />
          )}
        </motion.div>
      )}

      {/* Fallback / Interim View if currentStep doesn't match known steps and is not handled above */}
      {!['welcome', 'spread_selection', 'card_input', 'interpretation'].includes(currentStep) && (
         <motion.div key="fallback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="min-h-screen bg-mystic-dark text-mystic-text p-4 sm:p-8 flex flex-col items-center">
              <header className="mb-10 text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-astral-amethyst filter drop-shadow-[0_0_5px_rgba(106,13,173,0.8)]">
                  Astral Oracle (Status)
                </h1>
              </header>
              <main className="w-full max-w-4xl bg-midnight-ink shadow-2xl shadow-astral-amethyst/30 rounded-lg p-6 sm:p-8 ring-1 ring-astral-amethyst/50">
                <p>Current Step: {currentStep}</p>
                <p className="text-mystic-text-muted my-4">Navigating the astral currents... if you see this, something is adrift.</p>
                <div className="my-6">
                    <button onClick={() => handleNextStep('welcome')} className="bg-esoteric-indigo p-2 rounded">Start Over</button>
                </div>
              </main>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

