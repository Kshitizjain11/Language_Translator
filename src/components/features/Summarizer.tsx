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
    <div className="container mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Summarizer</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Create concise summaries of long texts</p>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="mb-2 flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Original Text</label>
                <div className="text-xs text-gray-500 dark:text-gray-400">{wordCount.original} words</div>
              </div>
              <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Enter or paste your text here to summarize..."
                className="w-full h-40 resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <div className="mb-2 flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Summary</label>
                <div className="flex items-center space-x-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400">{wordCount.summary} words</div>
                  {summary && (
                    <>
                      <button 
                        onClick={copyToClipboard}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Copy to clipboard"
                      >
                        <FaCopy className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={downloadSummary}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Download summary"
                      >
                        <FaDownload className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="h-40 overflow-y-auto rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-3">
                {summary ? (
                  <div className="text-gray-900 dark:text-white">{summary}</div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                    {loading ? 'Generating summary...' : 'Your summary will appear here'}
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
              onClick={summarizeText}
              disabled={!text.trim() || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && <FaSpinner className="animate-spin w-4 h-4" />}
              <span>Summarize</span>
            </button>
          </div>

          {showSettings && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Summary Length</label>
                <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                  {['short', 'medium', 'long'].map((len) => (
                    <button
                      key={len}
                      onClick={() => setLength(len as 'short' | 'medium' | 'long')}
                      className={`flex-1 py-2 text-sm ${
                        length === len
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      {len.charAt(0).toUpperCase() + len.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tone</label>
                <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                  {['neutral', 'formal', 'casual'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t as 'neutral' | 'formal' | 'casual')}
                      className={`flex-1 py-2 text-sm ${
                        tone === t
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
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
