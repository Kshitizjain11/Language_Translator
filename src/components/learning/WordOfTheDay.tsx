'use client'

import React, { useState, useEffect } from 'react'
import { FaVolumeUp, FaCheck } from 'react-icons/fa'
import { motion } from 'framer-motion'

interface Word {
  id: string
  word: string
  meaning: string
  pronunciation: string
  example: string
  date: Date
  learned: boolean
}

interface WordOfTheDayProps {
  onWordLearned: (word: Word) => void
}

const WordOfTheDay = ({ onWordLearned }: WordOfTheDayProps) => {
  const [word, setWord] = useState<Word | null>(null)
  const [isLearned, setIsLearned] = useState(false)

  // Sample vocabulary words (in a real app, this would come from an API)
  const vocabularyWords = [
    {
      id: '1',
      word: 'Bonjour',
      meaning: 'Hello',
      pronunciation: 'bɔ̃.ʒuʁ',
      example: 'Bonjour, comment allez-vous aujourd\'hui?',
      date: new Date(),
      learned: false
    },
    {
      id: '2',
      word: 'Merci',
      meaning: 'Thank you',
      pronunciation: 'mɛʁ.si',
      example: 'Merci beaucoup pour votre aide!',
      date: new Date(),
      learned: false
    },
    // Add more words...
  ]

  useEffect(() => {
    // Get today's word from localStorage or generate a new one
    const today = new Date().toDateString()
    const savedWord = localStorage.getItem('wordOfTheDay')
    
    if (savedWord) {
      const parsedWord = JSON.parse(savedWord)
      if (parsedWord.date === today) {
        setWord(parsedWord)
        setIsLearned(parsedWord.learned)
      }
    }
    
    if (!savedWord || JSON.parse(savedWord).date !== today) {
      // Select a random word for today
      const randomWord = vocabularyWords[Math.floor(Math.random() * vocabularyWords.length)]
      const todayWord = { ...randomWord, date: today }
      setWord(todayWord)
      localStorage.setItem('wordOfTheDay', JSON.stringify(todayWord))
    }
  }, [])

  const handleLearnToggle = () => {
    if (word) {
      const updatedWord = { ...word, learned: !isLearned }
      setIsLearned(!isLearned)
      localStorage.setItem('wordOfTheDay', JSON.stringify(updatedWord))
      if (!isLearned) {
        onWordLearned(updatedWord)
      }
    }
  }

  const speakWord = () => {
    if (word) {
      const utterance = new SpeechSynthesisUtterance(word.word)
      utterance.lang = 'fr-FR' // French accent
      window.speechSynthesis.speak(utterance)
    }
  }

  if (!word) return null

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Word of the Day</h2>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">{word.word}</h3>
          <button
            onClick={speakWord}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
          >
            <FaVolumeUp className="w-5 h-5" />
          </button>
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