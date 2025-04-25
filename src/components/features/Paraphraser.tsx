'use client';

import React, { useState } from 'react';
import { FaSpinner, FaCopy, FaExchangeAlt, FaSlidersH, FaDownload } from 'react-icons/fa';

export default function Paraphraser() {
  const [text, setText] = useState('');
  const [paraphrased, setParaphrased] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'standard' | 'fluency' | 'creative' | 'academic'>('standard');
  const [synonymLevel, setSynonymLevel] = useState(50); // 0-100
  const [showSettings, setShowSettings] = useState(false);
  const [style, setStyle] = useState<'professional' | 'casual' | 'creative'>('professional');

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
    <div className="container mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Paraphraser</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Rewrite text in different styles while preserving meaning</p>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="mb-2 flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Original Text</label>
                <div className="text-xs text-gray-500 dark:text-gray-400">{text.trim().split(/\s+/).filter(Boolean).length} words</div>
              </div>
              <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Enter or paste your text here to paraphrase..."
                className="w-full h-40 resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <div className="mb-2 flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Paraphrased Text</label>
                <div className="flex items-center space-x-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400">{paraphrased.trim().split(/\s+/).filter(Boolean).length} words</div>
                  {paraphrased && (
                    <>
                      <button 
                        onClick={copyToClipboard}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Copy to clipboard"
                      >
                        <FaCopy className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={swapTexts}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Use as input"
                      >
                        <FaExchangeAlt className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="h-40 overflow-y-auto rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-3">
                {paraphrased ? (
                  <div className="text-gray-900 dark:text-white">{paraphrased}</div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                    {loading ? 'Paraphrasing...' : 'Paraphrased text will appear here'}
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
              onClick={paraphraseText}
              disabled={!text.trim() || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && <FaSpinner className="animate-spin w-4 h-4" />}
              <span>Paraphrase</span>
            </button>
          </div>

          {showSettings && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Style</label>
                <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                  {['professional', 'casual', 'creative'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStyle(s as 'professional' | 'casual' | 'creative')}
                      className={`flex-1 py-2 text-sm ${
                        style === s
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Synonym Level</label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{synonymLevel}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={synonymLevel}
                  onChange={(e) => setSynonymLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Less Changes</span>
                  <span>More Changes</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
