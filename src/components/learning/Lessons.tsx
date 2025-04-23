import React, { useState, useEffect } from 'react';
import { FaBookmark, FaStar, FaLanguage } from 'react-icons/fa';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface SavedWord {
  id: string;
  word: string;
  translation: string;
  pronunciation?: string;
  examples: string[];
  language: string;
  dateAdded: string;
  learned: boolean;
}

interface Lesson {
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
  title: string;
  vocabulary: { word: string; translation: string; pronunciation?: string; examples: string[] }[];
}

const languages: Language[] = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
];

const lessonsData: Lesson[] = [
  {
    level: 'Beginner',
    title: 'Basic Greetings',
    vocabulary: [
      {
        word: 'Hello',
        translation: 'Hola',
        pronunciation: 'oh-lah',
        examples: ['Hello! How are you?', 'Say hello to your friend.'],
      },
      {
        word: 'Thank you',
        translation: 'Gracias',
        pronunciation: 'grah-see-ahs',
        examples: ['Thank you for your help.', 'Say thank you when someone helps you.'],
      },
      {
        word: 'Goodbye',
        translation: 'Adiós',
        pronunciation: 'ah-dee-ohs',
        examples: ['Goodbye! See you tomorrow.', 'Say goodbye when you leave.'],
      },
    ],
  },
  {
    level: 'Intermediate',
    title: 'Daily Activities',
    vocabulary: [
      {
        word: 'Eat',
        translation: 'Comer',
        pronunciation: 'koh-mehr',
        examples: ['I eat breakfast at 8.', 'Do you want to eat?'],
      },
      {
        word: 'Read',
        translation: 'Leer',
        pronunciation: 'leh-ehr',
        examples: ['She likes to read books.', 'Read this sentence out loud.'],
      },
      {
        word: 'Write',
        translation: 'Escribir',
        pronunciation: 'ehs-kree-beer',
        examples: ['Write your name here.', 'He can write very well.'],
      },
    ],
  },
  {
    level: 'Advanced',
    title: 'Travel and Directions',
    vocabulary: [
      {
        word: 'Airport',
        translation: 'Aeropuerto',
        pronunciation: 'ah-eh-roh-pwehr-toh',
        examples: ['The airport is far from here.', 'We will meet at the airport.'],
      },
      {
        word: 'Train',
        translation: 'Tren',
        pronunciation: 'tren',
        examples: ['Take the train to the city.', 'The train arrives at 5 PM.'],
      },
      {
        word: 'Ticket',
        translation: 'Boleto',
        pronunciation: 'boh-leh-toh',
        examples: ['Buy a ticket at the station.', 'I lost my ticket.'],
      },
    ],
  },
  {
    level: 'Professional',
    title: 'Business Communication',
    vocabulary: [
      {
        word: 'Meeting',
        translation: 'Reunión',
        pronunciation: 'reh-oo-nee-ohn',
        examples: ['The meeting starts at 9.', 'We have a meeting tomorrow.'],
      },
      {
        word: 'Report',
        translation: 'Informe',
        pronunciation: 'een-for-meh',
        examples: ['Please read the report.', 'The report is finished.'],
      },
      {
        word: 'Deadline',
        translation: 'Fecha límite',
        pronunciation: 'feh-cha lee-mee-teh',
        examples: ['The deadline is next week.', 'We must meet the deadline.'],
      },
    ],
  },
];

interface LessonsProps {
  userId: string;
}

const quizQuestions = [
  {
    question: "Which one of these is 'apple'?",
    options: [
      { label: 'Manzana', image: '/images/apple.png', isCorrect: true },
      { label: 'Libro', image: '/images/book.png', isCorrect: false },
      { label: 'Perro', image: '/images/dog.png', isCorrect: false },
    ],
    explanation: "'Manzana' means 'apple' in Spanish.",
  },
];

const Lessons: React.FC<LessonsProps> = ({ userId }) => {
  const [selectedLevel, setSelectedLevel] = useState('Beginner');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [savedWords, setSavedWords] = useState<SavedWord[]>([]);
  const [dailyWord, setDailyWord] = useState<SavedWord | null>(null);
  const [streak, setStreak] = useState(0);
  const [lastActive, setLastActive] = useState<string>('');

  useEffect(() => {
    // Load saved words from localStorage
    const saved = localStorage.getItem('notebook');
    if (saved) {
      const parsedWords = JSON.parse(saved);
      setSavedWords(parsedWords);
    }

    // Load streak data
    const streakData = localStorage.getItem('streak');
    if (streakData) {
      const { count, lastActiveDate } = JSON.parse(streakData);
      setStreak(count);
      setLastActive(lastActiveDate);

      // Check if streak should be updated
      const today = new Date().toISOString().split('T')[0];
      if (lastActiveDate !== today) {
        // Update streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastActiveDate === yesterdayStr) {
          // Consecutive day, increment streak
          const newStreak = count + 1;
          setStreak(newStreak);
          setLastActive(today);
          localStorage.setItem('streak', JSON.stringify({ count: newStreak, lastActiveDate: today }));
        } else {
          // Streak broken, reset to 1
          setStreak(1);
          setLastActive(today);
          localStorage.setItem('streak', JSON.stringify({ count: 1, lastActiveDate: today }));
        }
      }
    } else {
      // Initialize streak
      const today = new Date().toISOString().split('T')[0];
      setStreak(1);
      setLastActive(today);
      localStorage.setItem('streak', JSON.stringify({ count: 1, lastActiveDate: today }));
    }

    // Set daily word
    getDailyWord();
  }, []);

  const getDailyWord = () => {
    const today = new Date().toISOString().split('T')[0];
    const storedDailyWord = localStorage.getItem(`dailyWord_${today}`);
    
    if (storedDailyWord) {
      setDailyWord(JSON.parse(storedDailyWord));
    } else {
      // Generate a new daily word
      const randomLesson = lessonsData[Math.floor(Math.random() * lessonsData.length)];
      const randomWord = randomLesson.vocabulary[Math.floor(Math.random() * randomLesson.vocabulary.length)];
      
      const newDailyWord: SavedWord = {
        id: `daily_${Date.now()}`,
        word: randomWord.word,
        translation: randomWord.translation,
        pronunciation: randomWord.pronunciation,
        examples: randomWord.examples,
        language: selectedLanguage.code,
        dateAdded: today,
        learned: false
      };
      
      setDailyWord(newDailyWord);
      localStorage.setItem(`dailyWord_${today}`, JSON.stringify(newDailyWord));
    }
  };

  const saveWordToNotebook = (word: { word: string; translation: string; pronunciation?: string; examples: string[] }) => {
    const newSavedWord: SavedWord = {
      id: `word_${Date.now()}`,
      word: word.word,
      translation: word.translation,
      pronunciation: word.pronunciation,
      examples: word.examples,
      language: selectedLanguage.code,
      dateAdded: new Date().toISOString().split('T')[0],
      learned: false
    };

    const updatedWords = [...savedWords, newSavedWord];
    setSavedWords(updatedWords);
    localStorage.setItem('notebook', JSON.stringify(updatedWords));

    // Show toast or notification
    alert(`"${word.word}" saved to your notebook!`);
  };

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
  };

  const currentLesson = lessonsData.find((l) => l.level === selectedLevel);
  const quiz = quizQuestions[quizIndex];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Lessons</h2>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-lg">
            <FaStar className="text-yellow-500" />
            <span className="font-semibold">{streak} day streak</span>
          </div>
          
          <div className="relative">
            <select 
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-10 pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedLanguage.code}
              onChange={(e) => {
                const lang = languages.find(l => l.code === e.target.value);
                if (lang) handleLanguageChange(lang);
              }}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
            <FaLanguage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>
      
      {dailyWord && (
        <div className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
          <h3 className="text-lg font-bold mb-2">🎯 Word of the Day</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xl font-bold">{dailyWord.word} <span className="text-blue-200">({dailyWord.translation})</span></p>
              {dailyWord.pronunciation && (
                <p className="text-sm italic mb-1">{dailyWord.pronunciation}</p>
              )}
              <p className="text-sm">Example: {dailyWord.examples[0]}</p>
            </div>
            <button 
              className="bg-white text-blue-600 px-3 py-1 rounded-lg font-medium flex items-center space-x-1 hover:bg-blue-50"
              onClick={() => saveWordToNotebook(dailyWord)}
            >
              <FaBookmark className="text-xs" />
              <span>Save</span>
            </button>
          </div>
        </div>
      )}
      <div className="flex space-x-2 mb-6">
        {['Beginner', 'Intermediate', 'Advanced', 'Professional'].map((level) => (
          <button
            key={level}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              selectedLevel === level
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-blue-100'
            }`}
            onClick={() => setSelectedLevel(level)}
          >
            {level}
          </button>
        ))}
      </div>
      {currentLesson && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">{currentLesson.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentLesson.vocabulary.map((vocab, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start">
                  <div className="text-lg font-bold mb-2">{vocab.word} <span className="text-blue-500">({vocab.translation})</span></div>
                  <button 
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                    onClick={() => saveWordToNotebook(vocab)}
                    title="Save to notebook"
                  >
                    <FaBookmark />
                  </button>
                </div>
                {vocab.pronunciation && (
                  <div className="text-sm text-gray-500 mb-2">Pronunciation: <span className="italic">{vocab.pronunciation}</span></div>
                )}
                <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Examples:</div>
                <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {vocab.examples.map((ex, i) => (
                    <li key={i}>{ex}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Mini-Quiz Section */}
      <div className="mb-8">
        <h4 className="text-lg font-bold mb-4">Mini-Quiz</h4>
        <div className="flex justify-center gap-6">
          {quiz.options.map((opt, idx) => (
            <button
              key={idx}
              className={`w-40 h-48 flex flex-col items-center justify-center rounded-xl shadow-lg border-2 transition-all p-4 ${
                selectedOption === idx
                  ? opt.isCorrect
                    ? 'border-green-500 bg-green-100 dark:bg-green-800'
                    : 'border-red-500 bg-red-100 dark:bg-red-800'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-blue-900'
              }`}
              onClick={() => setSelectedOption(idx)}
              disabled={showFeedback}
            >
              <img src={opt.image} alt={opt.label} className="w-20 h-20 object-contain mb-2" />
              <span className="font-semibold text-lg">{opt.label}</span>
            </button>
          ))}
        </div>
        <div className="flex justify-center mt-4 gap-4">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50"
            onClick={() => {
              if (selectedOption !== null) {
                setIsCorrect(quiz.options[selectedOption].isCorrect);
                setShowFeedback(true);
              }
            }}
            disabled={selectedOption === null || showFeedback}
          >
            Check
          </button>
          <button
            className="px-6 py-2 bg-gray-400 text-white rounded-lg font-semibold"
            onClick={() => {
              setSelectedOption(null);
              setShowFeedback(false);
              setIsCorrect(null);
            }}
            disabled={showFeedback === false}
          >
            Skip
          </button>
        </div>
        {showFeedback && (
          <div className="mt-4 text-center">
            {isCorrect ? (
              <div className="text-green-600 font-bold">Correct! 🎉</div>
            ) : (
              <div className="text-red-600 font-bold">Wrong. 😢</div>
            )}
            <div className="text-gray-700 dark:text-gray-300 mt-2">{quiz.explanation}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lessons;
