'use client'

import React, { useState, useRef } from 'react'
import { FaMicrophone, FaVolumeUp, FaCopy, FaDownload, FaMoon, FaSun } from 'react-icons/fa'
import { motion } from 'framer-motion'
import CountryFlagInfo from './CountryFlagInfo'

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
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [sourceLang, setSourceLang] = useState('en')
  const [targetLang, setTargetLang] = useState('es')
  const [isLoading, setIsLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isListening, setIsListening] = useState(false)

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
    <div className={`min-h-screen p-4 md:p-8 ${isDarkMode ? 'dark' : ''}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Language Translator
          </h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {isDarkMode ? <FaSun className="text-white" /> : <FaMoon />}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="input-field"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
              <CountryFlagInfo flag={languages.find(l => l.code === sourceLang)?.flag || ''} name={languages.find(l => l.code === sourceLang)?.name || ''} />
              <button
                onClick={startListening}
                className={`ml-2 btn ${isListening ? 'bg-red-500' : 'bg-blue-500'} text-white`}
              >
                <FaMicrophone />
              </button>
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to translate..."
              className="input-field h-48 resize-none"
            />
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="input-field"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
              <CountryFlagInfo flag={languages.find(l => l.code === targetLang)?.flag || ''} name={languages.find(l => l.code === targetLang)?.name || ''} />
              <button
                onClick={() => speakText(outputText)}
                disabled={!outputText}
                className="ml-2 btn bg-blue-500 text-white disabled:opacity-50"
              >
                <FaVolumeUp />
              </button>
            </div>

            <div className="relative">
              <textarea
                value={outputText}
                readOnly
                placeholder="Translation will appear here..."
                className="input-field h-48 resize-none"
              />
              {isLoading && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="loader">Translating...</div>
                </motion.div>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={copyToClipboard}
                disabled={!outputText}
                className="btn btn-primary flex-1"
              >
                <FaCopy className="inline mr-2" /> Copy
              </button>
              <button
                onClick={downloadTranscript}
                disabled={!outputText}
                className="btn btn-primary flex-1"
              >
                <FaDownload className="inline mr-2" /> Download
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleTranslate}
          disabled={!inputText.trim()}
          className="mt-6 btn btn-primary w-full"
        >
          Translate
        </button>
      </div>
    </div>
  )
}
