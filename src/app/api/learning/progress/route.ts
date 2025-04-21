import { NextResponse } from 'next/server';

// Sample user progress data
const userProgress = {
  'user123': {
    quizzes: [
      {
        date: '2025-04-15T10:30:00Z',
        score: 8,
        totalQuestions: 10,
        difficulty: 'medium'
      },
      {
        date: '2025-04-18T14:15:00Z',
        score: 4,
        totalQuestions: 5,
        difficulty: 'easy'
      }
    ],
    flashcards: {
      mastered: 12,
      learning: 8,
      new: 5
    },
    streak: 3,
    lastActive: '2025-04-20T09:45:00Z'
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }
  
  // Get user progress or return empty data if not found
  const progress = userProgress[userId] || {
    quizzes: [],
    flashcards: { mastered: 0, learning: 0, new: 0 },
    streak: 0,
    lastActive: new Date().toISOString()
  };
  
  return NextResponse.json({ progress });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { userId, quizScore, totalQuestions, difficulty } = body;
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }
  
  // In a real app, this would update the database
  // For now, we'll just return success
  
  const newQuizResult = {
    date: new Date().toISOString(),
    score: quizScore,
    totalQuestions,
    difficulty
  };
  
  // Initialize user progress if it doesn't exist
  if (!userProgress[userId]) {
    userProgress[userId] = {
      quizzes: [],
      flashcards: { mastered: 0, learning: 0, new: 0 },
      streak: 1,
      lastActive: new Date().toISOString()
    };
  }
  
  // Add the new quiz result
  userProgress[userId].quizzes.push(newQuizResult);
  userProgress[userId].lastActive = new Date().toISOString();
  
  return NextResponse.json({ 
    success: true,
    progress: userProgress[userId]
  });
}
