import { NextResponse } from 'next/server';
import type { Translation, FlashCard, Quiz, UserProgress, QuizQuestion } from '@/types/learning';

// Simulated database (replace with your actual database implementation)
let translations: Translation[] = [];
let flashcards: FlashCard[] = [];
let userProgress: UserProgress[] = [];

export async function POST(request: Request) {
  const data = await request.json();
  
  // Record new translation
  if (data.type === 'translation') {
    const translation: Translation = {
      id: Math.random().toString(36).substr(2, 9),
      userId: data.userId,
      sourceText: data.sourceText,
      targetText: data.targetText,
      sourceLang: data.sourceLang,
      targetLang: data.targetLang,
      frequency: 1,
      lastTranslated: new Date(),
      createdAt: new Date(),
    };
    
    // Update frequency if translation exists
    const existingTranslation = translations.find(
      t => t.sourceText === data.sourceText && t.userId === data.userId
    );
    
    if (existingTranslation) {
      existingTranslation.frequency++;
      existingTranslation.lastTranslated = new Date();
    } else {
      translations.push(translation);
      
      // Create flashcard if translation frequency reaches threshold
      if (shouldCreateFlashcard(translation)) {
        createFlashcard(translation);
      }
    }
    
    return NextResponse.json({ success: true, translation });
  }
  
  return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const type = searchParams.get('type');
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }
  
  switch (type) {
    case 'flashcards':
      const dueFlashcards = getDueFlashcards(userId);
      return NextResponse.json({ flashcards: dueFlashcards });
      
    case 'progress':
      const progress = getUserProgress(userId);
      return NextResponse.json({ progress });
      
    case 'quiz':
      const quiz = generateQuiz(userId);
      return NextResponse.json({ quiz });
      
    case 'translations':
      // Fetch translation history for user, with optional limit
      const limitParam = searchParams.get('limit');
      const limit = limitParam ? parseInt(limitParam, 10) : undefined;
      const userTranslations = translations
        .filter(t => t.userId === userId)
        .sort((a, b) => new Date(b.lastTranslated).getTime() - new Date(a.lastTranslated).getTime());
      return NextResponse.json({ translations: limit ? userTranslations.slice(0, limit) : userTranslations });
      
    default:
      return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
  }
}

// Helper functions
function shouldCreateFlashcard(translation: Translation): boolean {
  return translation.frequency >= 2;
}

function createFlashcard(translation: Translation) {
  const flashcard: FlashCard = {
    id: Math.random().toString(36).substr(2, 9),
    translationId: translation.id,
    nextReviewDate: new Date(),
    easeFactor: 2.5,
    interval: 1,
    streak: 0,
  };
  flashcards.push(flashcard);
}

function getDueFlashcards(userId: string): FlashCard[] {
  const now = new Date();
  return flashcards.filter(f => {
    const translation = translations.find(t => t.id === f.translationId);
    return translation?.userId === userId && f.nextReviewDate <= now;
  });
}

function getUserProgress(userId: string): UserProgress | null {
  return userProgress.find(p => p.userId === userId) || null;
}

function generateQuiz(userId: string): Quiz {
  const userTranslations = translations.filter(t => t.userId === userId)
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 10);
    
  const questions: QuizQuestion[] = userTranslations.map(t => ({
    id: Math.random().toString(36).substr(2, 9),
    translationId: t.id,
    type: 'multiple-choice',
    question: t.sourceText,
    correctAnswer: t.targetText,
    options: generateQuizOptions(t, userTranslations),
  }));
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    userId,
    type: 'multiple-choice',
    questions,
    score: 0,
  };
}

function generateQuizOptions(translation: Translation, allTranslations: Translation[]): string[] {
  const options = [translation.targetText];
  const otherTranslations = allTranslations.filter(t => t.id !== translation.id);
  
  while (options.length < 4 && otherTranslations.length > 0) {
    const randomIndex = Math.floor(Math.random() * otherTranslations.length);
    options.push(otherTranslations[randomIndex].targetText);
    otherTranslations.splice(randomIndex, 1);
  }
  
  return shuffleArray(options);
}

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
