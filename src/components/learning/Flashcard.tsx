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

  // Fun facts: one per language/country, now with Hindi
  const exampleSentences: Record<string, {
    source: string;
    target: { es: string; fr: string; de: string; it: string; pt: string; ru: string; hi: string };
    emoji?: string;
    funFact: { es: string; fr: string; de: string; it: string; pt: string; ru: string; hi: string };
  }> = {
    'Hello': {
      source: 'Hello! How are you?',
      target: {
        es: '¡Hola! ¿Cómo estás?',
        fr: 'Bonjour! Comment ça va?',
        de: 'Hallo! Wie geht es dir?',
        it: 'Ciao! Come stai?',
        pt: 'Olá! Como vai você?',
        ru: 'Привет! Как дела?',
        hi: 'नमस्ते! कैसे हो?'
      },
      emoji: '👋',
      funFact: {
        es: 'In Spain, people often greet with two kisses on the cheek.',
        fr: 'In France, people greet with la bise (a kiss on each cheek).',
        de: 'In Germany, a handshake is common as a greeting.',
        it: 'In Italy, people greet with two kisses on the cheek, starting on the right.',
        pt: 'In Portugal, people greet with two kisses on the cheek, often starting on the left.',
        ru: 'In Russia, a firm handshake is common, but close friends may hug.',
        hi: 'In India, people greet with "Namaste" by joining their palms.'
      }
    },
    'Thank you': {
      source: 'Thank you for your help.',
      target: {
        es: 'Gracias por tu ayuda.',
        fr: 'Merci pour votre aide.',
        de: 'Danke für deine Hilfe.',
        it: 'Grazie per il tuo aiuto.',
        pt: 'Obrigado pela sua ajuda.',
        ru: 'Спасибо за вашу помощь.',
        hi: 'आपकी मदद के लिए धन्यवाद।'
      },
      emoji: '🙏',
      funFact: {
        es: 'In Spain, saying "gracias" is key to politeness.',
        fr: 'In France, "merci" is essential for good manners.',
        de: 'In Germany, "danke" is one of the most important words.',
        it: 'In Italy, "grazie" is used frequently and warmly.',
        pt: 'In Portugal, "obrigado" (if you are male) or "obrigada" (if you are female) is used.',
        ru: 'In Russia, "spasibo" (спасибо) is the standard way to say thank you.',
        hi: 'In India, "dhanyavaad" (धन्यवाद) is a formal way to say thank you.'
      }
    },
    'Dog': {
      source: 'The dog is friendly.',
      target: {
        es: 'El perro es amigable.',
        fr: 'Le chien est amical.',
        de: 'Der Hund ist freundlich.',
        it: 'Il cane è amichevole.',
        pt: 'O cão é amigável.',
        ru: 'Собака дружелюбная.',
        hi: 'कुत्ता दोस्ताना है।'
      },
      emoji: '🐶',
      funFact: {
        es: 'Dogs are the most popular pets in Spain.',
        fr: 'Dogs are the most popular pets in France.',
        de: 'Dogs are the most popular pets in Germany.',
        it: 'Dogs are beloved pets in Italy, especially small breeds.',
        pt: 'Dogs are common pets in Portugal.',
        ru: 'Dogs are popular pets in Russia, especially in rural areas.',
        hi: 'Dogs are popular pets in India and are considered loyal companions.'
      }
    },
    'Apple': {
      source: 'I eat an apple every day.',
      target: {
        es: 'Como una manzana cada día.',
        fr: 'Je mange une pomme chaque jour.',
        de: 'Ich esse jeden Tag einen Apfel.',
        it: 'Mangio una mela ogni giorno.',
        pt: 'Como uma maçã todos os dias.',
        ru: 'Я ем яблоко каждый день.',
        hi: 'मैं रोज़ एक सेब खाता हूँ।'
      },
      emoji: '🍏',
      funFact: {
        es: 'Apples are a symbol of knowledge in Spanish culture.',
        fr: 'Apples are a classic fruit in French snacks.',
        de: 'Apples are a staple in German desserts.',
        it: 'In Italy, apples are grown mainly in the north.',
        pt: 'Portugal has many varieties of apples, especially in the west.',
        ru: 'In Russia, apples are often used for homemade jams.',
        hi: 'Apples are grown in abundance in the Indian state of Himachal Pradesh.'
      }
    },
    'Good night': {
      source: 'Good night and sweet dreams!',
      target: {
        es: '¡Buenas noches y dulces sueños!',
        fr: 'Bonne nuit et fais de beaux rêves!',
        de: 'Gute Nacht und süße Träume!',
        it: 'Buona notte e sogni d’oro!',
        pt: 'Boa noite e bons sonhos!',
        ru: 'Спокойной ночи и сладких снов!',
        hi: 'शुभ रात्रि और मीठे सपने!'
      },
      emoji: '🌙',
      funFact: {
        es: 'It’s polite to wish "buenas noches" in Spain.',
        fr: 'In France, people say "bonne nuit" before bed.',
        de: 'In Germany, people say "Gute Nacht" before sleeping.',
        it: 'In Italy, "buona notte" is said before going to bed.',
        pt: 'In Portugal, "boa noite" is a warm wish before sleep.',
        ru: 'In Russia, "spokoynoy nochi" (Спокойной ночи) is said before bed.',
        hi: 'In India, people often say "Shubh Raatri" (शुभ रात्रि) before sleeping.'
      }
    },
    'Friend': {
      source: 'My friend is coming over.',
      target: {
        es: 'Mi amigo viene a casa.',
        fr: 'Mon ami vient chez moi.',
        de: 'Mein Freund kommt vorbei.',
        it: 'Il mio amico viene a casa.',
        pt: 'Meu amigo vem aqui.',
        ru: 'Мой друг приходит в гости.',
        hi: 'मेरा दोस्त घर आ रहा है।'
      },
      emoji: '🤝',
      funFact: {
        es: 'In Spanish, “amigo” is for males and “amiga” for females.',
        fr: 'In French, "ami" is masculine and "amie" is feminine.',
        de: 'In German, "Freund" is for males and "Freundin" for females.',
        it: 'In Italian, "amico" is masculine and "amica" is feminine.',
        pt: 'In Portuguese, "amigo" is masculine and "amiga" is feminine.',
        ru: 'In Russian, "drug" (друг) is for a friend, regardless of gender.',
        hi: 'In Hindi, "दोस्त" (dost) is a gender-neutral word for friend.'
      }
    },
    'School': {
      source: 'School starts at 8 AM.',
      target: {
        es: 'La escuela empieza a las 8 AM.',
        fr: 'L’école commence à 8h.',
        de: 'Die Schule beginnt um 8 Uhr.',
        it: 'La scuola inizia alle 8.',
        pt: 'A escola começa às 8h.',
        ru: 'Школа начинается в 8 утра.',
        hi: 'स्कूल 8 बजे शुरू होता है।'
      },
      emoji: '🏫',
      funFact: {
        es: 'In Spain, uniforms are common in private schools.',
        fr: 'Most French schools do not require uniforms.',
        de: 'Most German schools do not require uniforms.',
        it: 'In Italy, some schools require a white smock for young children.',
        pt: 'In Portugal, uniforms are rare except in private schools.',
        ru: 'In Russia, school uniforms are making a comeback in many regions.',
        hi: 'In India, most schools require students to wear uniforms.'
      }
    },
    'Book': {
      source: 'This book is interesting.',
      target: {
        es: 'Este libro es interesante.',
        fr: 'Ce livre est intéressant.',
        de: 'Dieses Buch ist interessant.',
        it: 'Questo libro è interessante.',
        pt: 'Este livro é interessante.',
        ru: 'Эта книга интересная.',
        hi: 'यह किताब दिलचस्प है।'
      },
      emoji: '📚',
      funFact: {
        es: 'The word for book in Spanish is "libro".',
        fr: 'The word for book in French is "livre".',
        de: 'The word for book in German is "Buch".',
        it: 'The word for book in Italian is "libro".',
        pt: 'The word for book in Portuguese is "livro".',
        ru: 'The word for book in Russian is "kniga" (книга).',
        hi: 'The word for book in Hindi is "किताब" (kitaab).'
      }
    },
    'Water': {
      source: 'Can I have some water?',
      target: {
        es: '¿Puedo tomar agua?',
        fr: 'Puis-je avoir de l’eau ?',
        de: 'Kann ich etwas Wasser haben?',
        it: 'Posso avere dell’acqua?',
        pt: 'Posso beber água?',
        ru: 'Можно мне воды?',
        hi: 'क्या मुझे थोड़ा पानी मिल सकता है?'
      },
      emoji: '💧',
      funFact: {
        es: 'In Spanish, "agua" is feminine but uses "el" in singular.',
        fr: 'In French, "eau" is a feminine word.',
        de: 'In German, "Wasser" is a neutral word.',
        it: 'In Italian, "acqua" is feminine.',
        pt: 'In Portuguese, "água" is feminine.',
        ru: 'In Russian, "voda" (вода) is feminine.',
        hi: 'In Hindi, "पानी" (paani) is masculine.'
      }
    },
    'Family': {
      source: 'Family is important.',
      target: {
        es: 'La familia es importante.',
        fr: 'La famille est importante.',
        de: 'Familie ist wichtig.',
        it: 'La famiglia è importante.',
        pt: 'A família é importante.',
        ru: 'Семья важна.',
        hi: 'परिवार महत्वपूर्ण है।'
      },
      emoji: '👨‍👩‍👧‍👦',
      funFact: {
        es: 'Family gatherings are important in Spanish culture.',
        fr: 'Family is very important in French culture.',
        de: 'Family get-togethers are popular in Germany.',
        it: 'In Italy, Sunday lunch with family is a cherished tradition.',
        pt: 'Family is the foundation of Portuguese society.',
        ru: 'In Russia, family ties are highly valued.',
        hi: 'In India, joint families are common and highly valued.'
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
  type SupportedLang = 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'hi';
  const safeLang: SupportedLang = ['es', 'fr', 'de', 'it', 'pt', 'ru', 'hi'].includes(targetLang) ? targetLang as SupportedLang : 'es';
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
          {/* Show the translation of the word at the top */}
          <h3 className="text-3xl font-bold mb-2 text-green-700 dark:text-green-300">{translation.targetText}</h3>
          {example && (
            <>
              <div className="mb-2 text-center">
                <span className="block text-base text-gray-700 dark:text-gray-300 italic">{example.source}</span>
                {/* Show the example sentence in the selected language below */}
                {example.target && (
                  <span className="block text-base text-gray-700 dark:text-gray-300 italic">{example.target[safeLang]}</span>
                )}
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
