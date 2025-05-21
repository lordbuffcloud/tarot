'use client';

import { useState, FormEvent } from 'react';
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
  if (currentStep === 'welcome') {
    return <WelcomeScreen onNext={() => handleNextStep('spread_selection')} />;
  }

  if (currentStep === 'spread_selection') {
    return <SpreadSelectionScreen 
              onSelectSpread={handleSpreadSelected} 
              onBack={() => handleNextStep('welcome')} 
           />;
  }
  
  if (currentStep === 'card_input') {
    if (!chosenSpread) {
        // This case should ideally not be reached if flow is correct
        // Redirect to spread selection or show error
        // For now, simple fallback:
        return (
            <div className="min-h-screen bg-astral-dark text-astral-light p-8 flex flex-col items-center justify-center">
                <p className="text-xl text-red-400 mb-4">Error: No spread selected.</p>
                <button onClick={() => handleNextStep('spread_selection')} className="bg-cosmic-blue p-3 rounded-md text-lg">
                    Please Select a Spread First
                </button>
            </div>
        );
    }
    return <CardInputScreen 
              chosenSpread={chosenSpread} 
              currentQuestion={userQuestion} // Pass initial question
              onReadingComplete={handleReadingReadyForInterpretation} 
              onBack={() => handleNextStep('spread_selection')} 
           />;
  }
  
  if (currentStep === 'interpretation') {
    // Ensure all necessary data is available before rendering InterpretationScreen
    // Loading and error states are handled within InterpretationScreen or globally by isLoading/error states displayed below
    if (isLoading) {
        // Show a full-page loading indicator for this critical step
        return (
            <div className="min-h-screen bg-astral-dark text-astral-light p-8 flex flex-col items-center justify-center">
                <svg className="animate-spin h-12 w-12 text-starlight-gold mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-xl text-starlight-gold">The Oracle is Conjuring Your Reading...</p>
            </div>
        );
    }
    if (error || !interpretation || !chosenSpread ) { // If error, or if data is missing (should not happen with error)
        // Fallback to a generic error/status display if interpretation isn't ready or critical data missing
        // This reuses the fallback view logic but could be a dedicated error component for interpretation step.
    } else {
        return <InterpretationScreen 
                question={userQuestion}
                spread={chosenSpread}
                drawnCards={finalDrawnCards}
                interpretation={interpretation}
                onStartOver={() => handleNextStep('welcome')}
                onAdjustCards={() => handleNextStep('card_input')} // Go back to card input
             />;
    }
  }

  // Fallback / Interim View (Mainly for errors if not caught by specific screens, or unexpected state)
  return (
    <div className="min-h-screen bg-astral-dark text-astral-light p-4 sm:p-8 flex flex-col items-center">
      <header className="mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-esoteric-purple filter drop-shadow-[0_0_5px_rgba(126,87,194,0.8)]">
          Astral Oracle (Status)
        </h1>
      </header>
      <main className="w-full max-w-4xl bg-astral-bg shadow-2xl shadow-esoteric-purple/30 rounded-lg p-6 sm:p-8 ring-1 ring-esoteric-purple/50">
        <p>Current Step: {currentStep}</p>
        {chosenSpread && <p>Chosen Spread: {chosenSpread.name}</p>}
        {userQuestion && <p>Your Question: &quot;{userQuestion}&quot;</p>}
        {finalDrawnCards.length > 0 && (
            <div className="my-4">
                <h4 className="text-cosmic-blue">Cards Submitted:</h4>
                <ul className="text-xs">
                    {finalDrawnCards.map(c => <li key={c.card.id + c.position_name}>{c.position_name}: {c.card.name} {c.is_reversed?'(R)':''}</li>)}
                </ul>
            </div>
        )}
        
        <div className="my-6 space-x-4">
            <button onClick={() => handleNextStep('welcome')} className="bg-esoteric-purple p-2 rounded">Start Over</button>
            {(currentStep === 'interpretation' || error) && 
             <button onClick={() => handleNextStep('card_input')} className="bg-cosmic-blue p-2 rounded">Adjust Cards/Question</button>
            }
        </div>

        {isLoading && <p className="text-starlight-gold text-lg my-4">Loading...</p>}
        {error && (
          <div className="mt-6 p-5 bg-red-900/50 border border-red-700 text-red-300 rounded-lg shadow-lg">
            <p className="font-semibold text-lg mb-1">An Unexpected Turn:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        {!isLoading && !error && currentStep !== 'interpretation' && (
            <p className="text-astral-light/70 my-4">Navigating the astral currents... if you see this, something is adrift.</p>
        )}
        {interpretation && currentStep === 'interpretation' && !error && (
            // This block is for the case where InterpretationScreen fails to render but we have data
            // Ideally, InterpretationScreen handles its own display fully.
             <div className="mt-6 p-6 bg-shadow-blue/70 border border-cosmic-blue/50 rounded-lg shadow-xl prose-tarot">
                <h2 className="text-2xl font-bold mb-3 text-starlight-gold">The Oracle Speaks (Fallback):</h2>
                <div
                  className="whitespace-pre-wrap text-astral-light/90 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: interpretation.replace(/\n/g, '<br />') }}
                ></div>
            </div>
        )}
      </main>
    </div>
  );
}

