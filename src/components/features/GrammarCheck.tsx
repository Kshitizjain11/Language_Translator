'use client';

import React, { useState } from 'react';
import { FaCheck, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';

interface GrammarError {
  id: string;
  text: string;
  startIndex: number;
  endIndex: number;
  type: 'spelling' | 'grammar' | 'punctuation' | 'style';
  suggestion: string;
}

export default function GrammarCheck() {
  const [text, setText] = useState('');
  const [errors, setErrors] = useState<GrammarError[]>([]);
  const [loading, setLoading] = useState(false);
  const [correctedText, setCorrectedText] = useState('');
  const [stats, setStats] = useState({ 
    spellingErrors: 0, 
    grammarErrors: 0, 
    punctuationErrors: 0,
    styleIssues: 0
  });

  const checkGrammar = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      if (!response.ok) {
        throw new Error('Grammar check failed');
      }
      
      const data = await response.json();
      setErrors(data.errors);
      setStats(data.stats);
      setCorrectedText(data.correctedText);
    } catch (error) {
      console.error('Error checking grammar:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyCorrections = () => {
    let result = text;
    // Sort errors by their position from end to start to avoid index shifting
    const sortedErrors = [...errors].sort((a, b) => b.startIndex - a.startIndex);
    
    for (const error of sortedErrors) {
      result = 
        result.substring(0, error.startIndex) + 
        error.suggestion + 
        result.substring(error.endIndex);
    }
    
    setCorrectedText(result);
  };

  const highlightText = () => {
    if (errors.length === 0) return text;
    
    let result = [];
    let lastIndex = 0;
    
    // Sort errors by their start position
    const sortedErrors = [...errors].sort((a, b) => a.startIndex - b.startIndex);
    
    for (const error of sortedErrors) {
      if (error.startIndex > lastIndex) {
        // Add text before the error
        result.push(text.substring(lastIndex, error.startIndex));
      }
      
      // Add highlighted error
      const errorClass = `bg-${getErrorColor(error.type)}-100 border-b-2 border-${getErrorColor(error.type)}-400 rounded px-1`;
      result.push(
        <span key={error.id} className={errorClass} title={error.suggestion}>
          {text.substring(error.startIndex, error.endIndex)}
        </span>
      );
      
      lastIndex = error.endIndex;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      result.push(text.substring(lastIndex));
    }
    
    return result;
  };
  
  const getErrorColor = (type: string): string => {
    switch (type) {
      case 'spelling': return 'red';
      case 'grammar': return 'yellow';
      case 'punctuation': return 'blue';
      case 'style': return 'purple';
      default: return 'gray';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white p-4 shadow-sm">
        <h2 className="text-xl font-semibold">Grammar Check</h2>
        <p className="text-gray-600 text-sm">Check your text for grammar, spelling, and style issues</p>
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4">
        <div className="flex-1 flex flex-col">
          <div className="mb-2 flex justify-between items-center">
            <label className="font-medium">Your Text</label>
            <button 
              onClick={checkGrammar}
              disabled={!text.trim() || loading}
              className="bg-blue-600 text-white px-4 py-1 rounded text-sm disabled:opacity-50"
            >
              {loading ? <FaSpinner className="animate-spin inline mr-1" /> : 'Check Text'}
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter or paste your text here..."
            className="flex-1 border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex-1 flex flex-col">
          <div className="mb-2 flex justify-between items-center">
            <label className="font-medium">Corrected Text</label>
            <button 
              onClick={applyCorrections}
              disabled={errors.length === 0}
              className="bg-green-600 text-white px-4 py-1 rounded text-sm disabled:opacity-50"
            >
              Apply All Corrections
            </button>
          </div>
          <div className="flex-1 border border-gray-300 rounded p-3 overflow-auto bg-white">
            {correctedText ? (
              <div>{correctedText}</div>
            ) : errors.length > 0 ? (
              <div>{highlightText()}</div>
            ) : (
              <div className="text-gray-400 h-full flex items-center justify-center">
                {loading ? 'Checking your text...' : 'Corrected text will appear here'}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {errors.length > 0 && (
        <div className="bg-gray-50 p-4 border-t">
          <h3 className="font-medium mb-2">Issues Found</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded shadow-sm border">
              <div className="text-red-500 font-bold text-xl">{stats.spellingErrors}</div>
              <div className="text-sm">Spelling</div>
            </div>
            <div className="bg-white p-3 rounded shadow-sm border">
              <div className="text-yellow-500 font-bold text-xl">{stats.grammarErrors}</div>
              <div className="text-sm">Grammar</div>
            </div>
            <div className="bg-white p-3 rounded shadow-sm border">
              <div className="text-blue-500 font-bold text-xl">{stats.punctuationErrors}</div>
              <div className="text-sm">Punctuation</div>
            </div>
            <div className="bg-white p-3 rounded shadow-sm border">
              <div className="text-purple-500 font-bold text-xl">{stats.styleIssues}</div>
              <div className="text-sm">Style</div>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="font-medium mb-2">Suggestions</h3>
            <ul className="bg-white rounded border divide-y">
              {errors.map(error => (
                <li key={error.id} className="p-3 flex justify-between items-center">
                  <div>
                    <span className={`inline-block w-2 h-2 rounded-full bg-${getErrorColor(error.type)}-500 mr-2`}></span>
                    <span className="font-medium">{error.text}</span>
                    <span className="text-gray-500 mx-2">→</span>
                    <span className="text-green-600">{error.suggestion}</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    Apply
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
