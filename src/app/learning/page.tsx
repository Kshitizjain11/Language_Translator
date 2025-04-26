'use client';

import React, { useState, useEffect, useRef } from 'react';
import Flashcard from '@/components/learning/Flashcard';
import Quiz from '@/components/learning/Quiz';
import ProgressReport from '@/components/learning/ProgressReport';
import Sidebar from '@/components/learning/Sidebar';
import VocabularyTrainer from '@/components/learning/VocabularyTrainer';
import PronunciationPractice from '@/components/learning/PronunciationPractice';
import Lessons from '@/components/learning/Lessons';
import Notebook from '@/components/learning/Notebook';
import TranslationHistoryPanel from '@/components/learning/TranslationHistoryPanel';
import GrammarCheck from '@/components/features/GrammarCheck';
import Dictionary from '@/components/features/Dictionary';
import Summarizer from '@/components/features/Summarizer';
import Paraphraser from '@/components/features/Paraphraser';
import { FaClock, FaChartLine, FaTrophy, FaMicrophone, FaVolumeUp, FaCopy, FaDownload, FaMoon, FaSun, FaSync, FaSearch } from 'react-icons/fa';
import AuthGuard from '@/components/AuthGuard';
import FeaturePanel from '@/components/leftPanel/FeaturePanel';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import type { Translation, FlashCard } from '@/types/learning';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Simulated user ID (replace with actual auth)
const USER_ID = 'user123';

type Difficulty = 'easy' | 'medium' | 'hard';
type ActiveTab = 'progress' | 'flashcards' | 'quiz' | 'vocabulary' | 'pronunciation' | 'lessons' | 'notebook';
type Feature = 'translator' | 'grammar' | 'dictionary' | 'summarizer' | 'paraphraser' | 'history' | 'learning' | 'progress' | 'flashcards' | 'quiz' | 'vocabulary' | 'pronunciation' | 'lessons' | 'notebook';

interface DifficultyOption {
  color: string;
  hoverColor: string;
  icon: JSX.Element;
  description: string;
}

interface Language {
  code: string;
  name: string;
  flag: string;
  display?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

const languages: Language[] = [
  { code: 'auto', name: 'Auto detect', flag: '🔄', display: '🔄 Auto detect' },
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦', display: '🇿🇦 Afrikaans' },
  // ... existing code ...
];

// Custom Language Selector Component
const LanguageSelector = ({ 
  isSource = false, 
  value, 
  onChange, 
  isOpen, 
  setIsOpen, 
  languages,
  detectedLang 
}: { 
  isSource?: boolean, 
  value: string, 
  onChange: (code: string) => void,
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
  languages: Language[],
  detectedLang?: string
}) => {
  const selectedLang = languages.find(l => l.code === value)
  const [localSearch, setLocalSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [setIsOpen])
  
  const filteredLangs = languages
    .filter(lang => isSource || lang.code !== 'auto')
    .filter(lang => 
      lang.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      lang.code.toLowerCase().includes(localSearch.toLowerCase())
    )

  const detectedLanguage = detectedLang ? languages.find(l => l.code === detectedLang) : null

  return (
    <div className="relative flex-grow" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full input-field bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 pr-12 text-left flex items-center"
      >
        <span className="mr-2">{selectedLang?.flag}</span>
        <span>
          {isSource && value === 'auto' && detectedLanguage
            ? `Auto (${detectedLanguage.name})`
            : selectedLang?.name}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-96 overflow-hidden">
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search languages..."
                className="w-full px-3 py-2 pl-10 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                autoFocus
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="overflow-y-auto max-h-80">
            {filteredLangs.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onChange(lang.code)
                  setIsOpen(false)
                  setLocalSearch('')
                }}
                className={`w-full px-4 py-2 text-left flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  value === lang.code ? 'bg-blue-50 dark:bg-blue-900' : ''
                }`}
              >
                <span className="mr-2 text-lg">{lang.flag}</span>
                <span className="text-gray-900 dark:text-white">{lang.name}</span>
                <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">({lang.code})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isSource && value === 'auto' && detectedLang && (
        <div className="absolute left-0 -bottom-8 bg-blue-500 dark:bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center space-x-2">
          <span>Detected:</span>
          <span className="font-medium flex items-center">
            {languages.find(l => l.code === detectedLang)?.flag}
            <span className="ml-1">{languages.find(l => l.code === detectedLang)?.name}</span>
          </span>
        </div>
      )}
    </div>
  )
}

export default function LearningPage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'translate' | 'learn'>('learn');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('es');
  const [isSourceLangOpen, setIsSourceLangOpen] = useState(false);
  const [isTargetLangOpen, setIsTargetLangOpen] = useState(false);
  const [detectedLang, setDetectedLang] = useState<string | undefined>(undefined);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAutoTranslate, setIsAutoTranslate] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationHistory, setTranslationHistory] = useState<Translation[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLearningMode, setIsLearningMode] = useState(false);
  const [learningSidebarOpen, setLearningSidebarOpen] = useState(false);
  const hideTimer = React.useRef<NodeJS.Timeout | null>(null);
  const [activeFeature, setActiveFeature] = useState<Feature>('progress');
  const [flashcards, setFlashcards] = useState<FlashCard[]>([]);
  const [translations, setTranslations] = useState<Record<string, Translation>>({});
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>({
    code: 'es',
    name: 'Spanish',
    flag: '🇪🇸'
  });
  const router = useRouter();

  const difficultySettings: Record<Difficulty, DifficultyOption> = {
    easy: {
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      icon: <FaClock className="h-6 w-6" />,
      description: '5 questions • 30 seconds per question • Basic translations'
    },
    medium: {
      color: 'bg-yellow-500',
      hoverColor: 'hover:bg-yellow-600',
      icon: <FaChartLine className="h-6 w-6" />,
      description: '10 questions • 45 seconds per question • Intermediate phrases'
    },
    hard: {
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      icon: <FaTrophy className="h-6 w-6" />,
      description: '15 questions • 60 seconds per question • Advanced sentences'
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Fetch flashcards
      const flashcardsRes = await fetch(`/api/learning?userId=${USER_ID}&type=flashcards`);
      const flashcardsData = await flashcardsRes.json();
      setFlashcards(flashcardsData.flashcards);

      // Fetch translations for flashcards
      if (flashcardsData.flashcards.length > 0) {
        const translationIds = flashcardsData.flashcards.map((f: FlashCard) => f.translationId);
        const translationsRes = await fetch(`/api/learning/translations?ids=${translationIds.join(',')}`);
        const translationsData = await translationsRes.json();
        
        const translationsMap: Record<string, Translation> = {};
        translationsData.translations.forEach((t: Translation) => {
          translationsMap[t.id] = t;
        });
        setTranslations(translationsMap);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleFlashcardResult = async (flashcard: FlashCard, result: 'easy' | 'medium' | 'hard') => {
    try {
      const response = await fetch('/api/learning/flashcard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flashcardId: flashcard.id, result }),
      });
      
      if (response.ok) {
        fetchUserData();
      }
    } catch (error) {
      console.error('Error updating flashcard:', error);
    }
  };

  const handleQuizComplete = async (score: number, totalQuestions: number) => {
    try {
      await fetch('/api/learning/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: USER_ID, 
          quizScore: score,
          totalQuestions,
          difficulty: selectedDifficulty || 'easy'  // Default to 'easy' if null
        }),
      });
      setSelectedDifficulty(null);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    
    if (text.trim() && sourceLang === 'auto') {
      try {
        const response = await fetch('/api/detect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setDetectedLang(data.language);
        }
      } catch (error) {
        console.error('Error detecting language:', error);
      }
    }
  };

  const translateText = async (text: string, saveToHistory: boolean = true) => {
    if (!text.trim()) {
      setOutputText('');
      return;
    }

    setIsTranslating(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          sourceLang: sourceLang === 'auto' ? detectedLang || 'en' : sourceLang,
          targetLang,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOutputText(data.translatedText);
        
        if (saveToHistory) {
          const newTranslation: Translation = {
            id: Date.now().toString(),
            userId: USER_ID,
            sourceText: text,
            targetText: data.translatedText,
            sourceLang: sourceLang === 'auto' ? detectedLang || 'en' : sourceLang,
            targetLang,
            frequency: 1,
            lastTranslated: new Date(),
            createdAt: new Date(),
          };
          
          setTranslationHistory(prev => [newTranslation, ...prev]);
          
          // Save to localStorage
          const history = JSON.parse(localStorage.getItem('translationHistory') || '[]');
          localStorage.setItem('translationHistory', JSON.stringify([newTranslation, ...history]));
        }
      }
    } catch (error) {
      console.error('Error translating text:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTranslate = async () => {
    await translateText(inputText);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = languages.find(l => l.code === sourceLang)?.code || 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      translateText(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const speakText = (text: string) => {
    if (!text) return;
    
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languages.find(l => l.code === targetLang)?.code || 'en-US';
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
  };

  const downloadTranscript = () => {
    const element = document.createElement('a');
    const file = new Blob([outputText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'translation.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleReverseLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(outputText);
    setOutputText(inputText);
  };

  // Show sidebar immediately
  const handleSidebarShow = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setLearningSidebarOpen(true);
  };

  // Hide sidebar with a slight delay
  const handleSidebarHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setLearningSidebarOpen(false), 180);
  };

  const handleFeatureChange = (feature: Feature) => {
    setActiveFeature(feature);
    if (feature === 'learning') {
      setLearningSidebarOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    router.push('/login');
  };

  // --- DEMO FLASHCARDS DATA ---
  const demoFlashcards: FlashCard[] = [
    {
      id: '1',
      translationId: '1',
      nextReviewDate: new Date(),
      easeFactor: 2.5,
      interval: 1,
      streak: 0,
    },
    {
      id: '2',
      translationId: '2',
      nextReviewDate: new Date(),
      easeFactor: 2.5,
      interval: 1,
      streak: 0,
    },
    {
      id: '3',
      translationId: '3',
      nextReviewDate: new Date(),
      easeFactor: 2.5,
      interval: 1,
      streak: 0,
    },
  ];

  const demoTranslations: Translation[] = [
    {
      id: '1',
      userId: 'demo',
      sourceText: 'Hello',
      targetText: 'Hola',
      sourceLang: 'en',
      targetLang: 'es',
      frequency: 10,
      lastTranslated: new Date(),
      createdAt: new Date(),
    },
    {
      id: '2',
      userId: 'demo',
      sourceText: 'Thank you',
      targetText: 'Gracias',
      sourceLang: 'en',
      targetLang: 'es',
      frequency: 8,
      lastTranslated: new Date(),
      createdAt: new Date(),
    },
    {
      id: '3',
      userId: 'demo',
      sourceText: 'Dog',
      targetText: 'Perro',
      sourceLang: 'en',
      targetLang: 'es',
      frequency: 7,
      lastTranslated: new Date(),
      createdAt: new Date(),
    },
  ];

  const getFlashcardsToShow = () => {
    if (flashcards.length > 0 && Object.keys(translations).length > 0) {
      return flashcards.map(fc => ({
        flashcard: fc,
        translation: translations[fc.translationId]
      })).filter(pair => !!pair.translation);
    }
    // fallback to demo
    return demoFlashcards.map((fc, i) => ({
      flashcard: fc,
      translation: demoTranslations[i]
    }));
  };

  const renderContent = () => {
    switch (activeFeature) {
      case 'translator':
        return (
          <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-white mb-8">Translator</h1>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <button
                    onClick={() => setIsSourceLangOpen(!isSourceLangOpen)}
                    className="w-full text-left px-4 py-3 rounded-2xl bg-[#1a1f25] text-gray-300 hover:bg-[#22272e] transition-colors flex items-center"
                  >
                    <span className="mr-2">🔄</span>
                    <span>Auto detect</span>
                  </button>
                  {isSourceLangOpen && (
                    <LanguageSelector
                      isSource
                      value={sourceLang}
                      onChange={setSourceLang}
                      isOpen={isSourceLangOpen}
                      setIsOpen={setIsSourceLangOpen}
                      languages={languages}
                      detectedLang={detectedLang}
                    />
                  )}
                </div>
                <button
                  onClick={startListening}
                  className={`p-3 rounded-full ${
                    isListening ? 'bg-red-500' : 'bg-[#4285f4]'
                  } text-white hover:opacity-90 transition-opacity`}
                >
                  <FaMicrophone className="w-5 h-5" />
                </button>
                <div className="flex-1">
                  <button
                    onClick={() => setIsTargetLangOpen(!isTargetLangOpen)}
                    className="w-full text-left px-4 py-3 rounded-2xl bg-[#1a1f25] text-gray-300 hover:bg-[#22272e] transition-colors flex items-center"
                  >
                    <span className="mr-2">es</span>
                    <span>Spanish</span>
                  </button>
                  {isTargetLangOpen && (
                    <LanguageSelector
                      value={targetLang}
                      onChange={setTargetLang}
                      isOpen={isTargetLangOpen}
                      setIsOpen={setIsTargetLangOpen}
                      languages={languages}
                    />
                  )}
                </div>
                <button
                  onClick={handleReverseLanguages}
                  className="p-3 rounded-full bg-[#1f4b8d] text-white hover:opacity-90 transition-opacity"
                >
                  <FaSync className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <textarea
                    value={inputText}
                    onChange={handleInputChange}
                    placeholder="Enter text to translate..."
                    className="w-full h-48 p-4 rounded-2xl bg-[#1a1f25] text-gray-300 placeholder-gray-500 border-none focus:ring-0 resize-none"
                  />
                </div>
                <div className="relative">
                  <div className="w-full h-48 p-4 rounded-2xl bg-[#1a1f25] text-gray-300">
                    {isTranslating ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#4285f4] border-t-transparent"></div>
                      </div>
                    ) : (
                      <span className="text-gray-500">
                        {outputText || "Translation will appear here..."}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-16 right-0 flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      disabled={!outputText}
                      className="px-6 py-3 rounded-lg bg-[#1f4b8d] text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 w-[200px] justify-center"
                    >
                      <FaCopy className="w-5 h-5" />
                      <span>Copy</span>
                    </button>
                    <button
                      onClick={downloadTranscript}
                      disabled={!outputText}
                      className="px-6 py-3 rounded-lg bg-[#1f4b8d] text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 w-[200px] justify-center"
                    >
                      <FaDownload className="w-5 h-5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center gap-4 mt-20">
                <button
                  onClick={() => setIsAutoTranslate(!isAutoTranslate)}
                  className={`px-6 py-3 rounded-lg ${
                    isAutoTranslate ? 'bg-[#4285f4]' : 'bg-[#1a1f25]'
                  } text-white hover:opacity-90 transition-opacity min-w-[200px]`}
                >
                  Auto Translate {isAutoTranslate ? 'On' : 'Off'}
                </button>
                <button
                  onClick={handleTranslate}
                  disabled={!inputText.trim() || isTranslating}
                  className="px-6 py-3 rounded-lg bg-[#1f4b8d] text-white hover:opacity-90 transition-opacity disabled:opacity-50 min-w-[200px]"
                >
                  Translate
                </button>
              </div>
            </div>
          </div>
        );

      case 'progress':
        return (
          <div className="p-6">
            <ProgressReport userId={USER_ID} />
          </div>
        );

      case 'flashcards':
        const flashcardsToShow = getFlashcardsToShow();
        return (
          <div className="p-6 space-y-6">
            {flashcardsToShow.map(({ flashcard, translation }) => (
              <Flashcard
                key={flashcard.id}
                flashcard={flashcard}
                translation={translation}
                onResult={() => {}}
              />
            ))}
          </div>
        );

      case 'quiz':
        if (!selectedDifficulty) {
          return (
            <div className="p-6 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Select Quiz Difficulty</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(Object.keys(difficultySettings) as Difficulty[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedDifficulty(level)}
                    className={`p-6 rounded-xl shadow-lg transition-all ${
                      difficultySettings[level].color
                    } ${difficultySettings[level].hoverColor} text-white`}
                  >
                    <div className="flex items-center justify-center mb-4">
                      {difficultySettings[level].icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2 capitalize">{level}</h3>
                    <p className="text-sm opacity-90">
                      {difficultySettings[level].description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          );
        }
        return (
          <div className="p-6">
            <Quiz
              userId={USER_ID}
              difficulty={selectedDifficulty}
              sourceLang="en"
              targetLang="es"
              onComplete={handleQuizComplete}
            />
          </div>
        );

      case 'vocabulary':
        return (
          <div className="p-6">
            <VocabularyTrainer userId={USER_ID} />
          </div>
        );

      case 'pronunciation':
        return (
          <div className="p-6">
            <PronunciationPractice userId={USER_ID} />
          </div>
        );

      case 'lessons':
        return (
          <div className="p-6">
            <Lessons userId={USER_ID} />
          </div>
        );
            
      case 'notebook':
        return (
          <div className="p-6">
            <Notebook selectedLanguage={selectedLanguage} />
          </div>
        );

      case 'history':
        return (
          <div className="p-6">
            <TranslationHistoryPanel userId={userId || ''} limit={20} />
          </div>
        );

      case 'grammar':
        return (
          <div className="p-6">
            <GrammarCheck />
          </div>
        );

      case 'dictionary':
        return (
          <div className="p-6">
            <Dictionary />
          </div>
        );

      case 'summarizer':
        return (
          <div className="p-6">
            <Summarizer />
          </div>
        );

      case 'paraphraser':
        return (
          <div className="p-6">
            <Paraphraser />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <nav className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                  Language Translator
                </Link>
                <div className="hidden md:flex space-x-4">
                  <button
                    onClick={() => setActiveTab('translate')}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === 'translate'
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Translate
                  </button>
                  <button
                    onClick={() => setActiveTab('learn')}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === 'learn'
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Learn
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {isDarkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex min-h-[calc(100vh-4rem)]">
          <FeaturePanel 
            activeFeature={activeFeature} 
            setActiveFeature={handleFeatureChange}
            onLearningHoverStart={handleSidebarShow}
            onLearningHoverEnd={handleSidebarHide}
          />
          <main className="flex-1 flex flex-col">
            <div className="flex h-full relative">
              {/* Hover bridge: invisible div between button and sidebar */}
              <div
                className="absolute left-64 top-0 h-48 z-30"
                style={{ width: '18px' }}
                onMouseEnter={handleSidebarShow}
                onMouseLeave={handleSidebarHide}
              />
              <div className="absolute left-0 top-0 h-full z-20" style={{ width: '16rem' }}>
                <Sidebar 
                  activeTab={activeFeature as ActiveTab} 
                  setActiveTab={(tab) => setActiveFeature(tab)}
                  onLearningHoverStart={handleSidebarShow}
                  onLearningHoverEnd={handleSidebarHide}
                  visible={learningSidebarOpen}
                />
              </div>
              <div className="flex-1 p-6 ml-8">
                {renderContent()}
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
