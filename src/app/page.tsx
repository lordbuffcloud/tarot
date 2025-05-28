'use client';

import { useState, FormEvent, Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeScreen from '../components/WelcomeScreen';
import AskQuestionScreen from '../components/AskQuestionScreen';
import SetIntentScreen from '../components/SetIntentScreen';
import SpreadSelectionScreen from '../components/SpreadSelectionScreen';
import CardInputScreen from '../components/CardInputScreen';
import InterpretationScreen from '../components/InterpretationScreen';
import { getTarotInterpretationStream } from './actions/interpretAction';
import type { SpreadCard, InterpretationRequest, Card as FullCardType } from '../lib/tarot-types';
import type { TarotSpread } from '../lib/tarotSpreadTypes';
import { allCardsData } from '../lib/allCardsData';

const mysticWisdom = [
  "The threads of fate are ever-weaving...",
  "Listen closely to the whispers of the cosmos...",
  "Patience, seeker, the vision crystallizes...",
  "Ancient energies stir in response to your query...",
  "The Oracle gazes into the starlight for you...",
];

type ReadingStep = 
  'welcome' | 
  'ask_question' | 
  'set_intent' | 
  'spread_selection' | 
  'card_input' |
  'interpretation';

// Define DigitallySelectedCard structure (as it's used in this file's state and functions)
interface DigitallySelectedCard {
  card_id: string; 
  name: string;    
  is_reversed: boolean;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState<ReadingStep>('welcome');
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [chosenSpread, setChosenSpread] = useState<TarotSpread | null>(null);
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // requestDataForApi should now only expect selected_cards, matching updated InterpretationRequest
  const [requestDataForApi, setRequestDataForApi] = useState<Partial<InterpretationRequest>>({});
  const [currentMysticMessage, setCurrentMysticMessage] = useState('');

  const handleNextStep = (nextStep: ReadingStep) => {
    setCurrentStep(nextStep);
    if (nextStep !== 'interpretation' || error) {
        setInterpretation(null);
    }
    if (!(nextStep === 'interpretation' && error)) {
        setError(null);
    }
    if (nextStep === 'welcome') {
        setUserQuestion('');
        setChosenSpread(null);
        setInterpretation(null);
        setRequestDataForApi({});
        setCurrentMysticMessage('');
    }
    if (nextStep === 'interpretation' && isLoading) { 
      setCurrentMysticMessage(mysticWisdom[Math.floor(Math.random() * mysticWisdom.length)]);
    }
  };

  const handleQuestionSubmitted = (question: string) => {
    setUserQuestion(question);
    handleNextStep('set_intent');
  };

  const handleIntentSet = () => {
    handleNextStep('spread_selection');
  };

  const handleSpreadSelected = (spread: TarotSpread) => {
    setChosenSpread(spread);
    handleNextStep('card_input');
  };

  const handleReadingReadyForInterpretation = async (
    questionFromInput: string, 
    data: { selectedCards?: DigitallySelectedCard[] }
  ) => {
    setUserQuestion(questionFromInput); 
    
    handleNextStep('interpretation'); 
    setIsLoading(true);            
    setError(null);
    setInterpretation(null); 

    if (!questionFromInput.trim()) {
      setError('A question is required for interpretation.');
      setIsLoading(false); return;
    }
    if (!chosenSpread) {
      setError('No spread was selected. Critical error.');
      setIsLoading(false); return;
    }

    let apiRequestData: InterpretationRequest;

    if (data.selectedCards && data.selectedCards.length > 0) {
      apiRequestData = {
        question: questionFromInput,
        selected_cards: data.selectedCards.map(card => ({
          card_id: card.card_id, 
          name: card.name,
          is_reversed: card.is_reversed
        })),
      };
    } else {
      setError('No card input provided from CardInputScreen. Ensure cards are selected or drawn.');
      setIsLoading(false);
      return;
    }
    
    setRequestDataForApi({ question: apiRequestData.question, selected_cards: apiRequestData.selected_cards });

    console.log("Sending to API: Request data for interpretation:", {
      question: apiRequestData.question,
      selected_cards: apiRequestData.selected_cards
    });

    try {
      const result = await getTarotInterpretationStream(apiRequestData); 
      if (result.error) {
        setError(`Interpretation Error: ${result.error}${result.details ? ` - ${JSON.stringify(result.details)}` : ''}`);
      } else if (result.interpretation) {
        setInterpretation(result.interpretation); setError(null);
      } else {
        setError('Received an unexpected response structure from interpretation service.');
      }
    } catch (e: any) {
      setError(`Client-side communication error: ${e.message || 'Unknown error'}`);
      setIsLoading(false); 
    } finally {
      setIsLoading(false); 
    }
  }; 

  const knownSteps: ReadingStep[] = ['welcome', 'ask_question', 'set_intent', 'spread_selection', 'card_input', 'interpretation'];

  return (
    <AnimatePresence mode="wait">
      {currentStep === 'welcome' && (
        <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <WelcomeScreen onNext={() => handleNextStep('ask_question')} />
        </motion.div>
      )}

      {currentStep === 'ask_question' && (
        <motion.div key="ask_question" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <AskQuestionScreen 
            userQuestion={userQuestion} 
            setUserQuestion={setUserQuestion} 
            onQuestionSubmit={handleQuestionSubmitted} 
            onBack={() => handleNextStep('welcome')}
          />
        </motion.div>
      )}

      {currentStep === 'set_intent' && (
        <motion.div key="set_intent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <SetIntentScreen 
            userQuestion={userQuestion} 
            onIntentSet={handleIntentSet} 
            onBack={() => handleNextStep('ask_question')}
          />
        </motion.div>
      )}

      {currentStep === 'spread_selection' && (
        <motion.div key="spread_selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <SpreadSelectionScreen 
            onSelectSpread={handleSpreadSelected} 
            onBack={() => handleNextStep('set_intent')}
            userQuestion={userQuestion}
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
          {(!interpretation || !chosenSpread || error) && !isLoading ? (
            <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-8 flex flex-col items-center">
              <header className="mb-10 text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-purple-300 filter drop-shadow-[0_0_6px_rgba(192,132,252,0.7)]">
                  Reading Status
                </h1>
              </header>
              <main className="w-full max-w-4xl bg-slate-800/60 backdrop-blur-sm shadow-2xl shadow-purple-900/40 rounded-xl p-6 sm:p-8 ring-1 ring-purple-700/60">
                <p className="text-lg text-slate-300/90 mb-2">Current Step: {currentStep}</p>
                {chosenSpread && <p  className="text-md text-slate-300/80 mb-1">Chosen Spread: {chosenSpread.name}</p>}
                {userQuestion && <p  className="text-md text-slate-300/80 mb-4">Your Question: "{userQuestion}"</p>}
                
                <div className="my-6 space-x-4">
                    <button 
                        onClick={() => handleNextStep('welcome')}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-purple-500/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-800"
                    >
                        Start Over
                    </button>
                    <button 
                        onClick={() => handleNextStep('card_input')}
                        className="bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-sky-500/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-800"
                    >
                        Adjust Reading Focus
                    </button>
                </div>

                {error && (
                  <div className="mt-6 p-5 bg-red-800/70 border border-red-600 text-red-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-xl mb-2 text-red-100">An Unexpected Turn:</p>
                    <p className="text-md">{error}</p>
                  </div>
                )}
                {(!error && (!interpretation || !chosenSpread)) && 
                  <p className="text-slate-400 my-4 italic">Interpretation data is not yet available or a selection was missed.</p>
                }
              </main>
            </div>
          ) : (
            <InterpretationScreen 
              isLoading={isLoading}
              question={userQuestion} 
              spread={chosenSpread!} 
              drawnCards={(requestDataForApi.selected_cards || []).map((sc, index) => {
                const cardInfo = allCardsData.find(card => card.id === sc.card_id);
                const fullCard: FullCardType = {
                  id: sc.card_id,
                  name: sc.name,
                  image_path: cardInfo?.imagePath || '',
                  number: 0,
                  suit: 'Major Arcana',
                  arcana: 'Major',
                  meaning_up: '',
                  meaning_rev: '',
                };
                return {
                  card: fullCard,
                  is_reversed: sc.is_reversed,
                  position_name: chosenSpread?.card_positions[index]?.name || `Card ${index + 1}`
                };
              })}
              interpretation={interpretation || 'Waiting for the Oracle\'s wisdom...'} 
              onStartOver={() => handleNextStep('welcome')}
              onAdjustCards={() => handleNextStep('card_input')}
            />
          )}
        </motion.div>
      )}

      {!knownSteps.includes(currentStep) && (
         <motion.div key="fallback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="min-h-screen bg-mystic-dark text-mystic-text p-4 sm:p-8 flex flex-col items-center">
              <header className="mb-10 text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-astral-amethyst filter drop-shadow-[0_0_5px_rgba(106,13,173,0.8)]">
                  Astral Oracle (Status)
                </h1>
              </header>
              <main className="w-full max-w-4xl bg-midnight-ink shadow-2xl shadow-astral-amethyst/30 rounded-lg p-6 sm:p-8 ring-1 ring-astral-amethyst/50">
                <p>Current Step: {currentStep} (Lost in the Astral Plane!)</p>
                <p className="text-mystic-text-muted my-4">Navigating the astral currents... if you see this, something is adrift.</p>
                <div className="my-6">
                    <button onClick={() => handleNextStep('welcome')} className="bg-esoteric-indigo p-2 rounded">Return to Welcome</button>
                </div>
              </main>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

