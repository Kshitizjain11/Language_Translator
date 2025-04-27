'use client';

import React, { useState, useEffect } from 'react';
import { FaBook, FaCheck, FaTimes, FaRedo, FaGamepad } from 'react-icons/fa';
import HangmanGame from './HangmanGame';

interface VocabWord {
  id: string;
  word: string;
  translation: string;
  category: string;
  lastReviewed: Date;
  nextReview: Date;
  difficulty: number; // 1-5, where 1 is easiest
}

interface VocabularyResponse {
  words: VocabWord[];
}

export default function VocabularyTrainer({ userId }: { userId: string }) {
  const [words, setWords] = useState<VocabWord[]>([]);
  const [currentWord, setCurrentWord] = useState<VocabWord | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [showHangman, setShowHangman] = useState(false);
  const [progressRefreshKey, setProgressRefreshKey] = useState(0);

  useEffect(() => {
    fetchVocabulary();
  }, [userId, selectedCategory]);

  const fetchVocabulary = async () => {
    try {
      const response = await fetch(`/api/learning/vocabulary?userId=${userId}&category=${selectedCategory}`);
      const data: VocabularyResponse = await response.json();
      setWords(data.words);
      const uniqueCategories = Array.from(new Set(data.words.map((w: VocabWord) => w.category)));
      setCategories(['all', ...uniqueCategories]);
      selectNextWord(data.words);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
      setLoading(false);
    }
  };

  const selectNextWord = (wordList: VocabWord[]) => {
    const now = new Date();
    const dueWords = wordList.filter(w => new Date(w.nextReview) <= now);
    if (dueWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * dueWords.length);
      setCurrentWord(dueWords[randomIndex]);
    } else {
      setCurrentWord(null);
    }
  };

  const handleDifficultyResponse = async (difficulty: number) => {
    if (!currentWord) return;

    const updatedWord = {
      ...currentWord,
      lastReviewed: new Date(),
      nextReview: calculateNextReview(difficulty),
      difficulty: difficulty
    };

    try {
      await fetch(`/api/learning/vocabulary/${currentWord.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedWord)
      });

      // Update progress when word is learned
      if (difficulty >= 4) { // Consider word learned if difficulty is high
        await updateProgress(currentWord.word, true);
      }

      setWords(words.map(w => w.id === currentWord.id ? updatedWord : w));
      selectNextWord(words);
      setShowTranslation(false);
    } catch (error) {
      console.error('Error updating word:', error);
    }
  };

  const updateProgress = async (word: string, isMastered: boolean) => {
    try {
      const response = await fetch('/api/learning/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user123', // Replace with actual user ID
          word,
          isMastered,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const calculateNextReview = (difficulty: number): Date => {
    const now = new Date();
    const daysToAdd = difficulty === 1 ? 1 : difficulty === 2 ? 3 : 7;
    return new Date(now.setDate(now.getDate() + daysToAdd));
  };

  const handleGameComplete = async (score: number) => {
    if (currentWord) {
      const difficulty = Math.min(Math.floor(score / 50) + 1, 5);
      await handleDifficultyResponse(difficulty);
    }
  };

  // Call this after hangman progress update
  const handleProgressUpdate = () => {
    setProgressRefreshKey((k) => k + 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  if (showHangman) {
    return (
      <div>
        <button
          onClick={() => setShowHangman(false)}
          className="mb-4 p-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          Back to Vocabulary
        </button>
        <HangmanGame
          words={words.map(w => w.word)}
          onGameComplete={handleGameComplete}
          userId={userId}
          onProgressUpdate={handleProgressUpdate}
        />
      </div>
    );
  }

  if (!currentWord) {
    return (
      <HangmanGame
        words={words.map(w => w.word)}
        onGameComplete={handleGameComplete}
        userId={userId}
        onProgressUpdate={handleProgressUpdate}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 rounded border"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <button
          onClick={() => setShowHangman(true)}
          className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
        >
          <FaGamepad />
          Play Hangman
        </button>
      </div>

      {/* Word Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{currentWord.word}</h3>
        
        {!showTranslation ? (
          <button
            onClick={() => setShowTranslation(true)}
            className="bg-blue-500 dark:bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            Show Translation
          </button>
        ) : (
          <div className="space-y-6">
            <p className="text-xl text-gray-700 dark:text-gray-300">{currentWord.translation}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleDifficultyResponse(1)}
                className="bg-green-500 dark:bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-600 dark:hover:bg-green-700"
              >
                <FaCheck className="inline-block mr-2" />
                Easy
              </button>
              <button
                onClick={() => handleDifficultyResponse(3)}
                className="bg-yellow-500 dark:bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 dark:hover:bg-yellow-700"
              >
                Medium
              </button>
              <button
                onClick={() => handleDifficultyResponse(5)}
                className="bg-red-500 dark:bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-600 dark:hover:bg-red-700"
              >
                <FaTimes className="inline-block mr-2" />
                Hard
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Category: {currentWord.category}
        </div>
      </div>
    </div>
  );
} 