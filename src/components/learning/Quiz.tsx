import React, { useState, useEffect } from 'react';
import { FaClock, FaStar, FaCheck, FaTimes } from 'react-icons/fa';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  translation: string;
}

interface QuizProps {
  userId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  sourceLang: string;
  targetLang: string;
  onComplete: (score: number, totalQuestions: number) => void;
}

const DIFFICULTY_SETTINGS = {
  easy: { timeLimit: 30, questions: 5 },
  medium: { timeLimit: 45, questions: 10 },
  hard: { timeLimit: 60, questions: 15 }
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
    fetchQuizQuestions();
  }, [difficulty, userId]);

  const fetchQuizQuestions = async () => {
    try {
      // First try to fetch from our quiz API
      const response = await fetch(`/api/learning/quiz?difficulty=${difficulty}&limit=${DIFFICULTY_SETTINGS[difficulty].questions}`);
      const data = await response.json();
      
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setTimeLeft(DIFFICULTY_SETTINGS[difficulty].timeLimit);
        setLoading(false);
        return;
      }
      
      // If no predefined questions or as a fallback, generate from user translations
      const translationsResponse = await fetch(`/api/learning/translations?userId=${userId}`);
      const translationsData = await translationsResponse.json();
      
      if (!translationsData.translations || translationsData.translations.length === 0) {
        setQuestions([]);
        setLoading(false);
        return;
      }

      const translations = translationsData.translations;
      const quizQuestions: Question[] = [];
      const numQuestions = DIFFICULTY_SETTINGS[difficulty].questions;
      
      // Select random translations based on difficulty
      for (let i = 0; i < numQuestions && i < translations.length; i++) {
        const translation = translations[i];
        const otherTranslations = translations.filter((t: { id: string; targetText: string; sourceText: string }) => t.id !== translation.id);
        
        // Generate 3 random incorrect options
        const options = [translation.targetText];
        while (options.length < 4 && otherTranslations.length > 0) {
          const randomIndex = Math.floor(Math.random() * otherTranslations.length);
          const option = otherTranslations[randomIndex].targetText;
          if (!options.includes(option)) {
            options.push(option);
          }
          otherTranslations.splice(randomIndex, 1);
        }

        quizQuestions.push({
          id: i + 1,
          text: translation.sourceText,
          options: shuffleArray(options),
          correctAnswer: translation.targetText,
          translation: translation.targetText
        });
      }

      setQuestions(quizQuestions);
      setTimeLeft(DIFFICULTY_SETTINGS[difficulty].timeLimit);
      setLoading(false);
    } catch (error) {
      console.error('Error generating questions:', error);
      setLoading(false);
    }
  };

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

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);

    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer('');
        setShowAnswer(false);
      } else {
        handleQuizComplete();
      }
    }, 1500);
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
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Translate: "{currentQuestion.text}"
        </h3>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !showAnswer && handleAnswerSelect(option)}
              disabled={showAnswer}
              className={`w-full p-4 rounded-lg text-left transition-colors ${
                showAnswer
                  ? option === currentQuestion.correctAnswer
                    ? 'bg-green-100 dark:bg-green-800 border-green-500'
                    : option === selectedAnswer
                    ? 'bg-red-100 dark:bg-red-800 border-red-500'
                    : 'bg-gray-100 dark:bg-gray-700'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              } border-2 ${
                showAnswer && option === selectedAnswer
                  ? option === currentQuestion.correctAnswer
                    ? 'border-green-500'
                    : 'border-red-500'
                  : 'border-transparent'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-900 dark:text-white">{option}</span>
                {showAnswer && option === currentQuestion.correctAnswer && (
                  <FaCheck className="text-green-500 h-5 w-5" />
                )}
                {showAnswer && option === selectedAnswer && option !== currentQuestion.correctAnswer && (
                  <FaTimes className="text-red-500 h-5 w-5" />
                )}
              </div>
            </button>
          ))}
        </div>
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
