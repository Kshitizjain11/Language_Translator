import { useState } from 'react';
import type { FlashCard, Translation } from '@/types/learning';

interface FlashcardProps {
  flashcard: FlashCard;
  translation: Translation;
  onResult: (result: 'easy' | 'medium' | 'hard') => void;
}

export default function Flashcard({ flashcard, translation, onResult }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleFlip = () => {
    if (!isAnswered) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    setIsAnswered(true);
    onResult(difficulty);
  };

  return (
    <div className="max-w-md mx-auto my-8">
      <div
        className={`relative h-64 w-full cursor-pointer perspective-1000 transform-style-3d transition-transform duration-500 ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={handleFlip}
      >
        {/* Front of card */}
        <div className={`absolute w-full h-full bg-white rounded-xl shadow-lg p-6 backface-hidden 
          ${isFlipped ? 'hidden' : 'flex flex-col items-center justify-center'}`}>
          <h3 className="text-2xl font-bold mb-4">{translation.sourceText}</h3>
          <p className="text-gray-600">Click to reveal translation</p>
        </div>

        {/* Back of card */}
        <div className={`absolute w-full h-full bg-white rounded-xl shadow-lg p-6 backface-hidden rotate-y-180
          ${isFlipped ? 'flex flex-col items-center justify-center' : 'hidden'}`}>
          <h3 className="text-2xl font-bold mb-4">{translation.targetText}</h3>
          
          {!isAnswered && (
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => handleDifficulty('hard')}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Hard
              </button>
              <button
                onClick={() => handleDifficulty('medium')}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                Medium
              </button>
              <button
                onClick={() => handleDifficulty('easy')}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Easy
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 text-center text-gray-600">
        <p>Streak: {flashcard.streak} days</p>
        <p>Next review: {flashcard.nextReviewDate.toLocaleDateString()}</p>
      </div>
    </div>
  );
}
