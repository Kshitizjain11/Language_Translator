'use client';

import React, { useState } from 'react';
import { FaSpinner, FaCopy, FaExchangeAlt, FaSlidersH } from 'react-icons/fa';

export default function Paraphraser() {
  const [text, setText] = useState('');
  const [paraphrased, setParaphrased] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'standard' | 'fluency' | 'creative' | 'academic'>('standard');
  const [synonymLevel, setSynonymLevel] = useState(50); // 0-100
  const [showSettings, setShowSettings] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const paraphraseText = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/paraphrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          mode,
          synonymLevel
        })
      });
      
      if (!response.ok) {
        throw new Error('Paraphrasing failed');
      }
      
      const data = await response.json();
      setParaphrased(data.paraphrased);
      
      // Update stats if available
      if (data.stats) {
        console.log('Paraphrase stats:', data.stats);
      }
    } catch (error) {
      console.error('Error paraphrasing text:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paraphrased);
  };

  const swapTexts = () => {
    if (paraphrased) {
      setText(paraphrased);
      setParaphrased('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white p-4 shadow-sm">
        <h2 className="text-xl font-semibold">Paraphraser</h2>
        <p className="text-gray-600 text-sm">Rewrite text in different styles while preserving meaning</p>
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4">
        <div className="flex-1 flex flex-col">
          <div className="mb-2 flex justify-between items-center">
            <label className="font-medium">Original Text</label>
            <div className="text-sm text-gray-500">{text.trim().split(/\s+/).filter(Boolean).length} words</div>
          </div>
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Enter or paste your text here to paraphrase..."
            className="flex-1 border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex-1 flex flex-col">
          <div className="mb-2 flex justify-between items-center">
            <label className="font-medium">Paraphrased Text</label>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-500">
                {paraphrased.trim().split(/\s+/).filter(Boolean).length} words
              </div>
              {paraphrased && (
                <>
                  <button 
                    onClick={copyToClipboard}
                    className="text-gray-500 hover:text-blue-600"
                    title="Copy to clipboard"
                  >
                    <FaCopy />
                  </button>
                  <button 
                    onClick={swapTexts}
                    className="text-gray-500 hover:text-blue-600"
                    title="Use as input"
                  >
                    <FaExchangeAlt />
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="flex-1 border border-gray-300 rounded p-3 overflow-auto bg-white">
            {paraphrased ? (
              <div>{paraphrased}</div>
            ) : (
              <div className="text-gray-400 h-full flex items-center justify-center">
                {loading ? 'Paraphrasing...' : 'Paraphrased text will appear here'}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 border-t">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center text-gray-700 hover:text-blue-600"
          >
            <FaSlidersH className="mr-2" />
            {showSettings ? 'Hide Settings' : 'Show Settings'}
          </button>
          
          <button 
            onClick={paraphraseText}
            disabled={!text.trim() || loading}
            className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50 flex items-center"
          >
            {loading && <FaSpinner className="animate-spin mr-2" />}
            Paraphrase
          </button>
        </div>
        
        {showSettings && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Paraphrasing Mode</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button
                  onClick={() => setMode('standard')}
                  className={`py-2 px-3 rounded ${mode === 'standard' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}
                >
                  Standard
                </button>
                <button
                  onClick={() => setMode('fluency')}
                  className={`py-2 px-3 rounded ${mode === 'fluency' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}
                >
                  Fluency
                </button>
                <button
                  onClick={() => setMode('creative')}
                  className={`py-2 px-3 rounded ${mode === 'creative' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}
                >
                  Creative
                </button>
                <button
                  onClick={() => setMode('academic')}
                  className={`py-2 px-3 rounded ${mode === 'academic' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}
                >
                  Academic
                </button>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between">
                <label className="block text-sm font-medium">Synonym Level</label>
                <span className="text-sm text-gray-500">{synonymLevel}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={synonymLevel}
                onChange={(e) => setSynonymLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Less Changes</span>
                <span>More Changes</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
