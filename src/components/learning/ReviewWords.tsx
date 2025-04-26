'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaVolumeUp, FaTrash } from 'react-icons/fa'

interface Word {
  id: string
  word: string
  meaning: string
  pronunciation: string
  example: string
  date: Date
  learned: boolean
}

interface ReviewWordsProps {
  words: Word[]
}

// --- Demo visually engaging flashcards ---
const demoWords: Word[] = [
  {
    id: '1',
    word: 'Hello',
    meaning: 'Hola',
    pronunciation: 'heh-loh',
    example: 'Hello! How are you? / ¡Hola! ¿Cómo estás?',
    date: new Date(),
    learned: false,
  },
  {
    id: '2',
    word: 'Thank you',
    meaning: 'Gracias',
    pronunciation: 'thangk-yoo',
    example: 'Thank you for your help. / Gracias por tu ayuda.',
    date: new Date(),
    learned: false,
  },
  {
    id: '3',
    word: 'Dog',
    meaning: 'Perro',
    pronunciation: 'dog',
    example: 'The dog is friendly. / El perro es amigable.',
    date: new Date(),
    learned: false,
  },
  {
    id: '4',
    word: 'Apple',
    meaning: 'Manzana',
    pronunciation: 'ap-uhl',
    example: 'I eat an apple every day. / Como una manzana cada día.',
    date: new Date(),
    learned: false,
  },
  {
    id: '5',
    word: 'Good night',
    meaning: 'Buenas noches',
    pronunciation: 'good-nait',
    example: 'Good night and sweet dreams! / ¡Buenas noches y dulces sueños!',
    date: new Date(),
    learned: false,
  }
];

const ReviewWords = ({ words }: ReviewWordsProps) => {
  // Use demoWords if no words are passed in
  const workingWords = words && words.length > 0 ? words : demoWords;

  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'word'>('date')

  const filteredWords = workingWords
    .filter(word => 
      word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.meaning.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
      return a.word.localeCompare(b.word)
    })

  const speakWord = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = 'fr-FR' // French accent
    window.speechSynthesis.speak(utterance)
  }

  const removeWord = (id: string) => {
    const updatedWords = workingWords.filter(word => word.id !== id)
    localStorage.setItem('learnedWords', JSON.stringify(updatedWords))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Review Words</h2>
      
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search words..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'word')}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="date">Sort by Date</option>
          <option value="word">Sort by Word</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredWords.map((word) => (
            <motion.div
              key={word.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {word.word}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => speakWord(word.word)}
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                  >
                    <FaVolumeUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeWord(word.id)}
                    className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {word.pronunciation}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {word.meaning}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  {word.example}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Learned on: {new Date(word.date).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredWords.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No words found. Start learning to build your vocabulary!
        </div>
      )}
    </div>
  )
}

export default ReviewWords 