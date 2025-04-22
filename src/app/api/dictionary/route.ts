import { NextResponse } from 'next/server';

// Sample dictionary database for fallback
interface Definition {
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
}

interface DictionaryEntry {
  word: string;
  phonetic: string;
  audioUrl?: string;
  meanings: Meaning[];
}

// Fallback dictionary for when API is unavailable
const fallbackDictionary: Record<string, DictionaryEntry> = {
  "hello": {
    word: "hello",
    phonetic: "/həˈloʊ/",
    meanings: [{
      partOfSpeech: "exclamation",
      definitions: [{
        definition: "Used as a greeting or to begin a phone conversation.",
        example: "Hello there, how are you?",
        synonyms: ["hi", "greetings", "howdy", "hey"],
        antonyms: ["goodbye", "bye"]
      }],
      synonyms: ["hi", "greetings", "howdy", "hey"],
      antonyms: ["goodbye", "bye"]
    }],
    audioUrl: undefined
  },
  "world": {
    word: "world",
    phonetic: "/wɜrld/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "The earth, together with all of its countries and peoples.",
        example: "He traveled around the world.",
        synonyms: ["earth", "globe", "planet"],
        antonyms: []
      }],
      synonyms: ["earth", "globe", "planet"],
      antonyms: []
    }],
    audioUrl: undefined
  },
  "language": {
    word: "language",
    phonetic: "/ˈlæŋɡwɪdʒ/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "The method of human communication, either spoken or written, consisting of the use of words in a structured and conventional way.",
        example: "English is a global language.",
        synonyms: ["speech", "tongue", "dialect", "idiom"],
        antonyms: ["silence"]
      }],
      synonyms: ["speech", "tongue", "dialect", "idiom"],
      antonyms: ["silence"]
    }],
    audioUrl: undefined
  },
  "translate": {
    word: "translate",
    phonetic: "/trænsˈleɪt/",
    meanings: [{
      partOfSpeech: "verb",
      definitions: [{
        definition: "Express the sense of (words or text) in another language.",
        example: "The book was translated into English.",
        synonyms: ["interpret", "render", "convert", "transcribe"],
        antonyms: []
      }],
      synonyms: ["interpret", "render", "convert", "transcribe"],
      antonyms: []
    }],
    audioUrl: undefined
  },
  "dictionary": {
    word: "dictionary",
    phonetic: "/ˈdɪkʃəˌnɛri/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "A book or electronic resource that lists the words of a language and gives their meaning, or gives the equivalent words in a different language.",
        example: "I looked up the word in the dictionary.",
        synonyms: ["lexicon", "wordbook", "glossary", "thesaurus"],
        antonyms: []
      }],
      synonyms: ["lexicon", "wordbook", "glossary", "thesaurus"],
      antonyms: []
    }],
    audioUrl: undefined
  },
  "grammar": {
    word: "grammar",
    phonetic: "/ˈɡræmər/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "The whole system and structure of a language or of languages in general, usually taken as consisting of syntax and morphology.",
        example: "The rules of English grammar.",
        synonyms: ["syntax", "usage", "structure"],
        antonyms: []
      }],
      synonyms: ["syntax", "usage", "structure"],
      antonyms: []
    }],
    audioUrl: undefined
  },
  "summarize": {
    word: "summarize",
    phonetic: "/ˈsʌməˌraɪz/",
    meanings: [{
      partOfSpeech: "verb",
      definitions: [{
        definition: "Give a brief statement of the main points of (something).",
        example: "Can you summarize the main points of the article?",
        synonyms: ["recap", "outline", "review", "sum up"],
        antonyms: ["elaborate", "expand"]
      }],
      synonyms: ["recap", "outline", "review", "sum up"],
      antonyms: ["elaborate", "expand"]
    }],
    audioUrl: undefined
  },
  "paraphrase": {
    word: "paraphrase",
    phonetic: "/ˈpærəˌfreɪz/",
    meanings: [{
      partOfSpeech: "verb",
      definitions: [{
        definition: "Express the meaning of (something written or spoken) using different words, especially to achieve greater clarity.",
        example: "She paraphrased the speech for her audience.",
        synonyms: ["reword", "rephrase", "restate", "rewrite"],
        antonyms: ["quote", "cite"]
      }],
      synonyms: ["reword", "rephrase", "restate", "rewrite"],
      antonyms: ["quote", "cite"]
    }],
    audioUrl: undefined
  },
  "learning": {
    word: "learning",
    phonetic: "/ˈlɜrnɪŋ/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "The acquisition of knowledge or skills through experience, study, or by being taught.",
        example: "These exercises promote learning.",
        synonyms: ["education", "study", "schooling", "training"],
        antonyms: ["ignorance"]
      }],
      synonyms: ["education", "study", "schooling", "training"],
      antonyms: ["ignorance"]
    }],
    audioUrl: undefined
  },
  "tool": {
    word: "tool",
    phonetic: "/tuːl/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "A device or implement, especially one held in the hand, used to carry out a particular function.",
        example: "The website offers various language tools.",
        synonyms: ["implement", "instrument", "device", "apparatus"],
        antonyms: []
      }],
      synonyms: ["implement", "instrument", "device", "apparatus"],
      antonyms: []
    }],
    audioUrl: undefined
  },
  "computer": {
    word: "computer",
    phonetic: "/kəmˈpjuːtər/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "An electronic device for storing and processing data, typically in binary form, according to instructions given to it in a variable program.",
        example: "She works on her computer every day.",
        synonyms: ["PC", "machine", "processor", "system"],
        antonyms: []
      }],
      synonyms: ["PC", "machine", "processor", "system"],
      antonyms: []
    }],
    audioUrl: undefined
  },
  "program": {
    word: "program",
    phonetic: "/ˈproʊɡræm/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "A set of instructions that a computer follows to perform a particular task.",
        example: "The program runs smoothly on my computer.",
        synonyms: ["software", "application", "code", "system"],
        antonyms: []
      }],
      synonyms: ["software", "application", "code", "system"],
      antonyms: []
    }],
    audioUrl: undefined
  },
  "data": {
    word: "data",
    phonetic: "/ˈdeɪtə/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "Facts and statistics collected together for reference or analysis.",
        example: "The data shows a significant increase in sales.",
        synonyms: ["information", "statistics", "figures", "facts"],
        antonyms: []
      }],
      synonyms: ["information", "statistics", "figures", "facts"],
      antonyms: []
    }],
    audioUrl: undefined
  },
  "network": {
    word: "network",
    phonetic: "/ˈnetwɜːrk/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "A system of interconnected computers or other devices.",
        example: "The company has a secure network.",
        synonyms: ["system", "grid", "web", "interconnection"],
        antonyms: []
      }],
      synonyms: ["system", "grid", "web", "interconnection"],
      antonyms: []
    }],
    audioUrl: undefined
  },
  "internet": {
    word: "internet",
    phonetic: "/ˈɪntərnet/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "A global computer network providing a variety of information and communication facilities.",
        example: "I found the information on the internet.",
        synonyms: ["web", "net", "cyberspace", "online"],
        antonyms: []
      }],
      synonyms: ["web", "net", "cyberspace", "online"],
      antonyms: []
    }],
    audioUrl: undefined
  },
  "software": {
    word: "software",
    phonetic: "/ˈsɔftwer/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "The programs and other operating information used by a computer.",
        example: "The new software update is available.",
        synonyms: ["program", "application", "code", "system"],
        antonyms: ["hardware"]
      }],
      synonyms: ["program", "application", "code", "system"],
      antonyms: ["hardware"]
    }],
    audioUrl: undefined
  },
  "hardware": {
    word: "hardware",
    phonetic: "/ˈhɑːrdwer/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "The physical components of a computer system.",
        example: "The hardware needs to be upgraded.",
        synonyms: ["equipment", "devices", "components", "machinery"],
        antonyms: ["software"]
      }],
      synonyms: ["equipment", "devices", "components", "machinery"],
      antonyms: ["software"]
    }],
    audioUrl: undefined
  },
  "database": {
    word: "database",
    phonetic: "/ˈdeɪtəbeɪs/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "A structured set of data held in a computer, especially one that is accessible in various ways.",
        example: "The information is stored in the database.",
        synonyms: ["databank", "repository", "archive", "store"],
        antonyms: []
      }],
      synonyms: ["databank", "repository", "archive", "store"],
      antonyms: []
    }],
    audioUrl: undefined
  },
  "algorithm": {
    word: "algorithm",
    phonetic: "/ˈælɡərɪðəm/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "A process or set of rules to be followed in calculations or other problem-solving operations.",
        example: "The algorithm efficiently sorts the data.",
        synonyms: ["procedure", "method", "process", "technique"],
        antonyms: []
      }],
      synonyms: ["procedure", "method", "process", "technique"],
      antonyms: []
    }],
    audioUrl: undefined
  },
  "code": {
    word: "code",
    phonetic: "/koʊd/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "A system of words, letters, figures, or other symbols substituted for other words, letters, etc., especially for the purposes of secrecy.",
        example: "The message was written in code.",
        synonyms: ["cipher", "encryption", "programming", "script"],
        antonyms: []
      }],
      synonyms: ["cipher", "encryption", "programming", "script"],
      antonyms: []
    }],
    audioUrl: undefined
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get('word')?.toLowerCase();
  const sourceLang = searchParams.get('sourceLang') || 'en';
  
  console.log('Dictionary API request:', { word, sourceLang });
  
  if (!word) {
    console.log('No word provided');
    return NextResponse.json(
      { error: 'Word parameter is required' },
      { status: 400 }
    );
  }

  try {
    if (sourceLang !== 'en') {
      console.log('Unsupported language:', sourceLang);
      return NextResponse.json(
        { error: 'Only English dictionary is currently supported' },
        { status: 400 }
      );
    }

    console.log('Fetching from Free Dictionary API:', word);
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    console.log('Free Dictionary API response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Free Dictionary API data:', JSON.stringify(data, null, 2));
      
      if (data && data.length > 0) {
        const entry = data[0];
        
        // Get audio URL if available
        const phonetics = entry.phonetics || [];
        const audioUrl = phonetics.find((p: any) => p.audio)?.audio || undefined;
        
        // Process all meanings and their definitions
        const meanings = (entry.meanings || []).map((meaning: any) => ({
          partOfSpeech: meaning.partOfSpeech || '',
          definitions: (meaning.definitions || []).map((def: any) => ({
            definition: def.definition || '',
            example: def.example || undefined,
            synonyms: def.synonyms || [],
            antonyms: def.antonyms || []
          })),
          synonyms: meaning.synonyms || [],
          antonyms: meaning.antonyms || []
        }));
        
        // Create a formatted response
        const formattedResponse: DictionaryEntry = {
          word: entry.word,
          phonetic: entry.phonetic || phonetics.find((p: any) => p.text)?.text || "",
          audioUrl,
          meanings
        };
        
        console.log('Sending formatted response:', formattedResponse);
        return NextResponse.json(formattedResponse);
      }
    }
    
    // If API fails or returns no results, try fallback dictionary
    console.log('Trying fallback dictionary for word:', word);
    const fallbackEntry = fallbackDictionary[word];
    
    if (fallbackEntry) {
      // Convert fallback entry to new format
      const formattedFallback: DictionaryEntry = {
        word: fallbackEntry.word,
        phonetic: fallbackEntry.phonetic,
        audioUrl: fallbackEntry.audioUrl,
        meanings: [{
          partOfSpeech: fallbackEntry.meanings[0].partOfSpeech,
          definitions: fallbackEntry.meanings[0].definitions,
          synonyms: fallbackEntry.meanings[0].synonyms,
          antonyms: fallbackEntry.meanings[0].antonyms
        }]
      };
      
      console.log('Found word in fallback dictionary:', formattedFallback);
      return NextResponse.json(formattedFallback);
    }
    
    console.log('Word not found in any source');
    return NextResponse.json(
      { 
        error: 'Word not found',
        suggestions: findSimilarWords(word)
      },
      { status: 404 }
    );
    
  } catch (error) {
    console.error('Dictionary API error:', error);
    
    const fallbackEntry = fallbackDictionary[word];
    if (fallbackEntry) {
      // Convert fallback entry to new format
      const formattedFallback: DictionaryEntry = {
        word: fallbackEntry.word,
        phonetic: fallbackEntry.phonetic,
        audioUrl: fallbackEntry.audioUrl,
        meanings: [{
          partOfSpeech: fallbackEntry.meanings[0].partOfSpeech,
          definitions: fallbackEntry.meanings[0].definitions,
          synonyms: fallbackEntry.meanings[0].synonyms,
          antonyms: fallbackEntry.meanings[0].antonyms
        }]
      };
      
      console.log('Found word in fallback dictionary after error:', formattedFallback);
      return NextResponse.json(formattedFallback);
    }
    
    return NextResponse.json(
      { 
        error: 'Dictionary service error',
        suggestions: findSimilarWords(word)
      },
      { status: 500 }
    );
  }
}

// Find similar words for suggestions
function findSimilarWords(word: string): string[] {
  const allWords = Object.keys(fallbackDictionary);
  
  // Simple similarity - words that start with the same letter
  const sameLetter = allWords.filter(w => w[0] === word[0]);
  
  // Words with similar length
  const similarLength = allWords.filter(w => Math.abs(w.length - word.length) <= 2);
  
  // Combine and remove duplicates
  const combinedArray = [...sameLetter, ...similarLength];
  const uniqueArray = Array.from(new Set(combinedArray));
  const suggestions = uniqueArray.slice(0, 5);
  
  return suggestions;
}
