'use client'

import React, { useEffect, useState } from 'react'
import { FaFire, FaSnowflake, FaCrown, FaTrophy, FaMedal } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

interface Streak {
  count: number
  lastActive: string
  freezesAvailable: number
  longestStreak: number
  totalWordsLearned: number
  language: string
}

interface StreakTrackerProps {
  selectedLanguage: {
    code: string
    name: string
  }
  onStreakUpdate?: (streak: Streak) => void
}

const StreakTracker: React.FC<StreakTrackerProps> = ({ selectedLanguage, onStreakUpdate }) => {
  const [streak, setStreak] = useState<Streak>(() => {
    const savedStreak = localStorage.getItem(`streak_${selectedLanguage.code}`)
    if (savedStreak) {
      return JSON.parse(savedStreak)
    }
    return {
      count: 0,
      lastActive: new Date().toISOString().split('T')[0],
      freezesAvailable: 2,
      longestStreak: 0,
      totalWordsLearned: 0,
      language: selectedLanguage.code
    }
  })

  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    // Load streak data for the selected language
    const savedStreak = localStorage.getItem(`streak_${selectedLanguage.code}`)
    if (savedStreak) {
      setStreak(JSON.parse(savedStreak))
    } else {
      // Initialize new streak for language
      const newStreak = {
        count: 0,
        lastActive: new Date().toISOString().split('T')[0],
        freezesAvailable: 2,
        longestStreak: 0,
        totalWordsLearned: 0,
        language: selectedLanguage.code
      }
      setStreak(newStreak)
      localStorage.setItem(`streak_${selectedLanguage.code}`, JSON.stringify(newStreak))
    }
  }, [selectedLanguage])

  useEffect(() => {
    // Check if streak should be reset
    const today = new Date().toISOString().split('T')[0]
    const lastActive = new Date(streak.lastActive)
    const daysSinceActive = Math.floor((Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24))

    if (daysSinceActive > 1) {
      // More than one day has passed
      if (streak.freezesAvailable > 0 && daysSinceActive === 2) {
        // Use streak freeze
        const updatedStreak = {
          ...streak,
          freezesAvailable: streak.freezesAvailable - 1,
          lastActive: today
        }
        setStreak(updatedStreak)
        localStorage.setItem(`streak_${selectedLanguage.code}`, JSON.stringify(updatedStreak))
        if (onStreakUpdate) onStreakUpdate(updatedStreak)
      } else {
        // Reset streak
        const updatedStreak = {
          ...streak,
          count: 0,
          lastActive: today,
          freezesAvailable: Math.min(streak.freezesAvailable + 1, 2) // Replenish one freeze
        }
        setStreak(updatedStreak)
        localStorage.setItem(`streak_${selectedLanguage.code}`, JSON.stringify(updatedStreak))
        if (onStreakUpdate) onStreakUpdate(updatedStreak)
      }
    }
  }, [])

  const incrementStreak = () => {
    const today = new Date().toISOString().split('T')[0]
    if (streak.lastActive !== today) {
      setShowAnimation(true)
      const updatedStreak = {
        ...streak,
        count: streak.count + 1,
        lastActive: today,
        longestStreak: Math.max(streak.longestStreak, streak.count + 1),
        totalWordsLearned: streak.totalWordsLearned + 1
      }
      setStreak(updatedStreak)
      localStorage.setItem(`streak_${selectedLanguage.code}`, JSON.stringify(updatedStreak))
      if (onStreakUpdate) onStreakUpdate(updatedStreak)
      
      setTimeout(() => setShowAnimation(false), 1000)
    }
  }

  const getStreakIcon = () => {
    if (streak.count >= 30) return <FaCrown className="w-6 h-6 text-yellow-400" />
    if (streak.count >= 14) return <FaTrophy className="w-6 h-6 text-yellow-500" />
    if (streak.count >= 7) return <FaMedal className="w-6 h-6 text-orange-500" />
    return <FaFire className="w-6 h-6 text-red-500" />
  }

  const getStreakMessage = () => {
    if (streak.count === 0) return 'Start your learning streak today!'
    if (streak.count < 7) return `${streak.count} day streak! Keep it up!`
    if (streak.count < 14) return `Fantastic ${streak.count} day streak!`
    if (streak.count < 30) return `Amazing ${streak.count} day streak!`
    return `Incredible ${streak.count} day streak! You're on fire!`
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {selectedLanguage.name} Streak
          </h3>
          <div className="flex items-center space-x-2">
            {streak.freezesAvailable > 0 && (
              <div className="flex items-center text-blue-500">
                <FaSnowflake className="w-5 h-5 mr-1" />
                <span className="text-sm">{streak.freezesAvailable}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <AnimatePresence>
            {showAnimation ? (
              <motion.div
                key="animation"
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="flex items-center"
              >
                {getStreakIcon()}
              </motion.div>
            ) : (
              <motion.div
                key="static"
                initial={{ opacity: 1 }}
                className="flex items-center"
              >
                {getStreakIcon()}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-white">
              {getStreakMessage()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Longest streak: {streak.longestStreak} days
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {streak.totalWordsLearned}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Words Learned</p>
          </div>
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {streak.count}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Current Streak</p>
          </div>
        </div>

        {streak.freezesAvailable > 0 && (
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <p>
              You have {streak.freezesAvailable} streak freeze{streak.freezesAvailable > 1 ? 's' : ''} available.
              They'll automatically be used to protect your streak if you miss a day!
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default StreakTracker 