'use client';

import React, { useState, useEffect } from 'react';
import { FaBook, FaCheck, FaTimes, FaRedo } from 'react-icons/fa';

interface VocabWord {
  id: string;
  word: string;
  translation: string;
  category: string;
  lastReviewed: Date;
  nextReview: Date;
  difficulty: number; // 1-5, where 1 is easiest
}

export default function VocabularyTrainer({ userId }: { userId: string }) {
  const [words, setWords] = useState<VocabWord[]>([]);
  const [currentWord, setCurrentWord] = useState<VocabWord | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVocabulary();
  }, [userId, selectedCategory]);

  const fetchVocabulary = async () => {
    try {
      // In a real app, this would fetch from your API
      const response = await fetch(`/api/learning/vocabulary?userId=${userId}&category=${selectedCategory}`);
      const data = await response.json();
      setWords(data.words);
      setCategories(['all', ...new Set(data.words.map((w: VocabWord) => w.category))]);
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

    const nextReview = calculateNextReview(difficulty);
    const updatedWord = {
      ...currentWord,
      difficulty,
      lastReviewed: new Date(),
      nextReview,
    };

    try {
      await fetch('/api/learning/vocabulary/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedWord),
      });

      setWords(prev => prev.map(w => 
        w.id === currentWord.id ? updatedWord : w
      ));
      setShowTranslation(false);
      selectNextWord(words);
    } catch (error) {
      console.error('Error updating word:', error);
    }
  };

  const calculateNextReview = (difficulty: number): Date => {
    const now = new Date();
    const days = Math.pow(2, difficulty - 1); // Exponential spacing based on difficulty
    return new Date(now.setDate(now.getDate() + days));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentWord) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-lg">
        <FaBook className="mx-auto h-12 w-12 text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">All Caught Up!</h2>
        <p className="text-gray-600 mb-6">
          No words due for review. Great job keeping up with your studies!
        </p>
        <button
          onClick={() => fetchVocabulary()}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <FaRedo className="inline-block mr-2" />
          Check Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Word Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">{currentWord.word}</h3>
        
        {!showTranslation ? (
          <button
            onClick={() => setShowTranslation(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Show Translation
          </button>
        ) : (
          <div className="space-y-6">
            <p className="text-xl text-gray-700">{currentWord.translation}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleDifficultyResponse(1)}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
              >
                <FaCheck className="inline-block mr-2" />
                Easy
              </button>
              <button
                onClick={() => handleDifficultyResponse(3)}
                className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600"
              >
                Medium
              </button>
              <button
                onClick={() => handleDifficultyResponse(5)}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
              >
                <FaTimes className="inline-block mr-2" />
                Hard
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-500">
          Category: {currentWord.category}
        </div>
      </div>
    </div>
  );
} 