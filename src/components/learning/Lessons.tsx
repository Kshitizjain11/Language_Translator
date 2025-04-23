import React, { useState } from 'react';

interface Lesson {
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
  title: string;
  vocabulary: { word: string; translation: string; pronunciation?: string; examples: string[] }[];
}

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

const Lessons: React.FC<LessonsProps> = () => {
  const [selectedLevel, setSelectedLevel] = useState('Beginner');
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentLesson = lessonsData.find((l) => l.level === selectedLevel);
  const quiz = quizQuestions[quizIndex];

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Lessons</h2>
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
                <div className="text-lg font-bold mb-2">{vocab.word} <span className="text-blue-500">({vocab.translation})</span></div>
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
