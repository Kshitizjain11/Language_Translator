import React, { useEffect, useState } from 'react';
import type { Translation } from '@/types/learning';

interface TranslationHistoryPanelProps {
  userId: string;
  limit?: number;
}

export default function TranslationHistoryPanel({ userId, limit = 10 }: TranslationHistoryPanelProps) {
  const [history, setHistory] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First try to load from localStorage
    const savedHistory = localStorage.getItem(`translationHistory_${userId}`);
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory.slice(0, limit));
        setLoading(false);
      } catch (e) {
        console.error('Error parsing saved history:', e);
      }
    }

    // Then fetch from API as a backup
    async function fetchHistory() {
      try {
        const res = await fetch(`/api/learning?userId=${userId}&type=translations&limit=${limit}`);
        const data = await res.json();
        
        if (data.translations && data.translations.length > 0) {
          setHistory(data.translations);
          // Save to localStorage
          localStorage.setItem(`translationHistory_${userId}`, JSON.stringify(data.translations));
        }
      } catch (e) {
        console.error('Error loading translation history:', e);
      } finally {
        setLoading(false);
      }
    }
    
    fetchHistory();
  }, [userId, limit]);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(`translationHistory_${userId}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Translation History</h2>
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
          >
            Clear History
          </button>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-blue-400"></div>
        </div>
      ) : history.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.map(item => (
            <div key={item.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
              <div className="mb-2">
                <p className="font-medium text-gray-600 dark:text-gray-400">Source Text:</p>
                <p className="break-words text-gray-900 dark:text-white">{item.sourceText}</p>
              </div>
              <div className="mb-2">
                <p className="font-medium text-gray-600 dark:text-gray-400">Translation:</p>
                <p className="break-words text-gray-900 dark:text-white">{item.targetText}</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(item.lastTranslated).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 py-12">
          <p className="text-lg">No translation history yet</p>
          <p className="mt-2">Your translations will appear here</p>
        </div>
      )}
    </div>
  );
}
