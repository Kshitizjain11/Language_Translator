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

  // Fun facts: one per language/country
  const exampleSentences: Record<string, {
    source: string;
    target: string;
    emoji?: string;
    funFact: { es: string; fr: string; de: string };
  }> = {
    'Hello': {
      source: 'Hello! How are you?',
      target: '¡Hola! ¿Cómo estás?',
      emoji: '👋',
      funFact: {
        es: 'In Spain, people often greet with two kisses on the cheek.',
        fr: 'In France, people greet with la bise (a kiss on each cheek).',
        de: 'In Germany, a handshake is common as a greeting.'
      }
    },
    'Thank you': {
      source: 'Thank you for your help.',
      target: 'Gracias por tu ayuda.',
      emoji: '🙏',
      funFact: {
        es: 'In Spain, saying "gracias" is key to politeness.',
        fr: 'In France, "merci" is essential for good manners.',
        de: 'In Germany, "danke" is one of the most important words.'
      }
    },
    'Dog': {
      source: 'The dog is friendly.',
      target: 'El perro es amigable.',
      emoji: '🐶',
      funFact: {
        es: 'Dogs are the most popular pets in Spain.',
        fr: 'Dogs are the most popular pets in France.',
        de: 'Dogs are the most popular pets in Germany.'
      }
    },
    'Apple': {
      source: 'I eat an apple every day.',
      target: 'Como una manzana cada día.',
      emoji: '🍏',
      funFact: {
        es: 'Apples are a symbol of knowledge in Spanish culture.',
        fr: 'Apples are a classic fruit in French snacks.',
        de: 'Apples are a staple in German desserts.'
      }
    },
    'Good night': {
      source: 'Good night and sweet dreams!',
      target: '¡Buenas noches y dulces sueños!',
      emoji: '🌙',
      funFact: {
        es: 'It’s polite to wish "buenas noches" in Spain.',
        fr: 'In France, people say "bonne nuit" before bed.',
        de: 'In Germany, people say "Gute Nacht" before sleeping.'
      }
    },
    'Friend': {
      source: 'My friend is coming over.',
      target: 'Mi amigo viene a casa.',
      emoji: '🤝',
      funFact: {
        es: 'In Spanish, “amigo” is for males and “amiga” for females.',
        fr: 'In French, "ami" is masculine and "amie" is feminine.',
        de: 'In German, "Freund" is for males and "Freundin" for females.'
      }
    },
    'School': {
      source: 'School starts at 8 AM.',
      target: 'La escuela empieza a las 8 AM.',
      emoji: '🏫',
      funFact: {
        es: 'In Spain, uniforms are common in private schools.',
        fr: 'Most French schools do not require uniforms.',
        de: 'Most German schools do not require uniforms.'
      }
    },
    'Book': {
      source: 'This book is interesting.',
      target: 'Este libro es interesante.',
      emoji: '📚',
      funFact: {
        es: 'The word for book in Spanish is "libro".',
        fr: 'The word for book in French is "livre".',
        de: 'The word for book in German is "Buch".'
      }
    },
    'Water': {
      source: 'Can I have some water?',
      target: '¿Puedo tomar agua?',
      emoji: '💧',
      funFact: {
        es: 'In Spanish, "agua" is feminine but uses "el" in singular.',
        fr: 'In French, "eau" is a feminine word.',
        de: 'In German, "Wasser" is a neutral word.'
      }
    },
    'Family': {
      source: 'Family is important.',
      target: 'La familia es importante.',
      emoji: '👨‍👩‍👧‍👦',
      funFact: {
        es: 'Family gatherings are important in Spanish culture.',
        fr: 'Family is very important in French culture.',
        de: 'Family get-togethers are popular in Germany.'
      }
    },
  };

  const handleFlip = () => {
    if (!isAnswered) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    setIsAnswered(true);
    onResult(difficulty);
  };

  // Accept targetLang as a prop for dynamic fun facts
  const { targetLang = 'es' } = translation;
  type SupportedLang = 'es' | 'fr' | 'de';
  const safeLang: SupportedLang = ['es', 'fr', 'de'].includes(targetLang) ? targetLang as SupportedLang : 'es';
  const example = exampleSentences[translation.sourceText];

  return (
    <div className="max-w-xs w-full min-w-[16rem] mx-auto my-6">
      <div
        className={`relative h-80 w-full cursor-pointer perspective-1000 transform-style-3d transition-transform duration-500 ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={handleFlip}
        style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.14)', borderRadius: '1.5rem', background: 'var(--card-bg, linear-gradient(135deg, #f8fafc 60%, #dbeafe 100%))' }}
      >
        {/* Front of card */}
        <div className={`absolute w-full h-full flex flex-col items-center justify-center p-8 backface-hidden rounded-3xl border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 ${isFlipped ? 'hidden' : ''}`}
          style={{ boxShadow: '0 2px 12px rgba(30,64,175,0.08)' }}>
          <span className="text-5xl mb-4">{example?.emoji}</span>
          <h3 className="text-3xl font-bold mb-2 text-blue-700 dark:text-blue-300">{translation.sourceText}</h3>
          <p className="text-gray-600 dark:text-gray-400 italic">Tap to see the answer</p>
        </div>

        {/* Back of card */}
        <div className={`absolute w-full h-full flex flex-col items-center justify-center p-8 backface-hidden rotate-y-180 rounded-3xl border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 ${isFlipped ? '' : 'hidden'}`}
          style={{ boxShadow: '0 2px 12px rgba(30,64,175,0.08)' }}>
          <span className="text-5xl mb-4">{example?.emoji}</span>
          <h3 className="text-3xl font-bold mb-2 text-green-700 dark:text-green-300">{translation.targetText}</h3>
          {example && (
            <>
              <div className="mb-2 text-center">
                <span className="block text-base text-gray-700 dark:text-gray-300 italic">{example.source}</span>
                <span className="block text-base text-gray-700 dark:text-gray-300 italic">{example.target}</span>
              </div>
              {example.funFact && (
                <div className="mb-2 text-xs text-blue-500 dark:text-blue-300">{example.funFact[safeLang]}</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
