'use client'

import React, { useState, useEffect } from 'react'
import { FaVolumeUp, FaCheck, FaBookmark, FaBookOpen } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { Language } from './LanguageSelector'

interface Word {
  id: string
  word: string
  meaning: string
  pronunciation: string
  example: string
  date: string
  learned: boolean
  language: string
}

interface WordOfTheDayProps {
  onWordLearned: (word: Word) => void
  selectedLanguage: Language
  onSaveToNotebook: (word: Word) => void
}

// Sample vocabulary words by language
const vocabularyWordsByLanguage: Record<string, Word[]> = {
  es: [
    {
      id: '1',
      word: 'Hola',
      meaning: 'Hello',
      pronunciation: 'o.la',
      example: '¡Hola! ¿Cómo estás?',
      date: new Date().toDateString(),
      learned: false,
      language: 'es'
    },
    // Add more Spanish words...
  ],
  fr: [
    {
      id: '1',
      word: 'Bonjour',
      meaning: 'Hello',
      pronunciation: 'bɔ̃.ʒuʁ',
      example: 'Bonjour, comment allez-vous aujourd\'hui?',
      date: new Date().toDateString(),
      learned: false,
      language: 'fr'
    },
    {
      id: '2',
      word: 'Merci',
      meaning: 'Thank you',
      pronunciation: 'mɛʁ.si',
      example: 'Merci beaucoup pour votre aide!',
      date: new Date().toDateString(),
      learned: false,
      language: 'fr'
    },
  ],
  // Add more languages...
}

const WordOfTheDay = ({ onWordLearned, selectedLanguage, onSaveToNotebook }: WordOfTheDayProps) => {
  const [word, setWord] = useState<Word | null>(null)
  const [isLearned, setIsLearned] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    // Get today's word from localStorage or generate a new one
    const today = new Date().toDateString()
    const storageKey = `wordOfTheDay_${selectedLanguage.code}`
    const savedWord = localStorage.getItem(storageKey)
    
    if (savedWord) {
      const parsedWord = JSON.parse(savedWord)
      if (parsedWord.date === today && parsedWord.language === selectedLanguage.code) {
        setWord(parsedWord)
        setIsLearned(parsedWord.learned)
        // Check if word is saved in notebook
        const notebook = JSON.parse(localStorage.getItem('notebook') || '[]')
        setIsSaved(notebook.some((w: Word) => w.id === parsedWord.id))
        return
      }
    }
    
    // Select a random word for today
    const languageWords = vocabularyWordsByLanguage[selectedLanguage.code] || []
    if (languageWords.length > 0) {
      const randomWord = languageWords[Math.floor(Math.random() * languageWords.length)]
      const todayWord = { ...randomWord, date: today }
      setWord(todayWord)
      setIsLearned(false)
      localStorage.setItem(storageKey, JSON.stringify(todayWord))
      
      // Check if word is saved in notebook
      const notebook = JSON.parse(localStorage.getItem('notebook') || '[]')
      setIsSaved(notebook.some((w: Word) => w.id === todayWord.id))
    }
  }, [selectedLanguage])

  const handleLearnToggle = () => {
    if (word) {
      const updatedWord = { ...word, learned: !isLearned }
      setIsLearned(!isLearned)
      localStorage.setItem(`wordOfTheDay_${selectedLanguage.code}`, JSON.stringify(updatedWord))
      if (!isLearned) {
        onWordLearned(updatedWord)
        updateProgress(updatedWord.word, true)
      }
    }
  }

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

  const handleSaveToNotebook = () => {
    if (word) {
      const notebook = JSON.parse(localStorage.getItem('notebook') || '[]')
      if (!isSaved) {
        const updatedNotebook = [...notebook, word]
        localStorage.setItem('notebook', JSON.stringify(updatedNotebook))
        setIsSaved(true)
        onSaveToNotebook(word)
      } else {
        const updatedNotebook = notebook.filter((w: Word) => w.id !== word.id)
        localStorage.setItem('notebook', JSON.stringify(updatedNotebook))
        setIsSaved(false)
      }
    }
  }

  const speakWord = () => {
    if (word) {
      const utterance = new SpeechSynthesisUtterance(word.word)
      utterance.lang = `${selectedLanguage.code}-${selectedLanguage.code.toUpperCase()}`
      window.speechSynthesis.speak(utterance)
    }
  }

  if (!word) return null

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        Word of the Day - {selectedLanguage.name}
      </h2>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">{word.word}</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={speakWord}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              <FaVolumeUp className="w-5 h-5" />
            </button>
            <button
              onClick={handleSaveToNotebook}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              {isSaved ? (
                <FaBookmark className="w-5 h-5" />
              ) : (
                <FaBookOpen className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          Pronunciation: {word.pronunciation}
        </div>

        <div className="text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Meaning:</span> {word.meaning}
        </div>

        <div className="text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Example:</span> {word.example}
        </div>

        <button
          onClick={handleLearnToggle}
          className={`w-full py-2 px-4 rounded-lg flex items-center justify-center space-x-2 ${
            isLearned
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          <FaCheck className="w-4 h-4" />
          <span>{isLearned ? 'Learned!' : 'Mark as Learned'}</span>
        </button>
      </motion.div>
    </div>
  )
}

export default WordOfTheDay 