'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaVolumeUp } from 'react-icons/fa'
import { Language } from './LanguageSelector'

interface ContextExample {
  word: string
  context: string
  translation: string
  culturalNote?: string
  language: string
}

interface ContextLearningProps {
  selectedLanguage: Language
  wordOfTheDay?: {
    word: string
    meaning: string
  }
}

// Sample context examples by language (in a real app, this would come from an API)
const contextExamplesByLanguage: Record<string, ContextExample[]> = {
  es: [
    {
      word: 'Hola',
      context: 'En España, cuando entras en una tienda, siempre dices "Hola" al vendedor como señal de respeto.',
      translation: 'In Spain, when you enter a shop, you always say "Hello" to the seller as a sign of respect.',
      culturalNote: 'In Spanish culture, greeting people when entering a space is considered basic etiquette.',
      language: 'es'
    },
    // Add more Spanish examples...
  ],
  fr: [
    {
      word: 'Bonjour',
      context: 'En entrant dans une boulangerie parisienne, on dit toujours "Bonjour" au boulanger avant de commander.',
      translation: 'When entering a Parisian bakery, one always says "Hello" to the baker before ordering.',
      culturalNote: 'In France, it\'s considered impolite to not greet shopkeepers when entering their stores.',
      language: 'fr'
    },
    {
      word: 'Merci',
      context: 'Après avoir reçu un cadeau, les Français disent souvent "Merci beaucoup" avec un sourire sincère.',
      translation: 'After receiving a gift, the French often say "Thank you very much" with a sincere smile.',
      culturalNote: 'In French culture, expressing gratitude is important in both formal and informal settings.',
      language: 'fr'
    },
  ],
  // Add more languages...
}

const ContextLearning: React.FC<ContextLearningProps> = ({ selectedLanguage, wordOfTheDay }) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [contextExamples, setContextExamples] = useState<ContextExample[]>([])
  const [currentExample, setCurrentExample] = useState<ContextExample | null>(null)

  useEffect(() => {
    const examples = contextExamplesByLanguage[selectedLanguage.code] || []
    setContextExamples(examples)
    
    // If word of the day is provided, try to find its context
    if (wordOfTheDay) {
      const wordContext = examples.find(ex => ex.word.toLowerCase() === wordOfTheDay.word.toLowerCase())
      if (wordContext) {
        setSelectedWord(wordContext.word)
        setCurrentExample(wordContext)
      }
    } else {
      setSelectedWord(null)
      setCurrentExample(null)
    }
  }, [selectedLanguage, wordOfTheDay])

  const handleWordClick = (word: string) => {
    setSelectedWord(word)
    const example = getContextForWord(word)
    setCurrentExample(example || null)
  }

  const getContextForWord = (word: string) => {
    return contextExamples.find(example => example.word.toLowerCase() === word.toLowerCase())
  }

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = `${selectedLanguage.code}-${selectedLanguage.code.toUpperCase()}`
    window.speechSynthesis.speak(utterance)
  }

  const highlightWord = (text: string, wordToHighlight: string) => {
    const regex = new RegExp(`(${wordToHighlight})`, 'gi')
    return text.split(regex).map((part, index) => {
      if (part.toLowerCase() === wordToHighlight.toLowerCase()) {
        return (
          <span key={index} className="bg-yellow-200 dark:bg-yellow-900 px-1 rounded">
            {part}
          </span>
        )
      }
      return part
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        Context Learning - {selectedLanguage.name}
      </h2>
      
      <div className="space-y-4">
        {contextExamples.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No context examples available for this language yet.
          </p>
        ) : (
          <>
            <p className="text-gray-700 dark:text-gray-300">
              {wordOfTheDay ? (
                `Learn how to use "${wordOfTheDay.word}" in context:`
              ) : (
                'Click on any word in the examples below to see its context and cultural significance:'
              )}
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              {contextExamples.map((example, index) => (
                <div
                  key={index}
                  onClick={() => handleWordClick(example.word)}
                  className={`bg-gray-50 dark:bg-gray-700 p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedWord === example.word ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <p className="text-gray-900 dark:text-white">
                    {highlightWord(example.context, example.word)}
                  </p>
                </div>
              ))}
            </div>

            {currentExample && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    {currentExample.word}
                  </h3>
                  <button
                    onClick={() => speakText(currentExample.context)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500"
                  >
                    <FaVolumeUp className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Context:</p>
                    <p className="text-gray-600 dark:text-gray-400">{currentExample.context}</p>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Translation:</p>
                    <p className="text-gray-600 dark:text-gray-400">{currentExample.translation}</p>
                  </div>
                  
                  {currentExample.culturalNote && (
                    <div>
                      <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Cultural Note:
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">{currentExample.culturalNote}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ContextLearning 