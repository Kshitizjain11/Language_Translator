import React, { useState } from 'react';
import Quiz from './Quiz';
import { FaTrophy, FaChartLine, FaClock } from 'react-icons/fa';

interface LearningModeProps {
  userId: string;
  sourceLang: string;
  targetLang: string;
}

type Difficulty = 'easy' | 'medium' | 'hard';

interface QuizResult {
  difficulty: Difficulty;
  score: number;
  totalQuestions: number;
  timestamp: Date;
}

export default function LearningMode({ userId, sourceLang, targetLang }: LearningModeProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const difficultySettings = {
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

  const handleQuizComplete = (score: number, totalQuestions: number) => {
    const result: QuizResult = {
      difficulty: selectedDifficulty as Difficulty,
      score,
      totalQuestions,
      timestamp: new Date()
    };

    setQuizResults(prev => [result, ...prev]);
    setShowResults(true);
  };

  const startNewQuiz = () => {
    setSelectedDifficulty(null);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Quiz Results</h2>
        <div className="space-y-4">
          {quizResults.map((result, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900 dark:text-white capitalize">
                  {result.difficulty} Level
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {result.timestamp.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">
                  Score: {result.score}/{result.totalQuestions}
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {Math.round((result.score / result.totalQuestions) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={startNewQuiz}
          className="mt-6 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
        >
          Start New Quiz
        </button>
      </div>
    );
  }

  if (selectedDifficulty) {
    return (
      <Quiz
        userId={userId}
        difficulty={selectedDifficulty}
        sourceLang={sourceLang}
        targetLang={targetLang}
        onComplete={handleQuizComplete}
      />
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Choose Difficulty Level</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(Object.keys(difficultySettings) as Difficulty[]).map((difficulty) => (
          <button
            key={difficulty}
            onClick={() => setSelectedDifficulty(difficulty)}
            className={`p-6 rounded-lg ${difficultySettings[difficulty].color} ${
              difficultySettings[difficulty].hoverColor
            } text-white transition-transform transform hover:scale-105`}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              {difficultySettings[difficulty].icon}
              <h3 className="text-xl font-semibold capitalize">{difficulty}</h3>
              <p className="text-sm opacity-90">
                {difficultySettings[difficulty].description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 