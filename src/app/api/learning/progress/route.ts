import { NextResponse } from 'next/server';

// In-memory storage (replace with database in production)
const userProgress: Record<string, any> = {};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }
  
  // Get user progress or return empty data if not found
  const progress = userProgress[userId] || {
    userId,
    totalTranslations: 0,
    uniqueWords: 0,
    streakDays: 0,
    level: 'beginner',
    badges: [],
    xp: 0,
    weeklyProgress: {},
    lastActive: new Date().toISOString(),
    masteredWords: []
  };
  
  return NextResponse.json({ progress });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { userId, word, isMastered } = body;
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  // Initialize user progress if it doesn't exist
  if (!userProgress[userId]) {
    userProgress[userId] = {
      userId,
      totalTranslations: 0,
      uniqueWords: 0,
      streakDays: 0,
      level: 'beginner',
      badges: [],
      xp: 0,
      weeklyProgress: {},
      lastActive: new Date().toISOString(),
      masteredWords: []
    };
  }

  const today = new Date().toISOString().split('T')[0];
  const currentProgress = userProgress[userId];

  // Update weekly progress
  if (!currentProgress.weeklyProgress[today]) {
    currentProgress.weeklyProgress[today] = 0;
  }

  if (word) {
    // Only increment if word is not already mastered
    if (!currentProgress.masteredWords.includes(word)) {
      // Increment words learned for today
      currentProgress.weeklyProgress[today] += 1;
      // Update mastered words
      if (isMastered) {
        currentProgress.masteredWords.push(word);
        // Update XP based on activity
        currentProgress.xp += 10; // Base XP for learning a word
        if (isMastered) {
          currentProgress.xp += 20; // Bonus XP for mastering a word
        }
      }
    }
  }

  // Update streak
  const lastActive = new Date(currentProgress.lastActive);
  const todayDate = new Date();
  const daysSinceLastActive = Math.floor((todayDate.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

  if (daysSinceLastActive === 1) {
    currentProgress.streakDays += 1;
  } else if (daysSinceLastActive > 1) {
    currentProgress.streakDays = 1;
  }

  // Update last active date
  currentProgress.lastActive = new Date().toISOString();

  // Update level based on XP
  if (currentProgress.xp >= 1000) {
    currentProgress.level = 'advanced';
  } else if (currentProgress.xp >= 500) {
    currentProgress.level = 'intermediate';
  }

  // Log the update for debugging
  console.log('Progress updated:', {
    userId,
    word,
    isMastered,
    weeklyProgress: currentProgress.weeklyProgress[today],
    streakDays: currentProgress.streakDays,
    xp: currentProgress.xp
  });

  return NextResponse.json({ 
    success: true,
    progress: currentProgress
  });
}
