'use client';

import React, { useState, useEffect } from 'react';
import { FaSearch, FaVolumeUp, FaSpinner, FaStar, FaRegStar, FaSlidersH } from 'react-icons/fa';

interface DictionaryEntry {
  word: string;
  phonetic: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
      synonyms: string[];
      antonyms: string[];
    }[];
  }[];
  audioUrl?: string;
}

export default function Dictionary() {
  const [word, setWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [entry, setEntry] = useState<DictionaryEntry | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [sourceLang, setSourceLang] = useState<'en' | 'es' | 'fr'>('en');

  const lookupWord = async () => {
    if (!word.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/dictionary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          word: word.trim().toLowerCase(),
          sourceLang
        })
      });
      
      if (!response.ok) {
        throw new Error('Dictionary lookup failed');
      }
      
      const data = await response.json();
      setEntry(data);
    } catch (error) {
      console.error('Error looking up word:', error);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = () => {
    if (entry?.audioUrl) {
      const audio = new Audio(entry.audioUrl);
      audio.play();
    }
  };

  const toggleFavorite = (word: string) => {
    setFavorites(prev => 
      prev.includes(word)
        ? prev.filter(w => w !== word)
        : [...prev, word]
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-800 p-4 shadow-sm">
        <h2 className="text-xl font-semibold text-white">Dictionary</h2>
        <p className="text-gray-300 text-sm">Look up word definitions, pronunciations, and examples</p>
      </div>
      
      <div className="flex-1 p-4">
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && lookupWord()}
                placeholder="Enter a word to look up..."
                className="w-full pl-4 pr-10 py-2 border border-gray-700 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={lookupWord}
                disabled={!word.trim() || loading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-blue-400 disabled:opacity-50"
              >
                {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
              </button>
            </div>
          </div>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-3 py-2 text-gray-300 hover:text-blue-400 border border-gray-700 rounded bg-gray-800"
          >
            <FaSlidersH />
          </button>
        </div>

        {showSettings && (
          <div className="mb-6 p-4 border border-gray-700 rounded bg-gray-800">
            <label className="block text-sm font-medium text-white mb-2">Source Language</label>
            <div className="flex border border-gray-700 rounded overflow-hidden">
              <button
                onClick={() => setSourceLang('en')}
                className={`flex-1 py-2 ${sourceLang === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                English
              </button>
              <button
                onClick={() => setSourceLang('es')}
                className={`flex-1 py-2 ${sourceLang === 'es' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                Spanish
              </button>
              <button
                onClick={() => setSourceLang('fr')}
                className={`flex-1 py-2 ${sourceLang === 'fr' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                French
              </button>
            </div>
          </div>
        )}
        
        {entry && (
          <div className="border border-gray-700 rounded bg-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold text-white">{entry.word}</h3>
                    {entry.audioUrl && (
                      <button
                        onClick={playAudio}
                        className="text-gray-300 hover:text-blue-400"
                        title="Play pronunciation"
                      >
                        <FaVolumeUp />
                      </button>
                    )}
                  </div>
                  {entry.phonetic && (
                    <div className="text-gray-400 mt-1">{entry.phonetic}</div>
                  )}
                </div>
                <button
                  onClick={() => toggleFavorite(entry.word)}
                  className="text-gray-300 hover:text-yellow-400"
                  title={favorites.includes(entry.word) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {favorites.includes(entry.word) ? <FaStar /> : <FaRegStar />}
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-gray-700">
              {entry.meanings.map((meaning, index) => (
                <div key={index} className="p-4">
                  <div className="text-blue-400 font-medium mb-2">
                    {meaning.partOfSpeech}
                  </div>
                  
                  {meaning.definitions.map((def, i) => (
                    <div key={i} className="mb-4 last:mb-0">
                      <div className="text-white mb-2">{def.definition}</div>
                      {def.example && (
                        <div className="text-gray-400 pl-4 border-l-2 border-gray-700">
                          "{def.example}"
                        </div>
                      )}
                      {(def.synonyms.length > 0 || def.antonyms.length > 0) && (
                        <div className="mt-2 text-sm">
                          {def.synonyms.length > 0 && (
                            <div className="text-gray-300">
                              <span className="text-gray-400">Synonyms: </span>
                              {def.synonyms.join(', ')}
                            </div>
                          )}
                          {def.antonyms.length > 0 && (
                            <div className="text-gray-300">
                              <span className="text-gray-400">Antonyms: </span>
                              {def.antonyms.join(', ')}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {!entry && !loading && word && (
          <div className="text-center py-12 border border-gray-700 rounded bg-gray-800">
            <p className="text-gray-400">
              No results found. Please try another word.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
