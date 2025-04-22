'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaFire, FaCheck, FaStar, FaTrophy } from 'react-icons/fa'
import WordOfTheDay from './WordOfTheDay'
import StreakTracker from './StreakTracker'
import ContextLearning from './ContextLearning'
import ReviewWords from './ReviewWords'

interface Word {
  id: string
  word: string
  meaning: string
  pronunciation: string
  example: string
  date: Date
  learned: boolean
}

interface Streak {
  count: number
  lastActive: Date
}

const LearningMode = () => {
  const [currentWord, setCurrentWord] = useState<Word | null>(null)
  const [streak, setStreak] = useState<Streak>({ count: 0, lastActive: new Date() })
  const [showCelebration, setShowCelebration] = useState(false)
  const [learnedWords, setLearnedWords] = useState<Word[]>([])

  // Load user's streak and learned words from localStorage
  useEffect(() => {
    const savedStreak = localStorage.getItem('learningStreak')
    const savedWords = localStorage.getItem('learnedWords')
    
    if (savedStreak) {
      setStreak(JSON.parse(savedStreak))
    }
    
    if (savedWords) {
      setLearnedWords(JSON.parse(savedWords))
    }
  }, [])

  // Save streak and learned words to localStorage
  useEffect(() => {
    localStorage.setItem('learningStreak', JSON.stringify(streak))
    localStorage.setItem('learnedWords', JSON.stringify(learnedWords))
  }, [streak, learnedWords])

  const handleWordLearned = (word: Word) => {
    const updatedWord = { ...word, learned: true }
    setLearnedWords(prev => [...prev, updatedWord])
    
    // Update streak
    const today = new Date()
    const lastActive = new Date(streak.lastActive)
    const isNewDay = today.getDate() !== lastActive.getDate()
    
    if (isNewDay) {
      const newStreak = {
        count: streak.count + 1,
        lastActive: today
      }
      setStreak(newStreak)
      
      // Show celebration for milestone streaks
      if (newStreak.count % 7 === 0) {
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Learning Mode
          </h1>
          <StreakTracker streak={streak} />
        </div>

        {/* Celebration Animation */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center">
                <FaTrophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Amazing Streak!
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  You've maintained a {streak.count}-day streak! Keep it up!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Word of the Day */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <WordOfTheDay onWordLearned={handleWordLearned} />
          </div>

          {/* Context Learning */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <ContextLearning />
          </div>
        </div>

        {/* Review Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <ReviewWords words={learnedWords} />
        </div>
      </div>
    </div>
  )
}

export default LearningMode 