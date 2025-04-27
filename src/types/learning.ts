export interface Translation {
  id: string;
  userId: string;
  sourceText: string;
  targetText: string;
  sourceLang: string;
  targetLang: string;
  frequency: number;
  lastTranslated: Date;
  createdAt: Date;
}

export interface FlashCard {
  id: string;
  translationId: string;
  nextReviewDate: Date;
  easeFactor: number;  // Spaced repetition factor
  interval: number;    // Days until next review
  streak: number;
}

export interface Quiz {
  id: string;
  userId: string;
  type: 'multiple-choice' | 'fill-blank' | 'pronunciation';
  questions: QuizQuestion[];
  score: number;
  completedAt?: Date;
}

export interface QuizQuestion {
  id: string;
  translationId: string;
  type: 'multiple-choice' | 'fill-blank' | 'pronunciation';
  question: string;
  correctAnswer: string;
  options?: string[];  // For multiple choice
  userAnswer?: string;
}

export interface UserProgress {
  userId: string;
  totalTranslations: number;
  uniqueWords: number;
  streakDays: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  badges: string[];
  xp: number;
  weeklyProgress: {
    [date: string]: number; // Date string as key, number of words learned as value
  };
  lastActive: string;
  masteredWords: string[]; // Array of words the user has mastered
}
