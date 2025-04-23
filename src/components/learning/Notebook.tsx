import React, { useState, useEffect } from 'react'
import { FaVolumeUp, FaTrash, FaFilter } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { Language } from './LanguageSelector'

interface SavedWord {
  id: string
  word: string
  translation: string
  pronunciation?: string
  examples: string[]
  language: string
  dateAdded: string
  learned: boolean
}

interface NotebookProps {
  selectedLanguage: Language
}

const Notebook: React.FC<NotebookProps> = ({ selectedLanguage }) => {
  const [savedWords, setSavedWords] = useState<SavedWord[]>([])
  const [filteredWords, setFilteredWords] = useState<SavedWord[]>([])
  const [filterLearned, setFilterLearned] = useState<boolean | null>(null)

  useEffect(() => {
    const notebook = JSON.parse(localStorage.getItem('notebook') || '[]')
    const wordsForLanguage = notebook.filter((word: SavedWord) => word.language === selectedLanguage.code)
    setSavedWords(wordsForLanguage)
    setFilteredWords(wordsForLanguage)
  }, [selectedLanguage])

  const handleRemoveWord = (wordId: string) => {
    const notebook = JSON.parse(localStorage.getItem('notebook') || '[]')
    const updatedNotebook = notebook.filter((w: SavedWord) => w.id !== wordId)
    localStorage.setItem('notebook', JSON.stringify(updatedNotebook))
    
    const updatedWords = savedWords.filter(w => w.id !== wordId)
    setSavedWords(updatedWords)
    setFilteredWords(updatedWords)
  }

  const speakWord = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = `${selectedLanguage.code}-${selectedLanguage.code.toUpperCase()}`
    window.speechSynthesis.speak(utterance)
  }

  const handleFilterChange = (learned: boolean | null) => {
    setFilterLearned(learned)
    if (learned === null) {
      setFilteredWords(savedWords)
    } else {
      setFilteredWords(savedWords.filter(word => word.learned === learned))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Notebook - {selectedLanguage.name}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleFilterChange(null)}
            className={`px-3 py-1 rounded-lg ${
              filterLearned === null
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleFilterChange(true)}
            className={`px-3 py-1 rounded-lg ${
              filterLearned === true
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Learned
          </button>
          <button
            onClick={() => handleFilterChange(false)}
            className={`px-3 py-1 rounded-lg ${
              filterLearned === false
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            To Learn
          </button>
        </div>
      </div>

      <AnimatePresence>
        {filteredWords.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-gray-500 dark:text-gray-400 py-8"
          >
            No words saved yet
          </motion.div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredWords.map((word) => (
              <motion.div
                key={word.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    {word.word}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => speakWord(word.word)}
                      className="p-1 text-gray-600 dark:text-gray-300 hover:text-blue-500"
                    >
                      <FaVolumeUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveWord(word.id)}
                      className="p-1 text-gray-600 dark:text-gray-300 hover:text-red-500"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {word.pronunciation && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {word.pronunciation}
                  </div>
                )}

                <div className="mt-2 text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Translation:</span> {word.translation}
                </div>

                <div className="mt-2 text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Examples:</span>
                  <ul className="list-disc pl-5 text-sm">
                    {word.examples.map((example, idx) => (
                      <li key={idx}>{example}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Added: {new Date(word.dateAdded).toLocaleDateString()}
                </div>

                {word.learned && (
                  <div className="mt-2">
                    <span className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                      Learned
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Notebook 