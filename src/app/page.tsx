'use client';

import { motion, AnimatePresence } from 'framer-motion';
import WelcomeScreen from '../components/WelcomeScreen';
import AskQuestionScreen from '../components/AskQuestionScreen';
import SetIntentScreen from '../components/SetIntentScreen';
import SpreadSelectionScreen from '../components/SpreadSelectionScreen';
import CardInputScreen from '../components/CardInputScreen';
import InterpretationScreen from '../components/InterpretationScreen';
import ReadingHistoryScreen from '../components/ReadingHistoryScreen';
import { useTarotReading, type ReadingStep } from '../hooks/useTarotReading';
import { allCardsData } from '../lib/allCardsData';
import { type SavedReading } from '../lib/readingHistory';
import type { FullCardType } from '../lib/tarot-types';

export default function Home() {
  const {
    currentStep,
    userQuestion,
    setUserQuestion,
    chosenSpread,
    setChosenSpread,
    requestDataForApi,
    setRequestDataForApi,
    currentMysticMessage,
    interpretation,
    isAiLoading,
    aiError,
    setCompletion,
    handleNextStep,
    handleQuestionSubmitted,
    handleIntentSet,
    handleSpreadSelected,
    handleReadingReadyForInterpretation
  } = useTarotReading();

  const knownSteps: ReadingStep[] = ['welcome', 'ask_question', 'set_intent', 'spread_selection', 'card_input', 'interpretation'];

  return (
    <AnimatePresence mode="wait">
      {currentStep === 'welcome' && (
        <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <WelcomeScreen
            onNext={() => handleNextStep('ask_question')}
            onViewHistory={() => handleNextStep('history')}
          />
        </motion.div>
      )}

      {currentStep === 'history' && (
        <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <ReadingHistoryScreen
            onBack={() => handleNextStep('welcome')}
            onLoadReading={(reading: SavedReading) => {
              setUserQuestion(reading.question);
              setChosenSpread(reading.spread);
              // Set the interpretation manually for history view
              setCompletion(reading.interpretation);

              setRequestDataForApi({
                question: reading.question,
                selected_cards: reading.cards.map(c => ({
                  card_id: c.card.id,
                  name: c.card.name,
                  is_reversed: c.is_reversed,
                })),
              });
              handleNextStep('interpretation');
            }}
          />
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
          {/* Error State */}
          {aiError ? (
            <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-8 flex flex-col items-center">
              <header className="mb-10 text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-purple-300">
                  Reading Status
                </h1>
              </header>
              <main className="w-full max-w-4xl bg-slate-800/60 p-6 sm:p-8 rounded-xl ring-1 ring-purple-700/60">
                <div className="mt-6 p-5 bg-red-800/70 border border-red-600 text-red-200 rounded-lg shadow-lg">
                  <p className="font-semibold text-xl mb-2 text-red-100">An Unexpected Turn:</p>
                  <p className="text-md">{aiError.message || "Unknown error occurred"}</p>
                </div>
                <div className="my-6">
                  <button onClick={() => handleNextStep('welcome')} className="bg-purple-600 text-white px-4 py-2 rounded">Start Over</button>
                </div>
              </main>
            </div>
          ) : (
            <InterpretationScreen
              isLoading={isAiLoading}
              question={userQuestion}
              spread={chosenSpread!}
              drawnCards={(requestDataForApi.selected_cards || []).map((sc: any, index: number) => {
                const cardInfo = allCardsData.find(card => card.id === sc.card_id);
                const fullCard: FullCardType = {
                  id: sc.card_id,
                  name: sc.name,
                  imagePath: cardInfo?.imagePath || '',
                };
                return {
                  card: fullCard,
                  is_reversed: sc.is_reversed,
                  position_name: chosenSpread?.card_positions[index]?.name || `Card ${index + 1}`
                };
              })}
              interpretation={interpretation || currentMysticMessage || 'Waiting for the Oracle\'s wisdom...'}
              onStartOver={() => handleNextStep('welcome')}
              onAdjustCards={() => handleNextStep('card_input')}
            />
          )}
        </motion.div>
      )}

      {!knownSteps.includes(currentStep) && (
        <motion.div key="fallback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="min-h-screen bg-mystic-dark text-mystic-text p-4 sm:p-8 flex flex-col items-center">
            <p>Current Step: {currentStep} (Lost in the Astral Plane!)</p>
            <button onClick={() => handleNextStep('welcome')} className="bg-esoteric-indigo p-2 mt-4 rounded">Return to Welcome</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
