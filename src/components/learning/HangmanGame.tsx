'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaSkull, FaRedo } from 'react-icons/fa';

interface HangmanGameProps {
  words: string[];
  onGameComplete: (score: number) => void;
  userId: string;
  onProgressUpdate?: () => void;
}

interface HighScore {
  score: number;
  date: string;
}

const DIFFICULTY_LEVELS = {
  easy: { lives: 8, wordLength: [4, 7] },
  medium: { lives: 6, wordLength: [6, 8] },
  hard: { lives: 5, wordLength: [7, 10] }
};

const HANGMAN_PARTS = [
  'head', 'body', 'left-arm', 'right-arm', 'left-leg', 'right-leg', 'rope', 'beam'
];

export default function HangmanGame({ words, onGameComplete, userId, onProgressUpdate }: HangmanGameProps) {
  const [selectedWord, setSelectedWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [lives, setLives] = useState(6);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [difficulty, setDifficulty] = useState<keyof typeof DIFFICULTY_LEVELS>('easy');
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [score, setScore] = useState(0);
  const [loadingWord, setLoadingWord] = useState(false);

  const fetchRandomWord = async (): Promise<string> => {
    setLoadingWord(true);
    let word = '';
    let tries = 0;
    const { wordLength } = DIFFICULTY_LEVELS[difficulty];
    while (tries < 10) {
      try {
        // Placeholder: Replace with your AI or random word API endpoint
        const response = await fetch('https://random-word-api.herokuapp.com/word?number=1');
        const data = await response.json();
        word = (Array.isArray(data) && data.length > 0) ? data[0] : '';
        if (word.length >= wordLength[0] && word.length <= wordLength[1]) {
          setLoadingWord(false);
          return word;
        }
      } catch (error) {
        // ignore and retry
      }
      tries++;
    }
    setLoadingWord(false);
    // fallback: return a default word of correct length
    return word.length >= wordLength[0] && word.length <= wordLength[1] ? word : (wordLength[0] === wordLength[1] ? 'planet' : 'planet');
  };

  const selectRandomWord = useCallback(async () => {
    const { wordLength } = DIFFICULTY_LEVELS[difficulty];
    let filteredWords = words.filter(word =>
      word.length >= wordLength[0] && word.length <= wordLength[1]
    );
    // Weighted selection for easy mode
    if (difficulty === 'easy') {
      let weighted: string[] = [];
      filteredWords.forEach(word => {
        if (word.length === 4) weighted.push(...Array(10).fill(word)); // 10x
        else if (word.length === 5) weighted.push(...Array(8).fill(word)); // 8x
        else if (word.length === 6) weighted.push(...Array(2).fill(word)); // 2x
        else if (word.length === 7) weighted.push(word, word); // 2x
        else weighted.push(word); // fallback
      });
      filteredWords = weighted;
    }
    if (filteredWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredWords.length);
      return filteredWords[randomIndex];
    } else if (words.length > 0) {
      return words[Math.floor(Math.random() * words.length)];
    } else {
      // Fetch from AI/external API
      const word = await fetchRandomWord();
      return word;
    }
  }, [words, difficulty]);

  useEffect(() => {
    const savedHighScores = localStorage.getItem('hangmanHighScores');
    if (savedHighScores) {
      setHighScores(JSON.parse(savedHighScores));
    }
  }, []);

  useEffect(() => {
    startNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const startNewGame = async () => {
    setGuessedLetters([]);
    setLives(DIFFICULTY_LEVELS[difficulty].lives);
    setGameStatus('playing');
    setScore(0);
    const word = await selectRandomWord();
    setSelectedWord(word);
  };

  const handleGuess = (letter: string) => {
    if (gameStatus !== 'playing' || guessedLetters.includes(letter)) return;

    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);

    if (!selectedWord.includes(letter)) {
      setLives(prev => prev - 1);
      if (lives - 1 === 0) {
        setGameStatus('lost');
        updateHighScores(score);
      }
    } else {
      setScore(prev => prev + 10);
      if (selectedWord.split('').every(l => newGuessedLetters.includes(l))) {
        setGameStatus('won');
        updateHighScores(score + 10);
        updateProgress(selectedWord, true);
      }
    }
  };

  const updateHighScores = (newScore: number) => {
    const newHighScores = [
      ...highScores,
      { score: newScore, date: new Date().toISOString() }
    ].sort((a, b) => b.score - a.score).slice(0, 10);
    
    setHighScores(newHighScores);
    localStorage.setItem('hangmanHighScores', JSON.stringify(newHighScores));
  };

  const updateProgress = async (word: string, isMastered: boolean) => {
    try {
      const response = await fetch('/api/learning/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          word,
          isMastered,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }

      const data = await response.json();
      console.log('Progress update response:', data);
      onGameComplete(score);
      if (onProgressUpdate) onProgressUpdate();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const renderWord = () => {
    if (!selectedWord) return null;
    return selectedWord.split('').map((letter, index) => (
      <motion.span
        key={index}
        className="inline-block w-8 h-8 mx-1 text-center border-b-2 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        {guessedLetters.includes(letter) ? letter.toUpperCase() : '_'}
      </motion.span>
    ));
  };

  const renderHangman = () => {
    return (
      <div className="relative w-48 h-48 mx-auto">
        {/* Gallows */}
        <div className="absolute top-0 left-1/2 w-1 h-8 bg-gray-800 dark:bg-gray-200" />
        <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gray-800 dark:bg-gray-200" />
        <div className="absolute top-0 left-1/4 w-1 h-48 bg-gray-800 dark:bg-gray-200" />
        <div className="absolute bottom-0 left-1/4 w-3/4 h-1 bg-gray-800 dark:bg-gray-200" />
        
        {/* Hangman parts */}
        {HANGMAN_PARTS.slice(0, DIFFICULTY_LEVELS[difficulty].lives - lives).map((part, index) => (
          <motion.div
            key={part}
            className={`absolute ${getHangmanPartStyle(part)}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.2 }}
          />
        ))}
      </div>
    );
  };

  const getHangmanPartStyle = (part: string) => {
    const styles: { [key: string]: string } = {
      'head': 'top-8 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-2 border-gray-800 dark:border-gray-200',
      'body': 'top-14 left-1/2 -translate-x-1/2 w-1 h-12 bg-gray-800 dark:bg-gray-200',
      'left-arm': 'top-16 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-800 dark:bg-gray-200 -rotate-45 origin-left',
      'right-arm': 'top-16 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-800 dark:bg-gray-200 rotate-45 origin-right',
      'left-leg': 'top-26 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-800 dark:bg-gray-200 -rotate-45 origin-left',
      'right-leg': 'top-26 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-800 dark:bg-gray-200 rotate-45 origin-right',
      'rope': 'top-0 left-1/2 -translate-x-1/2 w-1 h-8 bg-gray-800 dark:bg-gray-200',
      'beam': 'top-0 left-1/4 w-1/2 h-1 bg-gray-800 dark:bg-gray-200'
    };
    return styles[part];
  };

  const renderKeyboard = () => {
    return 'abcdefghijklmnopqrstuvwxyz'.split('').map(letter => (
      <motion.button
        key={letter}
        className={`w-8 h-8 m-1 rounded-full ${
          guessedLetters.includes(letter)
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white text-lg font-bold`}
        onClick={() => handleGuess(letter)}
        disabled={guessedLetters.includes(letter) || gameStatus !== 'playing'}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {letter.toUpperCase()}
      </motion.button>
    ));
  };

  if (loadingWord) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Loading word for Hangman...</p>
      </div>
    );
  }

  if (!selectedWord) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">No words available for Hangman.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Hangman Game</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as keyof typeof DIFFICULTY_LEVELS)}
            className="p-2 rounded border text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
          >
            <option value="easy" className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800">Easy</option>
            <option value="medium" className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800">Medium</option>
            <option value="hard" className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800">Hard</option>
          </select>
          <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <FaTrophy className="text-yellow-500" />
            <span>Score: {score}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <FaSkull className="text-red-500" />
            <span>Lives: {lives}</span>
          </div>
        </div>
        <button
          onClick={startNewGame}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
        >
          <FaRedo />
        </button>
      </div>

      {renderHangman()}

      <div className="my-8 text-center text-2xl text-gray-900 dark:text-gray-100">
        {renderWord()}
      </div>

      <div className="flex flex-wrap justify-center gap-1">
        {renderKeyboard()}
      </div>

      <AnimatePresence>
        {gameStatus !== 'playing' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg text-center shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                {gameStatus === 'won' ? 'Congratulations!' : 'Game Over'}
              </h2>
              <p className="mb-4 text-gray-900 dark:text-gray-100">Your score: {score}</p>
              {gameStatus === 'lost' && (
                <p className="mb-4 text-red-600 dark:text-red-400 font-bold">Correct Word: {selectedWord.toUpperCase()}</p>
              )}
              <button
                onClick={startNewGame}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Play Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">High Scores</h3>
        <div className="space-y-2">
          {highScores.map((score, index) => (
            <div key={index} className="flex justify-between text-gray-900 dark:text-gray-100">
              <span>#{index + 1}</span>
              <span>{score.score} points</span>
              <span>{new Date(score.date).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 