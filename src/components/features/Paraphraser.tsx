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
    <div className="flex flex-col h-full">
      <div className="bg-gray-800 p-4 shadow-sm">
        <h2 className="text-xl font-semibold text-white">Paraphraser</h2>
        <p className="text-gray-300 text-sm">Rewrite text in different styles while preserving meaning</p>
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4">
        <div className="flex-1 flex flex-col">
          <div className="mb-2 flex justify-between items-center">
            <label className="font-medium text-white">Original Text</label>
            <div className="text-sm text-gray-300">{text.trim().split(/\s+/).filter(Boolean).length} words</div>
          </div>
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Enter or paste your text here to paraphrase..."
            className="flex-1 border border-gray-700 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white placeholder-gray-400"
          />
        </div>
        
        <div className="flex-1 flex flex-col">
          <div className="mb-2 flex justify-between items-center">
            <label className="font-medium text-white">Paraphrased Text</label>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-300">{paraphrased.trim().split(/\s+/).filter(Boolean).length} words</div>
              {paraphrased && (
                <>
                  <button 
                    onClick={copyToClipboard}
                    className="text-gray-300 hover:text-blue-400"
                    title="Copy to clipboard"
                  >
                    <FaCopy />
                  </button>
                  <button 
                    onClick={swapTexts}
                    className="text-gray-300 hover:text-blue-400"
                    title="Use as input"
                  >
                    <FaExchangeAlt />
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="flex-1 border border-gray-700 rounded p-3 overflow-auto bg-gray-800">
            {paraphrased ? (
              <div className="text-white">{paraphrased}</div>
            ) : (
              <div className="text-gray-400 h-full flex items-center justify-center">
                {loading ? 'Paraphrasing...' : 'Paraphrased text will appear here'}
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
            onClick={paraphraseText}
            disabled={!text.trim() || loading}
            className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50 flex items-center hover:bg-blue-700"
          >
            {loading && <FaSpinner className="animate-spin mr-2" />}
            Paraphrase
          </button>
        </div>
        
        {showSettings && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Style</label>
              <div className="flex border border-gray-700 rounded overflow-hidden">
                <button
                  onClick={() => setStyle('professional')}
                  className={`flex-1 py-2 ${style === 'professional' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  Professional
                </button>
                <button
                  onClick={() => setStyle('casual')}
                  className={`flex-1 py-2 ${style === 'casual' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  Casual
                </button>
                <button
                  onClick={() => setStyle('creative')}
                  className={`flex-1 py-2 ${style === 'creative' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  Creative
                </button>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between">
                <label className="block text-sm font-medium text-white">Synonym Level</label>
                <span className="text-sm text-gray-300">{synonymLevel}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={synonymLevel}
                onChange={(e) => setSynonymLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer mt-2"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
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
