import { NextResponse } from 'next/server';
import { franc } from 'franc';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    // Use franc to detect the language
    const detectedLanguageCode = franc(text);

    // Map franc's ISO 639-3 codes to our application's language codes
    const languageMap: { [key: string]: string } = {
      eng: 'en',
      spa: 'es',
      fra: 'fr',
      deu: 'de',
      ita: 'it',
      por: 'pt',
      rus: 'ru',
      cmn: 'zh',
      jpn: 'ja',
      kor: 'ko',
    };

    const detectedLanguage = languageMap[detectedLanguageCode] || 'en';

    return NextResponse.json({ detectedLanguage });
  } catch (error) {
    console.error('Language detection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 