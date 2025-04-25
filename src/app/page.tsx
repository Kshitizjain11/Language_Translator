'use client'

import React, { useState, useRef, useEffect, Suspense } from 'react'
import { FaMicrophone, FaVolumeUp, FaCopy, FaDownload, FaMoon, FaSun, FaSync, FaSearch, FaClock, FaChartLine, FaTrophy } from 'react-icons/fa'
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
import LearningMode from '@/components/learning/LearningMode'
import LearningDashboard from '@/components/learning/LearningDashboard'
import ProgressReport from '@/components/learning/ProgressReport';
import Flashcard from '@/components/learning/Flashcard';
import Quiz from '@/components/learning/Quiz';
import VocabularyTrainer from '@/components/learning/VocabularyTrainer';
import PronunciationPractice from '@/components/learning/PronunciationPractice';
import Lessons from '@/components/learning/Lessons';
import Notebook from '@/components/learning/Notebook';
import type { Translation, FlashCard } from '@/types/learning';

interface Language {
  code: string;
  name: string;
  flag: string;
  display: string;
}

const languages: Language[] = [
  { code: 'auto', name: 'Auto detect', flag: '🔄', display: '🔄 Auto detect' },
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦', display: '🇿🇦 Afrikaans' },
  { code: 'sq', name: 'Albanian', flag: '🇦🇱', display: '🇦🇱 Albanian' },
  { code: 'am', name: 'Amharic', flag: '🇪🇹', display: '🇪🇹 Amharic' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', display: '🇸🇦 Arabic' },
  { code: 'hy', name: 'Armenian', flag: '🇦🇲', display: '🇦🇲 Armenian' },
  { code: 'az', name: 'Azerbaijani', flag: '🇦🇿', display: '🇦🇿 Azerbaijani' },
  { code: 'eu', name: 'Basque', flag: '🏴󠁥󠁳󠁰󠁶󠁿', display: '🏴󠁥󠁳󠁰󠁶󠁿 Basque' },
  { code: 'be', name: 'Belarusian', flag: '🇧🇾', display: '🇧🇾 Belarusian' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩', display: '🇧🇩 Bengali' },
  { code: 'bs', name: 'Bosnian', flag: '🇧🇦', display: '🇧🇦 Bosnian' },
  { code: 'bg', name: 'Bulgarian', flag: '🇧🇬', display: '🇧🇬 Bulgarian' },
  { code: 'ca', name: 'Catalan', flag: '🏴󠁥󠁳󠁣󠁴󠁿', display: '🏴󠁥󠁳󠁣󠁴󠁿 Catalan' },
  { code: 'ceb', name: 'Cebuano', flag: '🇵🇭', display: '🇵🇭 Cebuano' },
  { code: 'zh', name: 'Chinese (Simplified)', flag: '🇨🇳', display: '🇨🇳 Chinese (Simplified)' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', flag: '🇹🇼', display: '🇹🇼 Chinese (Traditional)' },
  { code: 'co', name: 'Corsican', flag: '🇫🇷', display: '🇫🇷 Corsican' },
  { code: 'hr', name: 'Croatian', flag: '🇭🇷', display: '🇭🇷 Croatian' },
  { code: 'cs', name: 'Czech', flag: '🇨🇿', display: '🇨🇿 Czech' },
  { code: 'da', name: 'Danish', flag: '🇩🇰', display: '🇩🇰 Danish' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', display: '🇳🇱 Dutch' },
  { code: 'en', name: 'English', flag: '🇺🇸', display: '🇺🇸 English' },
  { code: 'eo', name: 'Esperanto', flag: '🌍', display: '🌍 Esperanto' },
  { code: 'et', name: 'Estonian', flag: '🇪🇪', display: '🇪🇪 Estonian' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮', display: '🇫🇮 Finnish' },
  { code: 'fr', name: 'French', flag: '🇫🇷', display: '🇫🇷 French' },
  { code: 'fy', name: 'Frisian', flag: '🇳🇱', display: '🇳🇱 Frisian' },
  { code: 'gl', name: 'Galician', flag: '🇪🇸', display: '🇪🇸 Galician' },
  { code: 'ka', name: 'Georgian', flag: '🇬🇪', display: '🇬🇪 Georgian' },
  { code: 'de', name: 'German', flag: '🇩🇪', display: '🇩🇪 German' },
  { code: 'el', name: 'Greek', flag: '🇬🇷', display: '🇬🇷 Greek' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳', display: '🇮🇳 Gujarati' },
  { code: 'ht', name: 'Haitian Creole', flag: '🇭🇹', display: '🇭🇹 Haitian Creole' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬', display: '🇳🇬 Hausa' },
  { code: 'haw', name: 'Hawaiian', flag: '🌺', display: '🌺 Hawaiian' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱', display: '🇮🇱 Hebrew' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', display: '🇮🇳 Hindi' },
  { code: 'hmn', name: 'Hmong', flag: '🌏', display: '🌏 Hmong' },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺', display: '🇭🇺 Hungarian' },
  { code: 'is', name: 'Icelandic', flag: '🇮🇸', display: '🇮🇸 Icelandic' },
  { code: 'ig', name: 'Igbo', flag: '🇳🇬', display: '🇳🇬 Igbo' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩', display: '🇮🇩 Indonesian' },
  { code: 'ga', name: 'Irish', flag: '🇮🇪', display: '🇮🇪 Irish' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', display: '🇮🇹 Italian' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', display: '🇯🇵 Japanese' },
  { code: 'jv', name: 'Javanese', flag: '🇮🇩', display: '🇮🇩 Javanese' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳', display: '🇮🇳 Kannada' },
  { code: 'kk', name: 'Kazakh', flag: '🇰🇿', display: '🇰🇿 Kazakh' },
  { code: 'km', name: 'Khmer', flag: '🇰🇭', display: '🇰🇭 Khmer' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', display: '🇰🇷 Korean' },
  { code: 'ku', name: 'Kurdish', flag: '🏳️', display: '🏳️ Kurdish' },
  { code: 'ky', name: 'Kyrgyz', flag: '🇰🇬', display: '🇰🇬 Kyrgyz' },
  { code: 'lo', name: 'Lao', flag: '🇱🇦', display: '🇱🇦 Lao' },
  { code: 'la', name: 'Latin', flag: '🏛️', display: '🏛️ Latin' },
  { code: 'lv', name: 'Latvian', flag: '🇱🇻', display: '🇱🇻 Latvian' },
  { code: 'lt', name: 'Lithuanian', flag: '🇱🇹', display: '🇱🇹 Lithuanian' },
  { code: 'lb', name: 'Luxembourgish', flag: '🇱🇺', display: '🇱🇺 Luxembourgish' },
  { code: 'mk', name: 'Macedonian', flag: '🇲🇰', display: '🇲🇰 Macedonian' },
  { code: 'mg', name: 'Malagasy', flag: '🇲🇬', display: '🇲🇬 Malagasy' },
  { code: 'ms', name: 'Malay', flag: '🇲🇾', display: '🇲🇾 Malay' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳', display: '🇮🇳 Malayalam' },
  { code: 'mt', name: 'Maltese', flag: '🇲🇹', display: '🇲🇹 Maltese' },
  { code: 'mi', name: 'Maori', flag: '🇳🇿', display: '🇳🇿 Maori' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳', display: '🇮🇳 Marathi' },
  { code: 'mn', name: 'Mongolian', flag: '🇲🇳', display: '🇲🇳 Mongolian' },
  { code: 'my', name: 'Myanmar (Burmese)', flag: '🇲🇲', display: '🇲🇲 Myanmar (Burmese)' },
  { code: 'ne', name: 'Nepali', flag: '🇳🇵', display: '🇳🇵 Nepali' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴', display: '🇳🇴 Norwegian' },
  { code: 'ny', name: 'Nyanja (Chichewa)', flag: '🇲🇼', display: '🇲🇼 Nyanja (Chichewa)' },
  { code: 'or', name: 'Odia (Oriya)', flag: '��🇳', display: '🇮🇳 Odia (Oriya)' },
  { code: 'ps', name: 'Pashto', flag: '🇦🇫', display: '🇦🇫 Pashto' },
  { code: 'fa', name: 'Persian', flag: '🇮🇷', display: '🇮🇷 Persian' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱', display: '🇵🇱 Polish' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', display: '🇵🇹 Portuguese' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳', display: '🇮🇳 Punjabi' },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴', display: '🇷🇴 Romanian' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', display: '🇷🇺 Russian' },
  { code: 'sm', name: 'Samoan', flag: '🇼🇸', display: '🇼🇸 Samoan' },
  { code: 'gd', name: 'Scots Gaelic', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', display: '🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scots Gaelic' },
  { code: 'sr', name: 'Serbian', flag: '🇷🇸', display: '🇷🇸 Serbian' },
  { code: 'st', name: 'Sesotho', flag: '🇱🇸', display: '🇱🇸 Sesotho' },
  { code: 'sn', name: 'Shona', flag: '🇿🇼', display: '🇿🇼 Shona' },
  { code: 'sd', name: 'Sindhi', flag: '🇵🇰', display: '🇵🇰 Sindhi' },
  { code: 'si', name: 'Sinhala (Sinhalese)', flag: '🇱🇰', display: '🇱🇰 Sinhala' },
  { code: 'sk', name: 'Slovak', flag: '🇸🇰', display: '🇸🇰 Slovak' },
  { code: 'sl', name: 'Slovenian', flag: '🇸🇮', display: '🇸🇮 Slovenian' },
  { code: 'so', name: 'Somali', flag: '🇸🇴', display: '🇸🇴 Somali' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', display: '🇪🇸 Spanish' },
  { code: 'su', name: 'Sundanese', flag: '🇮🇩', display: '🇮🇩 Sundanese' },
  { code: 'sw', name: 'Swahili', flag: '🇹🇿', display: '🇹🇿 Swahili' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪', display: '🇸🇪 Swedish' },
  { code: 'tl', name: 'Tagalog (Filipino)', flag: '🇵🇭', display: '🇵🇭 Tagalog' },
  { code: 'tg', name: 'Tajik', flag: '🇹🇯', display: '🇹🇯 Tajik' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳', display: '🇮🇳 Tamil' },
  { code: 'tt', name: 'Tatar', flag: '🇷🇺', display: '🇷🇺 Tatar' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳', display: '🇮🇳 Telugu' },
  { code: 'th', name: 'Thai', flag: '🇹🇭', display: '🇹🇭 Thai' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', display: '🇹🇷 Turkish' },
  { code: 'tk', name: 'Turkmen', flag: '🇹🇲', display: '🇹🇲 Turkmen' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦', display: '🇺🇦 Ukrainian' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰', display: '🇵🇰 Urdu' },
  { code: 'ug', name: 'Uyghur', flag: '🇨🇳', display: '🇨🇳 Uyghur' },
  { code: 'uz', name: 'Uzbek', flag: '🇺🇿', display: '🇺🇿 Uzbek' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', display: '🇻🇳 Vietnamese' },
  { code: 'cy', name: 'Welsh', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', display: '🏴󠁧󠁢󠁷󠁬󠁳󠁿 Welsh' },
  { code: 'xh', name: 'Xhosa', flag: '🇿🇦', display: '🇿🇦 Xhosa' },
  { code: 'yi', name: 'Yiddish', flag: '🌍', display: '🌍 Yiddish' },
  { code: 'yo', name: 'Yoruba', flag: '🇳🇬', display: '🇳🇬 Yoruba' },
  { code: 'zu', name: 'Zulu', flag: '🇿🇦', display: '🇿🇦 Zulu' }
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

type Difficulty = 'easy' | 'medium' | 'hard';
type Feature = 'translator' | 'grammar' | 'dictionary' | 'summarizer' | 'paraphraser' | 'history' | 'learning' | 'progress' | 'flashcards' | 'quiz' | 'vocabulary' | 'pronunciation' | 'lessons' | 'notebook';
type LearningTab = 'progress' | 'flashcards' | 'quiz' | 'vocabulary' | 'pronunciation' | 'lessons' | 'notebook';

interface DifficultyOption {
  color: string;
  hoverColor: string;
  icon: JSX.Element;
  description: string;
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

export default function Home() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [userId, setUserId] = useState<string | null>(null);
  const [activeFeature, setActiveFeature] = useState<Feature>('translator');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('es');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isAutoTranslate, setIsAutoTranslate] = useState(false);
  const [detectedLang, setDetectedLang] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSourceDropdownOpen, setIsSourceDropdownOpen] = useState(false);
  const [isTargetDropdownOpen, setIsTargetDropdownOpen] = useState(false);
  const sourceDropdownRef = useRef<HTMLDivElement>(null);
  const targetDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isRotating, setIsRotating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationHistory, setTranslationHistory] = useState<Translation[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [flashcards, setFlashcards] = useState<FlashCard[]>([]);
  const [translations, setTranslations] = useState<Record<string, Translation>>({});
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>({
    code: 'es',
    name: 'Spanish',
    flag: '🇪🇸',
    display: '🇪🇸 Spanish'
  });

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

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleReverseLanguages = () => {
    setIsRotating(true)
    const tempLang = sourceLang
    setSourceLang(targetLang)
    setTargetLang(tempLang)
    const tempText = inputText
    setInputText(outputText)
    setOutputText(tempText)
    setTimeout(() => setIsRotating(false), 500)
  }

  const handleFlashcardResult = async (flashcard: FlashCard, result: 'easy' | 'medium' | 'hard') => {
    try {
      const response = await fetch('/api/learning/flashcard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flashcardId: flashcard.id, result }),
      });
      
      if (response.ok) {
        // Refresh flashcards
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
          userId: userId, 
          quizScore: score,
          totalQuestions,
          difficulty: selectedDifficulty || 'easy'
        }),
      });
      setSelectedDifficulty(null);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      // Fetch flashcards
      const flashcardsRes = await fetch(`/api/learning?userId=${userId}&type=flashcards`);
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

  const renderContent = () => {
    switch (activeFeature) {
      case 'translator':
        return (
          <div className="container mx-auto p-6">
            <div className="flex flex-col gap-6">
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="space-y-4">
                      <div className="flex justify-between">
                            <LanguageSelector
                              isSource
                          value={sourceLang}
                              onChange={setSourceLang}
                              isOpen={isSourceDropdownOpen}
                              setIsOpen={setIsSourceDropdownOpen}
                              languages={languages}
                              detectedLang={detectedLang}
                            />
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
                            <LanguageSelector
                          value={targetLang}
                              onChange={setTargetLang}
                              isOpen={isTargetDropdownOpen}
                              setIsOpen={setIsTargetDropdownOpen}
                              languages={languages}
                            />
                        <button
                          onClick={() => speakText(outputText)}
                          disabled={!outputText}
                              className="ml-2 btn bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-10 h-10 rounded-full"
                        >
                              <FaVolumeUp className="w-4 h-4" />
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

                      {/* Reverse Button */}
                  <div className="flex justify-center">
                        <button
                          onClick={handleReverseLanguages}
                          className={`p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-transform duration-500 ${
                            isRotating ? 'rotate-180' : ''
                          }`}
                        >
                          <FaSync className="w-6 h-6" />
                        </button>
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
            </div>
          </div>
        );
              
      case 'history':
        return (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                  <TranslationHistoryPanel userId={userId} limit={20} />
          </div>
        );

      case 'grammar':
        return <GrammarCheck />;

      case 'dictionary':
        return <Dictionary />;

      case 'summarizer':
        return <Summarizer />;

      case 'paraphraser':
        return <Paraphraser />;

      case 'learning':
        return (
          <div className="container mx-auto p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Learning Mode</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Hover over "Learning Mode" in the sidebar to access all learning features:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Progress History - Track your learning progress</li>
                <li>• Flashcards - Review words and phrases</li>
                <li>• Translation Quiz - Test your knowledge</li>
                <li>• Vocabulary Trainer - Build your vocabulary</li>
                <li>• Pronunciation Practice - Improve your accent</li>
                <li>• Lessons - Structured learning content</li>
                <li>• My Notebook - Save important notes</li>
              </ul>
            </div>
          </div>
        );

      case 'progress':
        return (
          <div className="container mx-auto p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <ProgressReport userId={userId} />
            </div>
          </div>
        );

      case 'flashcards':
        return (
          <div className="container mx-auto p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              {flashcards.length > 0 ? (
                <div className="space-y-6">
                  {flashcards.map((flashcard) => (
                    <Flashcard
                      key={flashcard.id}
                      flashcard={flashcard}
                      translation={translations[flashcard.translationId]}
                      onResult={(result) => handleFlashcardResult(flashcard, result)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-700 dark:text-gray-300">
                    No flashcards due for review! Keep translating to create more cards.
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="container mx-auto p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              {!selectedDifficulty ? (
                <div className="space-y-6">
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
              ) : (
                <Quiz
                  userId={userId}
                  difficulty={selectedDifficulty}
                  sourceLang="en"
                  targetLang="es"
                  onComplete={handleQuizComplete}
                />
                  )}
            </div>
          </div>
        );

      case 'vocabulary':
        return (
          <div className="container mx-auto p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <VocabularyTrainer userId={userId} />
            </div>
          </div>
        );

      case 'pronunciation':
        return (
          <div className="container mx-auto p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <PronunciationPractice userId={userId} />
            </div>
          </div>
        );

      case 'lessons':
        return (
          <div className="container mx-auto p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <Lessons userId={userId} />
            </div>
          </div>
        );

      case 'notebook':
        return (
          <div className="container mx-auto p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <Notebook selectedLanguage={selectedLanguage} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <FeaturePanel 
          activeFeature={activeFeature} 
          setActiveFeature={setActiveFeature}
        />
        <main className="flex-1 overflow-y-auto">
          <nav className="bg-white dark:bg-gray-800 shadow-sm">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-8">
                  <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                    Language Translator
                  </Link>
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

          {renderContent()}
          </main>
      </div>
    </AuthGuard>
  );
}

