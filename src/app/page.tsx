'use client'

import React, { useState, useRef, useEffect, Suspense } from 'react'
import { FaMicrophone, FaVolumeUp, FaCopy, FaDownload, FaMoon, FaSun } from 'react-icons/fa'
import { motion } from 'framer-motion'
import Link from 'next/link'
import TranslationHistoryPanel from '@/components/learning/TranslationHistoryPanel';
import AuthGuard from '@/components/AuthGuard';
import FeaturePanel from '@/components/leftPanel/FeaturePanel';
import GrammarCheck from '@/components/features/GrammarCheck';
import Dictionary from '@/components/features/Dictionary';
import Summarizer from '@/components/features/Summarizer';
import Paraphraser from '@/components/features/Paraphraser';
import { useRouter } from 'next/navigation';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
]

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [activeFeature, setActiveFeature] = useState('translator');
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [sourceLang, setSourceLang] = useState('en')
  const [targetLang, setTargetLang] = useState('es')
  const [isLoading, setIsLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      router.push('/login');
    } else {
      setUserId(storedUserId);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    router.push('/login');
  };

  if (!userId) {
    return null; // or a loading spinner
  }

  const handleTranslate = async () => {
    if (!inputText.trim()) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          sourceLang: languages.find(l => l.code === sourceLang)?.name || 'English',
          targetLang: languages.find(l => l.code === targetLang)?.name || 'Spanish'
        })
      })
      
      const data = await response.json()
      setOutputText(data.translation)
      
      // Create translation record
      const translation = {
        id: Math.random().toString(36).substr(2, 9),
        userId,
        sourceText: inputText,
        targetText: data.translation,
        sourceLang: languages.find((l) => l.code === sourceLang)?.name || 'English',
        targetLang: languages.find((l) => l.code === targetLang)?.name || 'Spanish',
        frequency: 1,
        lastTranslated: new Date(),
        createdAt: new Date(),
      };
      
      // Save to localStorage
      const savedHistory = localStorage.getItem(`translationHistory_${userId}`);
      let history = [];
      
      if (savedHistory) {
        try {
          history = JSON.parse(savedHistory);
        } catch (e) {
          console.error('Error parsing saved history:', e);
        }
      }
      
      // Add new translation to the beginning of the array
      history.unshift(translation);
      
      // Limit to 50 entries
      if (history.length > 50) {
        history = history.slice(0, 50);
      }
      
      // Save back to localStorage
      localStorage.setItem(`translationHistory_${userId}`, JSON.stringify(history));
      
      // Also record in API for server-side tracking
      await fetch('/api/learning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'translation',
          userId,
          sourceText: inputText,
          targetText: data.translation,
          sourceLang: languages.find((l) => l.code === sourceLang)?.name || 'English',
          targetLang: languages.find((l) => l.code === targetLang)?.name || 'Spanish',
        }),
      });
    } catch (error) {
      console.error('Translation error:', error)
      setOutputText('Error during translation. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.lang = sourceLang
      
      recognition.onstart = () => setIsListening(true)
      recognition.onend = () => setIsListening(false)
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputText(transcript)
      }
      
      recognition.start()
    } else {
      alert('Speech recognition is not supported in your browser.')
    }
  }

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = targetLang
    window.speechSynthesis.speak(utterance)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText)
  }

  const downloadTranscript = () => {
    const element = document.createElement('a')
    const file = new Blob([`Input (${sourceLang}): ${inputText}\nOutput (${targetLang}): ${outputText}`], 
      { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = 'translation.txt'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="flex min-h-screen">
          <FeaturePanel activeFeature={activeFeature} setActiveFeature={setActiveFeature} />
          
          <div className="flex-1 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                  {activeFeature === 'translator' && 'Language Translator'}
                  {activeFeature === 'grammar' && 'Grammar Check'}
                  {activeFeature === 'dictionary' && 'Dictionary'}
                  {activeFeature === 'summarizer' && 'Summarizer'}
                  {activeFeature === 'paraphraser' && 'Paraphraser'}
                  {activeFeature === 'history' && 'Translation History'}
                  {activeFeature === 'learning' && 'Learning Mode'}
                </h1>
                <div className="flex items-center space-x-4">
                  <Link 
                    href="/tools" 
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    View All Tools
                  </Link>
                  <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                  >
                    {isDarkMode ? <FaSun /> : <FaMoon />}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>

              {activeFeature === 'translator' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <select
                          value={sourceLang}
                          onChange={(e) => setSourceLang(e.target.value)}
                          className="input-field bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                        >
                          {languages.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                              {lang.flag} {lang.name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={startListening}
                          className={`ml-2 btn ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                        >
                          <FaMicrophone />
                        </button>
                      </div>
                      
                      <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Enter text to translate..."
                        className="input-field h-48 resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </div>

                    {/* Output Section */}
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <select
                          value={targetLang}
                          onChange={(e) => setTargetLang(e.target.value)}
                          className="input-field bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                        >
                          {languages.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                              {lang.flag} {lang.name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => speakText(outputText)}
                          disabled={!outputText}
                          className="ml-2 btn bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaVolumeUp />
                        </button>
                      </div>

                      <div className="relative">
                        <textarea
                          value={outputText}
                          readOnly
                          placeholder="Translation will appear here..."
                          className="input-field h-48 resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        {isLoading && (
                          <motion.div
                            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 dark:bg-opacity-20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <div className="loader text-blue-500 dark:text-blue-400">Translating...</div>
                          </motion.div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={copyToClipboard}
                          disabled={!outputText}
                          className="btn flex-1 bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaCopy className="inline mr-2" /> Copy
                        </button>
                        <button
                          onClick={downloadTranscript}
                          disabled={!outputText}
                          className="btn flex-1 bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaDownload className="inline mr-2" /> Download
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Translate Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={handleTranslate}
                      disabled={!inputText.trim()}
                      className="px-12 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Translate
                    </button>
                  </div>
                </div>
              )}
              
              {activeFeature === 'history' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                  <TranslationHistoryPanel userId={userId} limit={20} />
                </div>
              )}
              
              {activeFeature === 'grammar' && <GrammarCheck />}
              {activeFeature === 'dictionary' && <Dictionary />}
              {activeFeature === 'summarizer' && <Summarizer />}
              {activeFeature === 'paraphraser' && <Paraphraser />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
