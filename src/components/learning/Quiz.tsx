import React, { useState, useEffect } from 'react';
import { FaClock, FaStar, FaCheck, FaTimes } from 'react-icons/fa';

interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    image: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

interface QuizProps {
  userId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  sourceLang: string;
  targetLang: string;
  onComplete: (score: number, totalQuestions: number) => void;
}

const DIFFICULTY_SETTINGS = {
  easy: { timeLimit: 45, questions: 5 },
  medium: { timeLimit: 90, questions: 10 },
  hard: { timeLimit: 120, questions: 15 }
};

export default function Quiz({ userId, difficulty, sourceLang, targetLang, onComplete }: QuizProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DIFFICULTY_SETTINGS[difficulty].timeLimit);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Different MCQ questions for each difficulty
    const easyQuestions: Question[] = [
      {
        id: 1,
        text: 'What is the Spanish word for "cat"?',
        options: [
          { text: 'gato', image: '', isCorrect: true },
          { text: 'perro', image: '', isCorrect: false },
          { text: 'casa', image: '', isCorrect: false },
          { text: 'libro', image: '', isCorrect: false },
        ],
        explanation: '"Gato" means "cat" in Spanish.'
      },
      {
        id: 2,
        text: 'How do you say "thank you" in French?',
        options: [
          { text: 'merci', image: '', isCorrect: true },
          { text: 'gracias', image: '', isCorrect: false },
          { text: 'danke', image: '', isCorrect: false },
          { text: 'ciao', image: '', isCorrect: false },
        ],
        explanation: '"Merci" means "thank you" in French.'
      },
      {
        id: 3,
        text: 'What is the German word for "apple"?',
        options: [
          { text: 'Apfel', image: '', isCorrect: true },
          { text: 'Banane', image: '', isCorrect: false },
          { text: 'Orange', image: '', isCorrect: false },
          { text: 'Traube', image: '', isCorrect: false },
        ],
        explanation: '"Apfel" means "apple" in German.'
      },
      {
        id: 4,
        text: 'How do you say "good morning" in Italian?',
        options: [
          { text: 'buongiorno', image: '', isCorrect: true },
          { text: 'buonasera', image: '', isCorrect: false },
          { text: 'notte', image: '', isCorrect: false },
          { text: 'prego', image: '', isCorrect: false },
        ],
        explanation: '"Buongiorno" means "good morning" in Italian.'
      },
      {
        id: 5,
        text: 'What is the Japanese word for "water"?',
        options: [
          { text: 'mizu', image: '', isCorrect: true },
          { text: 'sake', image: '', isCorrect: false },
          { text: 'ocha', image: '', isCorrect: false },
          { text: 'kōhī', image: '', isCorrect: false },
        ],
        explanation: '"Mizu" means "water" in Japanese.'
      }
    ];

    const mediumQuestions: Question[] = [
      {
        id: 1,
        text: 'What is the French word for "library"?',
        options: [
          { text: 'bibliothèque', image: '', isCorrect: true },
          { text: 'libro', image: '', isCorrect: false },
          { text: 'livre', image: '', isCorrect: false },
          { text: 'maison', image: '', isCorrect: false },
        ],
        explanation: '"Bibliothèque" means "library" in French.'
      },
      {
        id: 2,
        text: 'How do you say "bread" in Spanish?',
        options: [
          { text: 'pan', image: '', isCorrect: true },
          { text: 'queso', image: '', isCorrect: false },
          { text: 'vino', image: '', isCorrect: false },
          { text: 'pollo', image: '', isCorrect: false },
        ],
        explanation: '"Pan" means "bread" in Spanish.'
      },
      {
        id: 3,
        text: 'What is the Italian word for "school"?',
        options: [
          { text: 'scuola', image: '', isCorrect: true },
          { text: 'studente', image: '', isCorrect: false },
          { text: 'insegnante', image: '', isCorrect: false },
          { text: 'lezione', image: '', isCorrect: false },
        ],
        explanation: '"Scuola" means "school" in Italian.'
      },
      {
        id: 4,
        text: 'How do you say "friend" in German?',
        options: [
          { text: 'Freund', image: '', isCorrect: true },
          { text: 'Familie', image: '', isCorrect: false },
          { text: 'Lehrer', image: '', isCorrect: false },
          { text: 'Kind', image: '', isCorrect: false },
        ],
        explanation: '"Freund" means "friend" in German.'
      },
      {
        id: 5,
        text: 'What is the Russian word for "hello"?',
        options: [
          { text: 'privet', image: '', isCorrect: true },
          { text: 'spasibo', image: '', isCorrect: false },
          { text: 'dasvidaniya', image: '', isCorrect: false },
          { text: 'poka', image: '', isCorrect: false },
        ],
        explanation: '"Privet" means "hello" in Russian.'
      }
    ];

    const hardQuestions: Question[] = [
      {
        id: 1,
        text: 'What is the Portuguese word for "challenge"?',
        options: [
          { text: 'desafio', image: '', isCorrect: true },
          { text: 'trabalho', image: '', isCorrect: false },
          { text: 'festa', image: '', isCorrect: false },
          { text: 'viagem', image: '', isCorrect: false },
        ],
        explanation: '"Desafio" means "challenge" in Portuguese.'
      },
      {
        id: 2,
        text: 'How do you say "environment" in Japanese?',
        options: [
          { text: 'kankyō', image: '', isCorrect: true },
          { text: 'shizen', image: '', isCorrect: false },
          { text: 'mizu', image: '', isCorrect: false },
          { text: 'tenki', image: '', isCorrect: false },
        ],
        explanation: '"Kankyō" means "environment" in Japanese.'
      },
      {
        id: 3,
        text: 'What is the Spanish word for "improvement"?',
        options: [
          { text: 'mejora', image: '', isCorrect: true },
          { text: 'empeoramiento', image: '', isCorrect: false },
          { text: 'cambio', image: '', isCorrect: false },
          { text: 'crecimiento', image: '', isCorrect: false },
        ],
        explanation: '"Mejora" means "improvement" in Spanish.'
      },
      {
        id: 4,
        text: 'How do you say "independence" in French?',
        options: [
          { text: 'indépendance', image: '', isCorrect: true },
          { text: 'liberté', image: '', isCorrect: false },
          { text: 'égalité', image: '', isCorrect: false },
          { text: 'paix', image: '', isCorrect: false },
        ],
        explanation: '"Indépendance" means "independence" in French.'
      },
      {
        id: 5,
        text: 'What is the German word for "responsibility"?',
        options: [
          { text: 'Verantwortung', image: '', isCorrect: true },
          { text: 'Möglichkeit', image: '', isCorrect: false },
          { text: 'Freundschaft', image: '', isCorrect: false },
          { text: 'Erfahrung', image: '', isCorrect: false },
        ],
        explanation: '"Verantwortung" means "responsibility" in German.'
      }
    ];

    let selectedQuestions: Question[] = easyQuestions;
    if (difficulty === 'medium') selectedQuestions = mediumQuestions;
    if (difficulty === 'hard') selectedQuestions = hardQuestions;

    // Shuffle options for each question
    const shuffledQuestions = selectedQuestions.map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));

    // If more questions are defined than needed, randomly select the required number
    const numQuestions = DIFFICULTY_SETTINGS[difficulty].questions;
    let finalQuestions = shuffledQuestions;
    if (shuffledQuestions.length > numQuestions) {
      // Shuffle questions and pick the first numQuestions
      finalQuestions = shuffleArray(shuffledQuestions).slice(0, numQuestions);
    }

    setQuestions(finalQuestions);
    setTimeLeft(DIFFICULTY_SETTINGS[difficulty].timeLimit);
    setLoading(false);
  }, [difficulty, userId]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !isQuizComplete) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isQuizComplete) {
      handleQuizComplete();
    }
  }, [timeLeft, isQuizComplete]);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index.toString());
  };

  const handleCheckAnswer = async () => {
    setShowAnswer(true);

    // Check if answer is correct
    const selectedOption = currentQuestion.options[parseInt(selectedAnswer)];
    const isCorrect = selectedOption.isCorrect;
    if (isCorrect) {
      setScore(score + 1);
    }

    // Wait 2 seconds before moving to next question
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Move to next question or end quiz
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
      setShowAnswer(false);
    } else {
      handleQuizComplete();
    }
  };

  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
      setShowAnswer(false);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = () => {
    setIsQuizComplete(true);
    onComplete(score, questions.length);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          No Questions Available
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Start translating more text to generate quiz questions!
        </p>
      </div>
    );
  }

  if (isQuizComplete) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          Quiz Complete!
        </h2>
        <div className="text-center">
          <p className="text-xl mb-2 text-gray-700 dark:text-gray-300">
            Your Score: {score}/{questions.length}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Time Remaining: {formatTime(timeLeft)}
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            {[...Array(Math.floor((score / questions.length) * 5))].map((_, i) => (
              <FaStar key={i} className="text-yellow-400 h-6 w-6" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
          <FaClock className="h-5 w-5" />
          <span>{formatTime(timeLeft)}</span>
        </div>
        <div className="text-gray-600 dark:text-gray-400">
          Question {currentQuestionIndex + 1}/{questions.length}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-center text-gray-900 dark:text-white">
          {currentQuestion.text}
        </h3>
        
        <div className="flex justify-center gap-6 mb-6">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !showAnswer && handleAnswerSelect(index)}
              disabled={showAnswer}
              className={`w-40 h-48 flex flex-col items-center justify-center rounded-xl shadow-lg border-2 transition-all p-4 ${
                showAnswer
                  ? option.isCorrect
                    ? 'border-green-500 bg-green-100 dark:bg-green-800'
                    : selectedAnswer === index.toString()
                    ? 'border-red-500 bg-red-100 dark:bg-red-800'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                  : selectedAnswer === index.toString()
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-blue-900'
              }`}
            >

              <span className="font-semibold text-lg text-gray-900 dark:text-white">{option.text}</span>
              {showAnswer && option.isCorrect && (
                <FaCheck className="text-green-500 h-5 w-5 mt-2" />
              )}
              {showAnswer && selectedAnswer === index.toString() && !option.isCorrect && (
                <FaTimes className="text-red-500 h-5 w-5 mt-2" />
              )}
            </button>
          ))}
        </div>

        <div className="flex justify-center mt-4 gap-4">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-blue-700"
            onClick={handleCheckAnswer}
            disabled={!selectedAnswer || showAnswer}
          >
            Check
          </button>
          <button
            className="px-6 py-2 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500"
            onClick={handleSkip}
          >
            Skip
          </button>
        </div>

        {showAnswer && (
          <div className="mt-4 text-center">
            {currentQuestion.options[parseInt(selectedAnswer)]?.isCorrect ? (
              <div className="text-green-600 font-bold dark:text-green-400">Correct! 🎉</div>
            ) : (
              <div className="text-red-600 font-bold dark:text-red-400">Wrong. 😢</div>
            )}
            <div className="text-gray-700 dark:text-gray-300 mt-2">{currentQuestion.explanation}</div>
          </div>
        )}
      </div>

      <div className="mt-6 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
