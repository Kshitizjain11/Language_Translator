'use client';

import { useState, useEffect } from 'react';
import Flashcard from '@/components/learning/Flashcard';
import Quiz from '@/components/learning/Quiz';
import ProgressReport from '@/components/learning/ProgressReport';
import Sidebar from '@/components/learning/Sidebar';
import VocabularyTrainer from '@/components/learning/VocabularyTrainer';
import PronunciationPractice from '@/components/learning/PronunciationPractice';
import type { FlashCard, Translation } from '@/types/learning';
import { FaClock, FaChartLine, FaTrophy } from 'react-icons/fa';

// Simulated user ID (replace with actual auth)
const USER_ID = 'user123';

type Difficulty = 'easy' | 'medium' | 'hard';
type ActiveTab = 'progress' | 'flashcards' | 'quiz' | 'vocabulary' | 'pronunciation';

interface DifficultyOption {
  color: string;
  hoverColor: string;
  icon: JSX.Element;
  description: string;
}

export default function LearningMode() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('progress');
  const [flashcards, setFlashcards] = useState<FlashCard[]>([]);
  const [translations, setTranslations] = useState<Record<string, Translation>>({});
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

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
          difficulty: selectedDifficulty 
        }),
      });
      setSelectedDifficulty(null);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'progress':
        return <ProgressReport userId={USER_ID} />;

      case 'flashcards':
        return (
          <div className="space-y-6">
            {flashcards.length > 0 ? (
              flashcards.map((flashcard) => (
                <Flashcard
                  key={flashcard.id}
                  flashcard={flashcard}
                  translation={translations[flashcard.translationId]}
                  onResult={(result) => handleFlashcardResult(flashcard, result)}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <p className="text-xl text-gray-600">
                  No flashcards due for review! Keep translating to create more cards.
                </p>
              </div>
            )}
          </div>
        );

      case 'quiz':
        if (!selectedDifficulty) {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Select Quiz Difficulty</h2>
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
          <Quiz
            userId={USER_ID}
            difficulty={selectedDifficulty}
            sourceLang="en"
            targetLang="es"
            onComplete={handleQuizComplete}
          />
        );

      case 'vocabulary':
        return <VocabularyTrainer userId={USER_ID} />;

      case 'pronunciation':
        return <PronunciationPractice userId={USER_ID} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 py-8 px-4">
        <main>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
