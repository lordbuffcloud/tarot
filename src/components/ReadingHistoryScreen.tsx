'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getReadingHistory, deleteReading, clearReadingHistory, type SavedReading } from '../lib/readingHistory';
import CardThumbnail from './CardThumbnail';
import type { FullCardType } from '../lib/tarot-types';

interface ReadingHistoryScreenProps {
  onBack: () => void;
  onLoadReading?: (reading: SavedReading) => void;
}

export default function ReadingHistoryScreen({ onBack, onLoadReading }: ReadingHistoryScreenProps) {
  const [readings, setReadings] = useState<SavedReading[]>([]);
  const [selectedReading, setSelectedReading] = useState<SavedReading | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    setReadings(getReadingHistory());
  }, []);

  const handleDelete = (id: string) => {
    if (deleteReading(id)) {
      setReadings(getReadingHistory());
      setShowDeleteConfirm(null);
      if (selectedReading?.id === id) {
        setSelectedReading(null);
      }
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all reading history? This cannot be undone.')) {
      if (clearReadingHistory()) {
        setReadings([]);
        setSelectedReading(null);
      }
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-slate-100 p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-purple-300 filter drop-shadow-[0_0_6px_rgba(192,132,252,0.7)] mb-4">
            Reading History
          </h1>
          <p className="text-lg text-slate-300/90">
            Revisit your past journeys through the cards
          </p>
        </header>

        {readings.length === 0 ? (
          <motion.div
            className="text-center py-16 bg-slate-800/60 backdrop-blur-sm rounded-xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xl text-slate-400 mb-4">No readings saved yet</p>
            <p className="text-slate-500 mb-6">Your tarot readings will appear here once you complete them.</p>
            <button
              onClick={onBack}
              className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-purple-500/40 transition-all duration-200"
            >
              Begin a New Reading
            </button>
          </motion.div>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <p className="text-slate-300">
                {readings.length} {readings.length === 1 ? 'reading' : 'readings'} saved
              </p>
              <button
                onClick={handleClearAll}
                className="text-red-400 hover:text-red-300 text-sm underline transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Reading List */}
              <div className="space-y-4">
                <AnimatePresence>
                  {readings.map((reading) => (
                    <motion.div
                      key={reading.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                        selectedReading?.id === reading.id
                          ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/40'
                          : 'hover:bg-slate-800/80 hover:shadow-lg'
                      }`}
                      onClick={() => setSelectedReading(reading)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-purple-300 line-clamp-2">
                          {reading.question}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(showDeleteConfirm === reading.id ? null : reading.id);
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors ml-2 flex-shrink-0"
                          aria-label="Delete reading"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">
                        {reading.spread.name} • {formatDate(reading.timestamp)}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {reading.cards.slice(0, 3).map((spreadCard, idx) => (
                          <div key={idx} className="w-12 h-16 relative">
                            <CardThumbnail card={spreadCard.card} size="xs" />
                          </div>
                        ))}
                        {reading.cards.length > 3 && (
                          <div className="w-12 h-16 bg-slate-700/50 rounded flex items-center justify-center text-xs text-slate-400">
                            +{reading.cards.length - 3}
                          </div>
                        )}
                      </div>
                      {showDeleteConfirm === reading.id && (
                        <div className="mt-3 p-2 bg-red-900/30 border border-red-700/50 rounded flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(reading.id);
                            }}
                            className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm py-1 px-2 rounded transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDeleteConfirm(null);
                            }}
                            className="flex-1 bg-slate-600 hover:bg-slate-500 text-white text-sm py-1 px-2 rounded transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Reading Detail */}
              <div className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:overflow-y-auto">
                {selectedReading ? (
                  <motion.div
                    key={selectedReading.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 shadow-2xl"
                  >
                    <h2 className="text-2xl font-bold text-purple-300 mb-4">
                      {selectedReading.question}
                    </h2>
                    <p className="text-sm text-slate-400 mb-4">
                      {selectedReading.spread.name} • {formatDate(selectedReading.timestamp)}
                    </p>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-sky-300 mb-3">Cards Drawn</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {selectedReading.cards.map((spreadCard, idx) => (
                          <div key={idx} className="text-center">
                            <div className="mb-2">
                              <CardThumbnail card={spreadCard.card} size="sm" />
                            </div>
                            <p className="text-xs text-slate-300 font-semibold">
                              {spreadCard.position_name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {spreadCard.card.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {spreadCard.is_reversed ? 'Reversed' : 'Upright'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-purple-300 mb-3">Interpretation</h3>
                      <div
                        className="text-slate-200 text-sm leading-relaxed bg-slate-900/70 p-4 rounded-lg prose prose-sm prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: selectedReading.interpretation.replace(/\n/g, '<br />') }}
                      />
                    </div>

                    {onLoadReading && (
                      <button
                        onClick={() => onLoadReading(selectedReading)}
                        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-purple-500/40 transition-all duration-200"
                      >
                        View Full Reading
                      </button>
                    )}
                  </motion.div>
                ) : (
                  <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-8 text-center text-slate-400">
                    <p>Select a reading to view details</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={onBack}
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200"
          >
            ← Back
          </button>
        </div>
      </div>
    </motion.div>
  );
}

