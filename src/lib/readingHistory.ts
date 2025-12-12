/**
 * Reading history management using localStorage
 */

import type { SpreadCard } from './tarot-types';
import type { TarotSpread } from './tarotSpreadTypes';

export interface SavedReading {
  id: string;
  timestamp: number;
  question: string;
  spread: TarotSpread;
  cards: SpreadCard[];
  interpretation: string;
}

const STORAGE_KEY = 'astral-oracle-readings';
const MAX_READINGS = 50; // Limit stored readings

export function saveReading(reading: Omit<SavedReading, 'id' | 'timestamp'>): SavedReading {
  const savedReading: SavedReading = {
    ...reading,
    id: `reading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
  };

  const readings = getReadingHistory();
  readings.unshift(savedReading); // Add to beginning
  
  // Keep only the most recent readings
  const limitedReadings = readings.slice(0, MAX_READINGS);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedReadings));
  } catch (error) {
    console.error('Failed to save reading to localStorage:', error);
    // If storage is full, try to remove oldest readings
    if (error instanceof DOMException && error.code === 22) {
      const reducedReadings = limitedReadings.slice(0, Math.floor(MAX_READINGS / 2));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reducedReadings));
      } catch (retryError) {
        console.error('Failed to save reading after cleanup:', retryError);
      }
    }
  }

  return savedReading;
}

export function getReadingHistory(): SavedReading[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as SavedReading[];
  } catch (error) {
    console.error('Failed to read reading history from localStorage:', error);
    return [];
  }
}

export function getReadingById(id: string): SavedReading | null {
  const readings = getReadingHistory();
  return readings.find(r => r.id === id) || null;
}

export function deleteReading(id: string): boolean {
  const readings = getReadingHistory();
  const filtered = readings.filter(r => r.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete reading from localStorage:', error);
    return false;
  }
}

export function clearReadingHistory(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear reading history:', error);
    return false;
  }
}

