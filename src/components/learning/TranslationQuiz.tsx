import { useState, useEffect } from 'react';
import type { Translation } from '@/types/learning';

interface TranslationQuizProps {
  userId: string;
  onComplete: (score: number) => void;
}

interface QuizQuestion {
  translation: Translation;
  options: string[];
  answered?: boolean;
  isCorrect?: boolean;
}

export default function TranslationQuiz({ userId, onComplete }: TranslationQuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateQuiz();
  }, [userId]);

  const generateQuiz = async () => {
    try {
      // Fetch user's recent translations
      const response = await fetch(`/api/learning/translations?userId=${userId}&limit=10`);
      const data = await response.json();
      
      // Generate quiz questions from translations
      const quizQuestions = data.translations.map((translation: Translation) => ({
        translation,
        options: generateOptions(translation, data.translations),
        answered: false,
      }));

      setQuestions(quizQuestions);
      setLoading(false);
    } catch (error) {
      console.error('Error generating quiz:', error);
      setLoading(false);
    }
  };

  const generateOptions = (correct: Translation, allTranslations: Translation[]): string[] => {
    const options = [correct.targetText];
    const otherTranslations = allTranslations.filter(t => t.id !== correct.id);
    
    // Add 3 random incorrect options
    while (options.length < 4 && otherTranslations.length > 0) {
      const randomIndex = Math.floor(Math.random() * otherTranslations.length);
      const option = otherTranslations[randomIndex].targetText;
      if (!options.includes(option)) {
        options.push(option);
      }
      otherTranslations.splice(randomIndex, 1);
    }

    // Shuffle options
    return options.sort(() => Math.random() - 0.5);
  };

  const handleAnswer = (selectedAnswer: string) => {
    const currentQ = questions[currentQuestion];
    const isCorrect = selectedAnswer === currentQ.translation.targetText;
    
    setQuestions(prev => {
      const updated = [...prev];
      updated[currentQuestion] = {
        ...currentQ,
        answered: true,
        isCorrect,
      };
      return updated;
    });

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Move to next question or complete quiz
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setQuizCompleted(true);
        onComplete(score + (isCorrect ? 1 : 0));
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Quiz Complete!</h2>
        <div className="text-center mb-8">
          <p className="text-4xl font-bold text-blue-600 mb-2">
            {score} / {questions.length}
          </p>
          <p className="text-gray-600">
            {score === questions.length ? 'Perfect score! 🎉' : 'Good effort! Keep practicing! 💪'}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Review Your Answers</h3>
          {questions.map((q, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                q.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              <p className="font-medium">{q.translation.sourceText}</p>
              <p className={q.isCorrect ? 'text-green-600' : 'text-red-600'}>
                Correct answer: {q.translation.targetText}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={() => generateQuiz()}
          className="mt-6 w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Another Quiz
        </button>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        <div className="text-sm font-medium">
          Score: {score}
        </div>
      </div>

      <div className="mb-8">
        <p className="text-lg font-medium mb-2">Translate this text:</p>
        <p className="text-2xl font-bold">{currentQ.translation.sourceText}</p>
      </div>

      <div className="space-y-3">
        {currentQ.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !currentQ.answered && handleAnswer(option)}
            className={`w-full p-4 text-left rounded-lg transition-colors ${
              !currentQ.answered
                ? 'hover:bg-blue-50 border border-gray-200'
                : option === currentQ.translation.targetText
                ? 'bg-green-100 border border-green-300'
                : 'bg-gray-50 border border-gray-200'
            } ${
              currentQ.answered && option === currentQ.translation.targetText
                ? 'ring-2 ring-green-500'
                : ''
            }`}
            disabled={currentQ.answered}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-6 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
