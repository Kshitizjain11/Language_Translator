import { NextResponse } from 'next/server';

// Sample translations for the learning module
const sampleTranslations = [
  {
    id: '1',
    userId: 'user123',
    sourceText: 'Hello, how are you?',
    targetText: 'Hola, ¿cómo estás?',
    sourceLang: 'English',
    targetLang: 'Spanish',
    frequency: 3,
    lastTranslated: new Date().toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    userId: 'user123',
    sourceText: 'My name is John',
    targetText: 'Me llamo John',
    sourceLang: 'English',
    targetLang: 'Spanish',
    frequency: 2,
    lastTranslated: new Date().toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    userId: 'user123',
    sourceText: 'I like to read books',
    targetText: 'Me gusta leer libros',
    sourceLang: 'English',
    targetLang: 'Spanish',
    frequency: 1,
    lastTranslated: new Date().toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    userId: 'user123',
    sourceText: 'What time is it?',
    targetText: '¿Qué hora es?',
    sourceLang: 'English',
    targetLang: 'Spanish',
    frequency: 4,
    lastTranslated: new Date().toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    userId: 'user123',
    sourceText: 'I am hungry',
    targetText: 'Tengo hambre',
    sourceLang: 'English',
    targetLang: 'Spanish',
    frequency: 2,
    lastTranslated: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  // Check if we have translations in localStorage first (client-side only)
  // This is handled in the component
  
  // Return sample translations for the specified user
  const userTranslations = userId 
    ? sampleTranslations.filter(t => t.userId === userId)
    : sampleTranslations;
  
  return NextResponse.json({ translations: userTranslations });
}

export async function POST(request: Request) {
  const body = await request.json();
  
  // In a real app, this would save to a database
  // For now, we'll just return success
  
  return NextResponse.json({ success: true });
}
