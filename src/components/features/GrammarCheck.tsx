'use client';

import React, { useState } from 'react';
import { FaCheck, FaExclamationTriangle, FaSpinner, FaArrowRight, FaSlidersH } from 'react-icons/fa';

interface GrammarError {
  type: string;
  message: string;
  original: string;
  suggestion: string;
}

export default function GrammarCheck() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [corrections, setCorrections] = useState<GrammarError[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [checkLevel, setCheckLevel] = useState<'basic' | 'standard' | 'advanced'>('standard');
  const [writingStyle, setWritingStyle] = useState<'general' | 'academic' | 'business'>('general');

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const checkGrammar = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/grammar-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text,
          checkLevel,
          writingStyle
        })
      });
      
      if (!response.ok) {
        throw new Error('Grammar check failed');
      }
      
      const data = await response.json();
      setCorrections(data.corrections);
    } catch (error) {
      console.error('Error checking grammar:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyCorrection = (index: number) => {
    const correction = corrections[index];
    const newText = text.replace(correction.original, correction.suggestion);
    setText(newText);
    setCorrections(corrections.filter((_, i) => i !== index));
  };

  const applyAllCorrections = () => {
    let newText = text;
    corrections.forEach(correction => {
      newText = newText.replace(correction.original, correction.suggestion);
    });
    setText(newText);
    setCorrections([]);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Grammar Check</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Check and correct grammar, spelling, and punctuation</p>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="mb-2 flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Text to Check</label>
                <div className="text-xs text-gray-500 dark:text-gray-400">{text.trim().split(/\s+/).filter(Boolean).length} words</div>
              </div>
              <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Enter or paste your text here to check grammar..."
                className="w-full h-40 resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <div className="mb-2 flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Suggestions</label>
                <div className="flex items-center space-x-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400">{corrections.length} issues found</div>
                  {corrections.length > 0 && (
                    <button 
                      onClick={applyAllCorrections}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Apply all corrections"
                    >
                      <FaCheck className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className="h-40 overflow-y-auto rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-3">
                {loading ? (
                  <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <FaSpinner className="animate-spin mr-2" />
                    Checking grammar...
                  </div>
                ) : corrections.length > 0 ? (
                  <div className="space-y-3">
                    {corrections.map((correction, index) => (
                      <div key={index} className="p-2 rounded bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
                        <div className="flex justify-between items-start mb-1">
                          <div className="text-red-500 text-sm font-medium">{correction.type}</div>
                          <button
                            onClick={() => applyCorrection(index)}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Apply correction"
                          >
                            <FaCheck className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-1">{correction.message}</p>
                        <div className="flex items-center space-x-2 text-xs">
                          <span className="text-red-500 line-through">{correction.original}</span>
                          <FaArrowRight className="text-gray-400" />
                          <span className="text-green-500">{correction.suggestion}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                    {text ? 'No grammar issues found' : 'Enter text to check grammar'}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <FaSlidersH className="w-4 h-4 mr-2" />
              {showSettings ? 'Hide Settings' : 'Show Settings'}
            </button>
            
            <button 
              onClick={checkGrammar}
              disabled={!text.trim() || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && <FaSpinner className="animate-spin w-4 h-4" />}
              <span>Check Grammar</span>
            </button>
          </div>

          {showSettings && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Check Level</label>
                <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                  {['basic', 'standard', 'advanced'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setCheckLevel(level as 'basic' | 'standard' | 'advanced')}
                      className={`flex-1 py-2 text-sm ${
                        checkLevel === level
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Writing Style</label>
                <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                  {['general', 'academic', 'business'].map((style) => (
                    <button
                      key={style}
                      onClick={() => setWritingStyle(style as 'general' | 'academic' | 'business')}
                      className={`flex-1 py-2 text-sm ${
                        writingStyle === style
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
