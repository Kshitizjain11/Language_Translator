'use client';

import React, { useState, useEffect } from 'react';
import { FaSearch, FaVolumeUp, FaBookmark, FaStar } from 'react-icons/fa';

interface WordDefinition {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
}

export default function Dictionary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WordDefinition | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load history and favorites from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('dictionaryRecentSearches');
    const savedFavorites = localStorage.getItem('dictionaryFavorites');
    
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save history and favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('dictionaryRecentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    localStorage.setItem('dictionaryFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const searchWord = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    
    try {
      const response = await fetch(`/api/dictionary?word=${encodeURIComponent(searchTerm.trim())}`);
      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
        
        // Add to recent searches if not already there
        if (!recentSearches.includes(searchTerm.toLowerCase())) {
          setRecentSearches(prev => [searchTerm.toLowerCase(), ...prev].slice(0, 10));
        }
      } else if (response.status === 404) {
        // Word not found
        setResult(null);
        // Show suggestions if available
        if (data.suggestions && data.suggestions.length > 0) {
          setRecentSearches(data.suggestions);
        }
      } else {
        console.error('Error searching for word:', data.error);
      }
    } catch (error) {
      console.error('Error searching for word:', error);
    } finally {
      setLoading(false);
    }
  };

  const speakWord = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const toggleFavorite = (word: string) => {
    if (favorites.includes(word)) {
      setFavorites(favorites.filter(w => w !== word));
    } else {
      setFavorites([...favorites, word]);
    }
  };

  const clearHistory = () => {
    setRecentSearches([]);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white p-4 shadow-sm">
        <h2 className="text-xl font-semibold">Dictionary</h2>
        <p className="text-gray-600 text-sm">Look up word definitions, synonyms, and antonyms</p>
      </div>
      
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchWord()}
            placeholder="Enter a word..."
            className="w-full border border-gray-300 rounded-lg py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={searchWord}
            disabled={!searchTerm.trim() || loading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
          >
            <FaSearch />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : result ? (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold">{result.word}</h3>
                <div className="text-gray-600 flex items-center">
                  {result.phonetic} 
                  <button 
                    onClick={() => speakWord(result.word)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <FaVolumeUp />
                  </button>
                </div>
              </div>
              <button 
                onClick={() => toggleFavorite(result.word)}
                className={`${favorites.includes(result.word) ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500`}
              >
                <FaStar size={20} />
              </button>
            </div>
            
            <div className="mt-4">
              <div className="text-sm font-medium text-blue-600 uppercase">{result.partOfSpeech}</div>
              <div className="mt-1">
                <div className="font-medium">Definition:</div>
                <p className="text-gray-700">{result.definition}</p>
              </div>
              
              {result.example && (
                <div className="mt-2">
                  <div className="font-medium">Example:</div>
                  <p className="text-gray-700 italic">"{result.example}"</p>
                </div>
              )}
              
              {result.synonyms.length > 0 && (
                <div className="mt-2">
                  <div className="font-medium">Synonyms:</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {result.synonyms.map(synonym => (
                      <span 
                        key={synonym} 
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm cursor-pointer hover:bg-blue-200"
                        onClick={() => {
                          setSearchTerm(synonym);
                          searchWord();
                        }}
                      >
                        {synonym}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {result.antonyms.length > 0 && (
                <div className="mt-2">
                  <div className="font-medium">Antonyms:</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {result.antonyms.map(antonym => (
                      <span 
                        key={antonym} 
                        className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm cursor-pointer hover:bg-red-200"
                        onClick={() => {
                          setSearchTerm(antonym);
                          searchWord();
                        }}
                      >
                        {antonym}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            {recentSearches.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">Recent Searches</h3>
                  <button 
                    onClick={clearHistory}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Clear History
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map(term => (
                    <span 
                      key={term} 
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200"
                      onClick={() => {
                        setSearchTerm(term);
                        searchWord();
                      }}
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {favorites.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">Favorites</h3>
                  <button 
                    onClick={clearFavorites}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Clear Favorites
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {favorites.map(term => (
                    <span 
                      key={term} 
                      className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-yellow-200 flex items-center"
                      onClick={() => {
                        setSearchTerm(term);
                        searchWord();
                      }}
                    >
                      <FaStar className="mr-1 text-yellow-500" size={12} />
                      {term}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {recentSearches.length === 0 && favorites.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Search for a word to see its definition
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
