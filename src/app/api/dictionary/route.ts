import { NextResponse } from 'next/server';

// Sample dictionary database for fallback
interface DictionaryEntry {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  synonyms: string[];
  antonyms: string[];
}

// Fallback dictionary for when API is unavailable
const fallbackDictionary: Record<string, DictionaryEntry> = {
  "hello": {
    word: "hello",
    phonetic: "/həˈloʊ/",
    partOfSpeech: "exclamation",
    definition: "Used as a greeting or to begin a phone conversation.",
    example: "Hello there, how are you?",
    synonyms: ["hi", "greetings", "howdy", "hey"],
    antonyms: ["goodbye", "bye"]
  },
  "world": {
    word: "world",
    phonetic: "/wɜrld/",
    partOfSpeech: "noun",
    definition: "The earth, together with all of its countries and peoples.",
    example: "He traveled around the world.",
    synonyms: ["earth", "globe", "planet"],
    antonyms: []
  },
  "language": {
    word: "language",
    phonetic: "/ˈlæŋɡwɪdʒ/",
    partOfSpeech: "noun",
    definition: "The method of human communication, either spoken or written, consisting of the use of words in a structured and conventional way.",
    example: "English is a global language.",
    synonyms: ["speech", "tongue", "dialect", "idiom"],
    antonyms: ["silence"]
  },
  "translate": {
    word: "translate",
    phonetic: "/trænsˈleɪt/",
    partOfSpeech: "verb",
    definition: "Express the sense of (words or text) in another language.",
    example: "The book was translated into English.",
    synonyms: ["interpret", "render", "convert", "transcribe"],
    antonyms: []
  },
  "dictionary": {
    word: "dictionary",
    phonetic: "/ˈdɪkʃəˌnɛri/",
    partOfSpeech: "noun",
    definition: "A book or electronic resource that lists the words of a language and gives their meaning, or gives the equivalent words in a different language.",
    example: "I looked up the word in the dictionary.",
    synonyms: ["lexicon", "wordbook", "glossary", "thesaurus"],
    antonyms: []
  },
  "grammar": {
    word: "grammar",
    phonetic: "/ˈɡræmər/",
    partOfSpeech: "noun",
    definition: "The whole system and structure of a language or of languages in general, usually taken as consisting of syntax and morphology.",
    example: "The rules of English grammar.",
    synonyms: ["syntax", "usage", "structure"],
    antonyms: []
  },
  "summarize": {
    word: "summarize",
    phonetic: "/ˈsʌməˌraɪz/",
    partOfSpeech: "verb",
    definition: "Give a brief statement of the main points of (something).",
    example: "Can you summarize the main points of the article?",
    synonyms: ["recap", "outline", "review", "sum up"],
    antonyms: ["elaborate", "expand"]
  },
  "paraphrase": {
    word: "paraphrase",
    phonetic: "/ˈpærəˌfreɪz/",
    partOfSpeech: "verb",
    definition: "Express the meaning of (something written or spoken) using different words, especially to achieve greater clarity.",
    example: "She paraphrased the speech for her audience.",
    synonyms: ["reword", "rephrase", "restate", "rewrite"],
    antonyms: ["quote", "cite"]
  },
  "learning": {
    word: "learning",
    phonetic: "/ˈlɜrnɪŋ/",
    partOfSpeech: "noun",
    definition: "The acquisition of knowledge or skills through experience, study, or by being taught.",
    example: "These exercises promote learning.",
    synonyms: ["education", "study", "schooling", "training"],
    antonyms: ["ignorance"]
  },
  "tool": {
    word: "tool",
    phonetic: "/tuːl/",
    partOfSpeech: "noun",
    definition: "A device or implement, especially one held in the hand, used to carry out a particular function.",
    example: "The website offers various language tools.",
    synonyms: ["implement", "instrument", "device", "apparatus"],
    antonyms: []
  },
  "computer": {
    word: "computer",
    phonetic: "/kəmˈpjuːtər/",
    partOfSpeech: "noun",
    definition: "An electronic device for storing and processing data, typically in binary form, according to instructions given to it in a variable program.",
    example: "She works on her computer every day.",
    synonyms: ["PC", "machine", "processor", "system"],
    antonyms: []
  },
  "program": {
    word: "program",
    phonetic: "/ˈproʊɡræm/",
    partOfSpeech: "noun",
    definition: "A set of instructions that a computer follows to perform a particular task.",
    example: "The program runs smoothly on my computer.",
    synonyms: ["software", "application", "code", "system"],
    antonyms: []
  },
  "data": {
    word: "data",
    phonetic: "/ˈdeɪtə/",
    partOfSpeech: "noun",
    definition: "Facts and statistics collected together for reference or analysis.",
    example: "The data shows a significant increase in sales.",
    synonyms: ["information", "statistics", "figures", "facts"],
    antonyms: []
  },
  "network": {
    word: "network",
    phonetic: "/ˈnetwɜːrk/",
    partOfSpeech: "noun",
    definition: "A system of interconnected computers or other devices.",
    example: "The company has a secure network.",
    synonyms: ["system", "grid", "web", "interconnection"],
    antonyms: []
  },
  "internet": {
    word: "internet",
    phonetic: "/ˈɪntərnet/",
    partOfSpeech: "noun",
    definition: "A global computer network providing a variety of information and communication facilities.",
    example: "I found the information on the internet.",
    synonyms: ["web", "net", "cyberspace", "online"],
    antonyms: []
  },
  "software": {
    word: "software",
    phonetic: "/ˈsɔftwer/",
    partOfSpeech: "noun",
    definition: "The programs and other operating information used by a computer.",
    example: "The new software update is available.",
    synonyms: ["program", "application", "code", "system"],
    antonyms: ["hardware"]
  },
  "hardware": {
    word: "hardware",
    phonetic: "/ˈhɑːrdwer/",
    partOfSpeech: "noun",
    definition: "The physical components of a computer system.",
    example: "The hardware needs to be upgraded.",
    synonyms: ["equipment", "devices", "components", "machinery"],
    antonyms: ["software"]
  },
  "database": {
    word: "database",
    phonetic: "/ˈdeɪtəbeɪs/",
    partOfSpeech: "noun",
    definition: "A structured set of data held in a computer, especially one that is accessible in various ways.",
    example: "The information is stored in the database.",
    synonyms: ["databank", "repository", "archive", "store"],
    antonyms: []
  },
  "algorithm": {
    word: "algorithm",
    phonetic: "/ˈælɡərɪðəm/",
    partOfSpeech: "noun",
    definition: "A process or set of rules to be followed in calculations or other problem-solving operations.",
    example: "The algorithm efficiently sorts the data.",
    synonyms: ["procedure", "method", "process", "technique"],
    antonyms: []
  },
  "code": {
    word: "code",
    phonetic: "/koʊd/",
    partOfSpeech: "noun",
    definition: "A system of words, letters, figures, or other symbols substituted for other words, letters, etc., especially for the purposes of secrecy.",
    example: "The message was written in code.",
    synonyms: ["cipher", "encryption", "programming", "script"],
    antonyms: []
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get('word')?.toLowerCase();
  
  if (!word) {
    return NextResponse.json(
      { error: 'Word parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Try to fetch from Free Dictionary API first
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    
    if (response.ok) {
      const data = await response.json();
      
      // Process the API response
      if (data && data.length > 0) {
        const entry = data[0];
        const meanings = entry.meanings || [];
        
        // Extract definitions, examples, synonyms, and antonyms
        const definitions: string[] = [];
        const examples: string[] = [];
        const synonyms: string[] = [];
        const antonyms: string[] = [];
        
        meanings.forEach((meaning: any) => {
          if (meaning.definitions) {
            meaning.definitions.forEach((def: any) => {
              if (def.definition) {
                definitions.push(def.definition);
              }
              if (def.example) {
                examples.push(def.example);
              }
              if (def.synonyms) {
                synonyms.push(...def.synonyms);
              }
              if (def.antonyms) {
                antonyms.push(...def.antonyms);
              }
            });
          }
          if (meaning.synonyms) {
            synonyms.push(...meaning.synonyms);
          }
          if (meaning.antonyms) {
            antonyms.push(...meaning.antonyms);
          }
        });
        
        // Create a formatted response
        const formattedResponse = {
          word: entry.word,
          phonetic: entry.phonetic || entry.phonetics?.find((p: any) => p.text)?.text || "",
          partOfSpeech: meanings.map((m: any) => m.partOfSpeech).join(", "),
          definition: definitions.join("; "),
          example: examples.length > 0 ? examples[0] : "",
          synonyms: Array.from(new Set(synonyms)).slice(0, 10),
          antonyms: Array.from(new Set(antonyms)).slice(0, 10)
        };
        
        return NextResponse.json(formattedResponse);
      }
    }
    
    // If API fails or returns no results, try fallback dictionary
    const fallbackEntry = fallbackDictionary[word];
    
    if (fallbackEntry) {
      return NextResponse.json(fallbackEntry);
    }
    
    // If word not found in either source, return a "not found" response
    return NextResponse.json(
      { 
        error: 'Word not found',
        suggestions: findSimilarWords(word)
      },
      { status: 404 }
    );
    
  } catch (error) {
    console.error('Dictionary API error:', error);
    
    // Try fallback dictionary on error
    const fallbackEntry = fallbackDictionary[word];
    
    if (fallbackEntry) {
      return NextResponse.json(fallbackEntry);
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
