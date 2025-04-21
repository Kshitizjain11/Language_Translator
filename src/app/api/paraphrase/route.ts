import { NextResponse } from 'next/server';

// Common word replacements for different modes
const replacements = {
  standard: {
    'good': ['nice', 'great', 'fine', 'excellent'],
    'bad': ['poor', 'terrible', 'awful', 'unpleasant'],
    'big': ['large', 'huge', 'substantial', 'enormous'],
    'small': ['tiny', 'little', 'miniature', 'compact'],
    'happy': ['glad', 'joyful', 'pleased', 'delighted'],
    'sad': ['unhappy', 'sorrowful', 'depressed', 'downcast'],
    'important': ['significant', 'crucial', 'essential', 'vital'],
    'difficult': ['challenging', 'hard', 'tough', 'demanding'],
    'easy': ['simple', 'straightforward', 'effortless', 'uncomplicated'],
    'beautiful': ['attractive', 'gorgeous', 'stunning', 'lovely'],
    'ugly': ['unattractive', 'hideous', 'unsightly', 'grotesque'],
    'fast': ['quick', 'rapid', 'swift', 'speedy'],
    'slow': ['sluggish', 'unhurried', 'leisurely', 'gradual'],
    'interesting': ['fascinating', 'intriguing', 'engaging', 'captivating'],
    'boring': ['dull', 'tedious', 'monotonous', 'uninteresting']
  },
  
  fluency: {
    'however': ['nevertheless', 'nonetheless', 'even so', 'still'],
    'but': ['yet', 'though', 'although', 'however'],
    'and': ['additionally', 'furthermore', 'moreover', 'also'],
    'so': ['therefore', 'thus', 'consequently', 'as a result'],
    'because': ['since', 'as', 'due to the fact that', 'given that'],
    'if': ['provided that', 'assuming that', 'on condition that', 'in the event that'],
    'when': ['once', 'as soon as', 'the moment that', 'whenever'],
    'like': ['such as', 'similar to', 'comparable to', 'akin to'],
    'about': ['regarding', 'concerning', 'with respect to', 'in relation to'],
    'for example': ['for instance', 'as an illustration', 'to illustrate', 'by way of example'],
    'in conclusion': ['to sum up', 'in summary', 'to conclude', 'finally']
  },
  
  creative: {
    'walk': ['stroll', 'saunter', 'amble', 'stride', 'wander', 'meander'],
    'run': ['dash', 'sprint', 'race', 'bolt', 'scamper', 'hurry'],
    'look': ['gaze', 'stare', 'glance', 'peek', 'observe', 'examine'],
    'say': ['exclaim', 'declare', 'announce', 'proclaim', 'state', 'utter'],
    'happy': ['ecstatic', 'overjoyed', 'elated', 'thrilled', 'jubilant', 'gleeful'],
    'sad': ['heartbroken', 'despondent', 'melancholy', 'woeful', 'gloomy', 'dismal'],
    'angry': ['furious', 'enraged', 'irate', 'livid', 'incensed', 'indignant'],
    'scared': ['terrified', 'petrified', 'horrified', 'startled', 'alarmed', 'frightened'],
    'beautiful': ['breathtaking', 'magnificent', 'exquisite', 'splendid', 'dazzling', 'radiant'],
    'ugly': ['repulsive', 'revolting', 'ghastly', 'horrid', 'atrocious', 'repugnant']
  },
  
  academic: {
    'use': ['utilize', 'employ', 'implement', 'apply', 'exercise', 'deploy'],
    'show': ['demonstrate', 'exhibit', 'illustrate', 'indicate', 'manifest', 'display'],
    'think': ['consider', 'contemplate', 'deliberate', 'ponder', 'reflect', 'cogitate'],
    'find': ['discover', 'ascertain', 'determine', 'identify', 'discern', 'establish'],
    'help': ['facilitate', 'assist', 'aid', 'support', 'enable', 'contribute to'],
    'change': ['modify', 'alter', 'transform', 'convert', 'adapt', 'adjust'],
    'make': ['construct', 'fabricate', 'produce', 'generate', 'create', 'formulate'],
    'start': ['initiate', 'commence', 'begin', 'embark upon', 'instigate', 'inaugurate'],
    'end': ['conclude', 'terminate', 'cease', 'discontinue', 'finalize', 'culminate'],
    'increase': ['enhance', 'augment', 'amplify', 'intensify', 'escalate', 'elevate'],
    'decrease': ['diminish', 'reduce', 'lessen', 'decline', 'abate', 'minimize']
  }
};

// Academic transition phrases
const academicTransitions = [
  'Furthermore, ', 
  'Moreover, ', 
  'In addition, ', 
  'Consequently, ', 
  'Therefore, ',
  'Subsequently, ',
  'In contrast, ',
  'Conversely, ',
  'Alternatively, ',
  'Specifically, ',
  'Notably, ',
  'Particularly, ',
  'Indeed, ',
  'In essence, ',
  'In this context, '
];

export async function POST(request: Request) {
  try {
    const { text, mode = 'standard', synonymLevel = 50 } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Paraphrase the text
    const paraphrased = paraphraseText(text, mode, synonymLevel);
    
    // Count words
    const originalWordCount = countWords(text);
    const paraphrasedWordCount = countWords(paraphrased);
    
    return NextResponse.json({
      original: text,
      paraphrased,
      stats: {
        originalWordCount,
        paraphrasedWordCount,
        changePercentage: calculateChangePercentage(text, paraphrased)
      }
    });
  } catch (error) {
    console.error('Paraphrasing error:', error);
    return NextResponse.json(
      { error: 'Paraphrasing service error' },
      { status: 500 }
    );
  }
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function calculateChangePercentage(original: string, paraphrased: string): number {
  const originalWords = original.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const paraphrasedWords = paraphrased.toLowerCase().trim().split(/\s+/).filter(Boolean);
  
  let differentWords = 0;
  const minLength = Math.min(originalWords.length, paraphrasedWords.length);
  
  for (let i = 0; i < minLength; i++) {
    if (originalWords[i] !== paraphrasedWords[i]) {
      differentWords++;
    }
  }
  
  // Add any difference in length
  differentWords += Math.abs(originalWords.length - paraphrasedWords.length);
  
  // Calculate percentage
  return Math.round((differentWords / originalWords.length) * 100);
}

function paraphraseText(text: string, mode: string, synonymLevel: number): string {
  // Determine which replacement set to use
  const replacementSet = replacements[mode as keyof typeof replacements] || replacements.standard;
  
  // Determine how many words to replace based on synonym level
  const replacementProbability = synonymLevel / 100;
  
  // Apply different styles based on mode
  let modeMultiplier = 1;
  switch (mode) {
    case 'fluency':
      modeMultiplier = 0.7; // Less aggressive changes
      break;
    case 'creative':
      modeMultiplier = 1.5; // More aggressive changes
      break;
    case 'academic':
      modeMultiplier = 1.2;
      break;
  }
  
  // Split text into sentences for better processing
  const sentences = text.split(/(?<=[.!?])\s+/);
  let result = [];
  
  for (let i = 0; i < sentences.length; i++) {
    let sentence = sentences[i];
    
    // Apply word replacements
    for (const [word, alternatives] of Object.entries(replacementSet)) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      sentence = sentence.replace(regex, () => {
        // Decide whether to replace this instance
        if (Math.random() < replacementProbability * modeMultiplier) {
          const randomIndex = Math.floor(Math.random() * alternatives.length);
          return alternatives[randomIndex];
        }
        return word;
      });
    }
    
    // For academic mode, add transition phrases to some sentences
    if (mode === 'academic' && i > 0 && Math.random() < 0.3) {
      const randomTransition = academicTransitions[Math.floor(Math.random() * academicTransitions.length)];
      // Make the first letter lowercase if it's not a proper noun
      const firstChar = sentence.charAt(0);
      if (firstChar === firstChar.toLowerCase()) {
        sentence = randomTransition + sentence.charAt(0).toLowerCase() + sentence.slice(1);
      } else {
        sentence = randomTransition + sentence;
      }
    }
    
    result.push(sentence);
  }
  
  return result.join(' ');
}
