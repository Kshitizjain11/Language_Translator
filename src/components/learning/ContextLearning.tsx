'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface ContextExample {
  word: string
  context: string
  translation: string
  culturalNote?: string
}

const ContextLearning = () => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null)

  // Sample context examples (in a real app, this would come from an API)
  const contextExamples: ContextExample[] = [
    {
      word: 'Bonjour',
      context: 'En entrant dans une boulangerie parisienne, on dit toujours "Bonjour" au boulanger avant de commander.',
      translation: 'When entering a Parisian bakery, one always says "Hello" to the baker before ordering.',
      culturalNote: 'In France, it\'s considered impolite to not greet shopkeepers when entering their stores.'
    },
    {
      word: 'Merci',
      context: 'Après avoir reçu un cadeau, les Français disent souvent "Merci beaucoup" avec un sourire sincère.',
      translation: 'After receiving a gift, the French often say "Thank you very much" with a sincere smile.',
      culturalNote: 'In French culture, expressing gratitude is important in both formal and informal settings.'
    },
    // Add more examples...
  ]

  const handleWordClick = (word: string) => {
    setSelectedWord(word)
  }

  const getContextForWord = (word: string) => {
    return contextExamples.find(example => example.word.toLowerCase() === word.toLowerCase())
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Context Learning</h2>
      
      <div className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300">
          Click on any word in the text below to see its context and cultural significance:
        </p>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-gray-900 dark:text-white">
            {contextExamples[0].context.split(' ').map((word, index) => {
              const cleanWord = word.replace(/[.,!?]/g, '')
              const example = getContextForWord(cleanWord)
              
              return (
                <span
                  key={index}
                  onClick={() => handleWordClick(cleanWord)}
                  className={`cursor-pointer hover:text-blue-500 dark:hover:text-blue-400 ${
                    example ? 'font-semibold' : ''
                  }`}
                >
                  {word}{' '}
                </span>
              )
            })}
          </p>
        </div>

        {selectedWord && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg"
          >
            <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
              {selectedWord}
            </h3>
            
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Context:</span>{' '}
                {getContextForWord(selectedWord)?.context}
              </p>
              
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Translation:</span>{' '}
                {getContextForWord(selectedWord)?.translation}
              </p>
              
              {getContextForWord(selectedWord)?.culturalNote && (
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Cultural Note:</span>{' '}
                  {getContextForWord(selectedWord)?.culturalNote}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ContextLearning 