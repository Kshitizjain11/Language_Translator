'use client';

import React, { useState } from 'react';
import { FaSpinner, FaCopy, FaDownload, FaSlidersH } from 'react-icons/fa';

export default function Summarizer() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [tone, setTone] = useState<'neutral' | 'formal' | 'casual'>('neutral');
  const [wordCount, setWordCount] = useState({ original: 0, summary: 0 });
  const [showSettings, setShowSettings] = useState(false);

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setWordCount(prev => ({ ...prev, original: countWords(newText) }));
  };

  const summarizeText = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          length,
          tone
        })
      });
      
      if (!response.ok) {
        throw new Error('Summarization failed');
      }
      
      const data = await response.json();
      setSummary(data.summary);
      setWordCount({
        original: data.stats.originalWordCount,
        summary: data.stats.summaryWordCount
      });
    } catch (error) {
      console.error('Error summarizing text:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
  };

  const downloadSummary = () => {
    const element = document.createElement('a');
    const file = new Blob([summary], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'summary.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white p-4 shadow-sm">
        <h2 className="text-xl font-semibold">Summarizer</h2>
        <p className="text-gray-600 text-sm">Create concise summaries of long texts</p>
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4">
        <div className="flex-1 flex flex-col">
          <div className="mb-2 flex justify-between items-center">
            <label className="font-medium">Original Text</label>
            <div className="text-sm text-gray-500">{wordCount.original} words</div>
          </div>
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Enter or paste your text here to summarize..."
            className="flex-1 border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex-1 flex flex-col">
          <div className="mb-2 flex justify-between items-center">
            <label className="font-medium">Summary</label>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-500">{wordCount.summary} words</div>
              {summary && (
                <>
                  <button 
                    onClick={copyToClipboard}
                    className="text-gray-500 hover:text-blue-600"
                    title="Copy to clipboard"
                  >
                    <FaCopy />
                  </button>
                  <button 
                    onClick={downloadSummary}
                    className="text-gray-500 hover:text-blue-600"
                    title="Download summary"
                  >
                    <FaDownload />
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="flex-1 border border-gray-300 rounded p-3 overflow-auto bg-white">
            {summary ? (
              <div>{summary}</div>
            ) : (
              <div className="text-gray-400 h-full flex items-center justify-center">
                {loading ? 'Generating summary...' : 'Your summary will appear here'}
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
            onClick={summarizeText}
            disabled={!text.trim() || loading}
            className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50 flex items-center"
          >
            {loading && <FaSpinner className="animate-spin mr-2" />}
            Summarize
          </button>
        </div>
        
        {showSettings && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Summary Length</label>
              <div className="flex border rounded overflow-hidden">
                <button
                  onClick={() => setLength('short')}
                  className={`flex-1 py-2 ${length === 'short' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                  Short
                </button>
                <button
                  onClick={() => setLength('medium')}
                  className={`flex-1 py-2 ${length === 'medium' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                  Medium
                </button>
                <button
                  onClick={() => setLength('long')}
                  className={`flex-1 py-2 ${length === 'long' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                  Long
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Tone</label>
              <div className="flex border rounded overflow-hidden">
                <button
                  onClick={() => setTone('neutral')}
                  className={`flex-1 py-2 ${tone === 'neutral' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                  Neutral
                </button>
                <button
                  onClick={() => setTone('formal')}
                  className={`flex-1 py-2 ${tone === 'formal' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                  Formal
                </button>
                <button
                  onClick={() => setTone('casual')}
                  className={`flex-1 py-2 ${tone === 'casual' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                  Casual
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
