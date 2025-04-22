'use client'

import React from 'react'
import { FaFire } from 'react-icons/fa'
import { motion } from 'framer-motion'

interface Streak {
  count: number
  lastActive: Date
}

interface StreakTrackerProps {
  streak: Streak
}

const StreakTracker = ({ streak }: StreakTrackerProps) => {
  const getStreakMessage = () => {
    if (streak.count === 0) return 'Start your learning streak today!'
    if (streak.count < 7) return `${streak.count} day streak!`
    if (streak.count < 30) return `Amazing ${streak.count} day streak!`
    return `Incredible ${streak.count} day streak!`
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full"
    >
      <FaFire className="w-5 h-5" />
      <span className="font-semibold">{getStreakMessage()}</span>
    </motion.div>
  )
}

export default StreakTracker 