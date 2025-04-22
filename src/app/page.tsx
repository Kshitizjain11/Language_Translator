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
import { useTheme } from '@/context/ThemeContext';

const languages = [
  { code: 'auto', name: 'Auto detect', flag: '🔄' },
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
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [userId, setUserId] = useState<string | null>(null);
  const [activeFeature, setActiveFeature] = useState('translator');
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [sourceLang, setSourceLang] = useState('auto')
  const [targetLang, setTargetLang] = useState('es')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isAutoTranslate, setIsAutoTranslate] = useState(false)
  const [detectedLang, setDetectedLang] = useState('')
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

  const handleInputChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setInputText(newText);
    
    // Auto detect language when text is entered and source is set to auto
    if (sourceLang === 'auto' && newText.trim().length > 5) {
      try {
        const response = await fetch('/api/detect-language', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: newText })
        });
        const data = await response.json();
        setDetectedLang(data.detectedLanguage);
      } catch (error) {
        console.error('Language detection error:', error);
      }
    }
    
    if (isAutoTranslate && newText.trim()) {
      await translateText(newText, false);
    }
  };

  const translateText = async (text: string, saveToHistory: boolean = true) => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          sourceLang: languages.find(l => l.code === sourceLang)?.name || 'English',
          targetLang: languages.find(l => l.code === targetLang)?.name || 'Spanish'
        })
      });
      
      const data = await response.json();
      setOutputText(data.translation);
      
      if (saveToHistory) {
        // Create translation record
        const translation = {
          id: Math.random().toString(36).substr(2, 9),
          userId,
          sourceText: text,
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
            sourceText: text,
            targetText: data.translation,
            sourceLang: languages.find((l) => l.code === sourceLang)?.name || 'English',
            targetLang: languages.find((l) => l.code === targetLang)?.name || 'Spanish',
          }),
        });
      }
    } catch (error) {
      console.error('Translation error:', error);
      setOutputText('Error during translation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslate = async () => {
    await translateText(inputText);
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="flex">
        <FeaturePanel activeFeature={activeFeature} setActiveFeature={setActiveFeature} />
        <div className="flex-1">
          <div className="p-4 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">
                {activeFeature.charAt(0).toUpperCase() + activeFeature.slice(1)}
              </h1>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-700 text-gray-300"
              >
                {isDarkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {activeFeature === 'translator' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Input Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <div className="relative flex-grow">
                        <select
                          value={sourceLang}
                          onChange={(e) => setSourceLang(e.target.value)}
                          className="w-full input-field bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 pr-12"
                        >
                          {languages.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                              {lang.flag} {lang.name}
                            </option>
                          ))}
                        </select>
                        {sourceLang === 'auto' && detectedLang && (
                          <div className="absolute right-0 top-0 h-full flex items-center pr-3">
                            <span className="text-sm text-blue-500 dark:text-blue-400">
                              Detected: {languages.find(l => l.code === detectedLang)?.flag}
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={startListening}
                        className={`ml-2 btn ${
                          isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                        } text-white transition-colors duration-200 flex items-center justify-center w-10 h-10 rounded-full`}
                      >
                        <FaMicrophone className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <textarea
                      value={inputText}
                      onChange={handleInputChange}
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

                {/* Translate Button and Auto Translate Toggle */}
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setIsAutoTranslate(!isAutoTranslate)}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      isAutoTranslate
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200'
                    }`}
                  >
                    {isAutoTranslate ? 'Auto Translate On' : 'Auto Translate Off'}
                  </button>
                  <button
                    onClick={handleTranslate}
                    disabled={!inputText.trim() || isAutoTranslate}
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
  )
}
