import { NextResponse } from 'next/server';

// Sample grammar errors database
const commonErrors = [
  {
    pattern: /\bthere\b/i,
    suggestion: 'their',
    type: 'spelling',
    description: 'Commonly confused word'
  },
  {
    pattern: /\bi\b/,
    suggestion: 'I',
    type: 'grammar',
    description: 'Pronoun "I" should be capitalized'
  },
  {
    pattern: /\bthey\'re\b/i,
    suggestion: 'their',
    type: 'spelling',
    description: 'Commonly confused word'
  },
  {
    pattern: /\btheir\b/i,
    suggestion: 'they\'re',
    type: 'spelling',
    description: 'Commonly confused word'
  },
  {
    pattern: /\byour\b/i,
    suggestion: 'you\'re',
    type: 'spelling',
    description: 'Commonly confused word'
  },
  {
    pattern: /\byou\'re\b/i,
    suggestion: 'your',
    type: 'spelling',
    description: 'Commonly confused word'
  },
  {
    pattern: /\beffect\b/i,
    suggestion: 'affect',
    type: 'spelling',
    description: 'Commonly confused word'
  },
  {
    pattern: /\baffect\b/i,
    suggestion: 'effect',
    type: 'spelling',
    description: 'Commonly confused word'
  },
  {
    pattern: /\bits\b/i,
    suggestion: 'it\'s',
    type: 'grammar',
    description: 'Possessive vs. contraction'
  },
  {
    pattern: /\bit\'s\b/i,
    suggestion: 'its',
    type: 'grammar',
    description: 'Possessive vs. contraction'
  },
  {
    pattern: /\bwho\'s\b/i,
    suggestion: 'whose',
    type: 'grammar',
    description: 'Possessive vs. contraction'
  },
  {
    pattern: /\bwhose\b/i,
    suggestion: 'who\'s',
    type: 'grammar',
    description: 'Possessive vs. contraction'
  },
  {
    pattern: /\bthen\b/i,
    suggestion: 'than',
    type: 'spelling',
    description: 'Commonly confused word'
  },
  {
    pattern: /\bthan\b/i,
    suggestion: 'then',
    type: 'spelling',
    description: 'Commonly confused word'
  },
  {
    pattern: /\blocate\b/i,
    suggestion: 'find',
    type: 'style',
    description: 'Simpler alternative'
  },
  {
    pattern: /\butilize\b/i,
    suggestion: 'use',
    type: 'style',
    description: 'Simpler alternative'
  },
  {
    pattern: /\bcommence\b/i,
    suggestion: 'begin',
    type: 'style',
    description: 'Simpler alternative'
  },
  {
    pattern: /\bgonna\b/i,
    suggestion: 'going to',
    type: 'style',
    description: 'Informal language'
  },
  {
    pattern: /\bwanna\b/i,
    suggestion: 'want to',
    type: 'style',
    description: 'Informal language'
  },
  {
    pattern: /\bgotta\b/i,
    suggestion: 'got to',
    type: 'style',
    description: 'Informal language'
  },
  {
    pattern: /\s\s+/g,
    suggestion: ' ',
    type: 'punctuation',
    description: 'Multiple spaces'
  },
  {
    pattern: /\.\./g,
    suggestion: '.',
    type: 'punctuation',
    description: 'Multiple periods'
  },
  {
    pattern: /\,\,/g,
    suggestion: ',',
    type: 'punctuation',
    description: 'Multiple commas'
  },
  {
    pattern: /\s+\./g,
    suggestion: '.',
    type: 'punctuation',
    description: 'Space before period'
  },
  {
    pattern: /\s+\,/g,
    suggestion: ',',
    type: 'punctuation',
    description: 'Space before comma'
  }
];

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Find grammar errors
    const errors = [];
    let id = 1;

    for (const errorPattern of commonErrors) {
      const matches = text.match(errorPattern.pattern);
      if (matches) {
        for (const match of matches) {
          const startIndex = text.indexOf(match);
          if (startIndex !== -1) {
            errors.push({
              id: `error-${id++}`,
              text: match,
              startIndex,
              endIndex: startIndex + match.length,
              type: errorPattern.type,
              suggestion: errorPattern.suggestion,
              description: errorPattern.description
            });
          }
        }
      }
    }

    // Count errors by type
    const stats = {
      spellingErrors: errors.filter(e => e.type === 'spelling').length,
      grammarErrors: errors.filter(e => e.type === 'grammar').length,
      punctuationErrors: errors.filter(e => e.type === 'punctuation').length,
      styleIssues: errors.filter(e => e.type === 'style').length
    };

    return NextResponse.json({ 
      errors,
      stats,
      correctedText: applyCorrectionsSuggestions(text, errors)
    });
  } catch (error) {
    console.error('Grammar check error:', error);
    return NextResponse.json(
      { error: 'Grammar check service error' },
      { status: 500 }
    );
  }
}

function applyCorrectionsSuggestions(text: string, errors: any[]): string {
  // Sort errors by their position from end to start to avoid index shifting
  const sortedErrors = [...errors].sort((a, b) => b.startIndex - a.startIndex);
  
  let result = text;
  for (const error of sortedErrors) {
    result = 
      result.substring(0, error.startIndex) + 
      error.suggestion + 
      result.substring(error.endIndex);
  }
  
  return result;
}
