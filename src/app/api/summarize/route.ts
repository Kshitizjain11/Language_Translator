import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text, length = 'medium', tone = 'neutral' } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Split text into sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    
    if (sentences.length === 0) {
      return NextResponse.json(
        { error: 'No valid sentences found in the text' },
        { status: 400 }
      );
    }

    // Determine summary length based on the length parameter
    let summaryLength = 0;
    switch (length) {
      case 'short':
        summaryLength = Math.max(1, Math.floor(sentences.length * 0.3));
        break;
      case 'medium':
        summaryLength = Math.max(1, Math.floor(sentences.length * 0.5));
        break;
      case 'long':
        summaryLength = Math.max(1, Math.floor(sentences.length * 0.7));
        break;
      default:
        summaryLength = Math.max(1, Math.floor(sentences.length * 0.5));
    }
    
    // Extract the most important sentences
    // For this simple implementation, we'll just take the first N sentences
    // In a real application, you would use NLP techniques to identify key sentences
    let summaryText = sentences.slice(0, summaryLength).join(' ');
    
    // Apply tone modifications
    summaryText = applyTone(summaryText, tone);
    
    // Count words in original and summary
    const originalWordCount = countWords(text);
    const summaryWordCount = countWords(summaryText);
    
    return NextResponse.json({
      summary: summaryText,
      stats: {
        originalWordCount,
        summaryWordCount,
        reductionPercentage: Math.round((1 - (summaryWordCount / originalWordCount)) * 100)
      }
    });
  } catch (error) {
    console.error('Summarization error:', error);
    return NextResponse.json(
      { error: 'Summarization service error' },
      { status: 500 }
    );
  }
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function applyTone(text: string, tone: string): string {
  switch (tone) {
    case 'formal':
      return text
        .replace(/gonna/g, 'going to')
        .replace(/wanna/g, 'want to')
        .replace(/don't/g, 'do not')
        .replace(/can't/g, 'cannot')
        .replace(/won't/g, 'will not')
        .replace(/I'm/g, 'I am')
        .replace(/you're/g, 'you are')
        .replace(/they're/g, 'they are')
        .replace(/we're/g, 'we are')
        .replace(/it's/g, 'it is')
        .replace(/that's/g, 'that is')
        .replace(/let's/g, 'let us')
        .replace(/ain't/g, 'is not');
    
    case 'casual':
      return text
        .replace(/therefore/g, 'so')
        .replace(/however/g, 'but')
        .replace(/additionally/g, 'also')
        .replace(/consequently/g, 'so')
        .replace(/furthermore/g, 'also')
        .replace(/nevertheless/g, 'still')
        .replace(/subsequently/g, 'later')
        .replace(/in conclusion/gi, 'to wrap up')
        .replace(/in summary/gi, 'basically')
        .replace(/regarding/g, 'about');
    
    case 'neutral':
    default:
      return text;
  }
}
