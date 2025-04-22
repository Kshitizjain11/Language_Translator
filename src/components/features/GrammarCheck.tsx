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
    <div className="flex flex-col h-full">
      <div className="bg-gray-800 p-4 shadow-sm">
        <h2 className="text-xl font-semibold text-white">Grammar Check</h2>
        <p className="text-gray-300 text-sm">Check and correct grammar, spelling, and punctuation</p>
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4">
        <div className="flex-1 flex flex-col">
          <div className="mb-2 flex justify-between items-center">
            <label className="font-medium text-white">Text to Check</label>
            <div className="text-sm text-gray-300">{text.trim().split(/\s+/).filter(Boolean).length} words</div>
          </div>
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Enter or paste your text here to check grammar..."
            className="flex-1 border border-gray-700 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white placeholder-gray-400"
          />
        </div>
        
        <div className="flex-1 flex flex-col">
          <div className="mb-2 flex justify-between items-center">
            <label className="font-medium text-white">Suggestions</label>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-300">{corrections.length} issues found</div>
              {corrections.length > 0 && (
                <button 
                  onClick={applyAllCorrections}
                  className="text-gray-300 hover:text-blue-400"
                  title="Apply all corrections"
                >
                  <FaCheck />
                </button>
              )}
            </div>
          </div>
          <div className="flex-1 border border-gray-700 rounded p-3 overflow-auto bg-gray-800">
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                <FaSpinner className="animate-spin mr-2" />
                Checking grammar...
              </div>
            ) : corrections.length > 0 ? (
              <div className="space-y-4">
                {corrections.map((correction, index) => (
                  <div key={index} className="p-3 rounded bg-gray-700 border border-gray-600">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-red-400">{correction.type}</div>
                      <button
                        onClick={() => applyCorrection(index)}
                        className="text-gray-300 hover:text-blue-400"
                        title="Apply correction"
                      >
                        <FaCheck className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gray-300 mb-2">{correction.message}</p>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-red-400 line-through">{correction.original}</span>
                      <FaArrowRight className="text-gray-400" />
                      <span className="text-green-400">{correction.suggestion}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                {text ? 'No grammar issues found' : 'Enter text to check grammar'}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-4 border-t border-gray-700">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center text-gray-300 hover:text-blue-400"
          >
            <FaSlidersH className="mr-2" />
            {showSettings ? 'Hide Settings' : 'Show Settings'}
          </button>
          
          <button 
            onClick={checkGrammar}
            disabled={!text.trim() || loading}
            className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50 flex items-center hover:bg-blue-700"
          >
            {loading && <FaSpinner className="animate-spin mr-2" />}
            Check Grammar
          </button>
        </div>
        
        {showSettings && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Check Level</label>
              <div className="flex border border-gray-700 rounded overflow-hidden">
                <button
                  onClick={() => setCheckLevel('basic')}
                  className={`flex-1 py-2 ${checkLevel === 'basic' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  Basic
                </button>
                <button
                  onClick={() => setCheckLevel('standard')}
                  className={`flex-1 py-2 ${checkLevel === 'standard' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  Standard
                </button>
                <button
                  onClick={() => setCheckLevel('advanced')}
                  className={`flex-1 py-2 ${checkLevel === 'advanced' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  Advanced
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">Writing Style</label>
              <div className="flex border border-gray-700 rounded overflow-hidden">
                <button
                  onClick={() => setWritingStyle('general')}
                  className={`flex-1 py-2 ${writingStyle === 'general' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  General
                </button>
                <button
                  onClick={() => setWritingStyle('academic')}
                  className={`flex-1 py-2 ${writingStyle === 'academic' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  Academic
                </button>
                <button
                  onClick={() => setWritingStyle('business')}
                  className={`flex-1 py-2 ${writingStyle === 'business' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  Business
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
