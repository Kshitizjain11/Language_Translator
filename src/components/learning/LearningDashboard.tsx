import React, { useState, useEffect } from 'react'
import LanguageSelector, { Language } from './LanguageSelector'
import WordOfTheDay from './WordOfTheDay'
import ContextLearning from './ContextLearning'
import StreakTracker from './StreakTracker'
import Notebook from './Notebook'

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

const LearningDashboard: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>({
    code: 'es',
    name: 'Spanish',
    flag: '🇪🇸'
  })
  const [wordOfTheDay, setWordOfTheDay] = useState<Word | null>(null)
  const [showNotebook, setShowNotebook] = useState(false)

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language)
    // Reset word of the day when language changes
    const storageKey = `wordOfTheDay_${language.code}`
    const savedWord = localStorage.getItem(storageKey)
    if (savedWord) {
      setWordOfTheDay(JSON.parse(savedWord))
    } else {
      setWordOfTheDay(null)
    }
  }

  const handleWordLearned = (word: Word) => {
    // Update streak when a word is learned
    const today = new Date().toISOString().split('T')[0]
    const streakKey = `streak_${selectedLanguage.code}`
    const savedStreak = localStorage.getItem(streakKey)
    
    if (savedStreak) {
      const streak = JSON.parse(savedStreak)
      if (streak.lastActive !== today) {
        const updatedStreak = {
          ...streak,
          count: streak.count + 1,
          lastActive: today,
          longestStreak: Math.max(streak.longestStreak, streak.count + 1),
          totalWordsLearned: streak.totalWordsLearned + 1
        }
        localStorage.setItem(streakKey, JSON.stringify(updatedStreak))
      }
    }
  }

  const handleSaveToNotebook = (word: Word) => {
    const notebook = JSON.parse(localStorage.getItem('notebook') || '[]')
    if (!notebook.some((w: Word) => w.id === word.id)) {
      const updatedNotebook = [...notebook, word]
      localStorage.setItem('notebook', JSON.stringify(updatedNotebook))
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Language Learning Dashboard
        </h1>
        <LanguageSelector
          onLanguageChange={handleLanguageChange}
          selectedLanguage={selectedLanguage}
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-8">
          <WordOfTheDay
            selectedLanguage={selectedLanguage}
            onWordLearned={handleWordLearned}
            onSaveToNotebook={handleSaveToNotebook}
          />
          <StreakTracker selectedLanguage={selectedLanguage} />
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowNotebook(!showNotebook)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {showNotebook ? 'Show Context Learning' : 'Show Notebook'}
            </button>
          </div>

          {showNotebook ? (
            <Notebook selectedLanguage={selectedLanguage} />
          ) : (
            <ContextLearning
              selectedLanguage={selectedLanguage}
              wordOfTheDay={wordOfTheDay ? {
                word: wordOfTheDay.word,
                meaning: wordOfTheDay.meaning
              } : undefined}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default LearningDashboard 