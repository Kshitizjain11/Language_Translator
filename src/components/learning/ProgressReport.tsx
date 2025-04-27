import { useEffect, useState, useRef } from 'react';
import type { UserProgress, Translation } from '@/types/learning';
import { FaFire } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface EditableWord {
  id: string;
  word: string;
  translation?: string;
  mastered: boolean;
  source: 'notebook' | 'hangman';
}

interface ProgressReportProps {
  userId: string;
  refreshKey?: number;
}

export default function ProgressReport({ userId, refreshKey }: ProgressReportProps) {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [notebookWords, setNotebookWords] = useState<EditableWord[]>([]);
  const [editableWords, setEditableWords] = useState<EditableWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [streakAnim, setStreakAnim] = useState(false);
  const prevStreak = useRef<number>(0);
  const [localRefreshKey, setLocalRefreshKey] = useState(0);

  // Fetch progress and notebook words
  useEffect(() => {
    fetchProgressData();
    fetchNotebookWords();
  }, [userId, refreshKey, localRefreshKey]);

  useEffect(() => {
    mergeWords();
  }, [progress, notebookWords]);

  useEffect(() => {
    if (progress && progress.streakDays !== prevStreak.current) {
      setStreakAnim(true);
      setTimeout(() => setStreakAnim(false), 800);
      prevStreak.current = progress.streakDays;
    }
  }, [progress?.streakDays]);

  const fetchProgressData = async () => {
    try {
      const progressRes = await fetch(`/api/learning/progress?userId=${userId}`);
      if (!progressRes.ok) throw new Error('Failed to fetch progress data');
      const progressData = await progressRes.json();
      setProgress(progressData.progress);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotebookWords = () => {
    try {
      const notebook = JSON.parse(localStorage.getItem('notebook') || '[]');
      const words: EditableWord[] = notebook.map((w: any) => ({
        id: w.id || w.word,
        word: w.word,
        translation: w.meaning || w.translation || '',
        mastered: !!w.learned,
        source: 'notebook',
      }));
      setNotebookWords(words);
    } catch (error) {
      setNotebookWords([]);
    }
  };

  // Merge notebook and hangman/mastered words
  const mergeWords = () => {
    const hangmanWords: EditableWord[] =
      progress?.masteredWords?.map((word) => ({
        id: word,
        word,
        translation: '',
        mastered: true,
        source: 'hangman',
      })) || [];
    // Merge, avoiding duplicates (prefer notebook info)
    const allWordsMap: Record<string, EditableWord> = {};
    [...hangmanWords, ...notebookWords].forEach((w) => {
      allWordsMap[w.word] = { ...allWordsMap[w.word], ...w };
    });
    setEditableWords(Object.values(allWordsMap));
  };

  // Handle inline edit
  const handleEdit = (id: string, field: keyof EditableWord, value: string | boolean) => {
    setEditableWords((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, [field]: value } : w
      )
    );
  };

  // Save changes to localStorage (and optionally API)
  const handleSave = async () => {
    // Save notebook words
    const updatedNotebook = editableWords
      .filter((w) => w.source === 'notebook')
      .map((w) => ({
        id: w.id,
        word: w.word,
        meaning: w.translation,
        learned: w.mastered,
      }));
    localStorage.setItem('notebook', JSON.stringify(updatedNotebook));

    // For each mastered notebook word, update progress API
    await Promise.all(
      editableWords
        .filter((w) => w.source === 'notebook' && w.mastered)
        .map(async (w) => {
          try {
            await fetch('/api/learning/progress', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId, word: w.word, isMastered: true }),
            });
          } catch (e) {
            // Ignore errors for now
          }
        })
    );
    // Trigger a local refresh (if not using parent refreshKey)
    setLocalRefreshKey((k) => k + 1);
    alert('Changes saved!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 space-y-8">
      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-600 dark:text-blue-300">Total XP</h3>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{progress?.xp || 0}</p>
        </div>
        <motion.div
          className="bg-green-50 dark:bg-green-900 p-4 rounded-lg flex flex-col items-center justify-center"
          animate={streakAnim ? { scale: 1.1 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <h3 className="text-sm font-medium text-green-600 dark:text-green-300 flex items-center gap-1">
            <FaFire className="text-orange-500 dark:text-orange-300 animate-pulse" />
            Current Streak
          </h3>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">{progress?.streakDays || 0} days</p>
        </motion.div>
        <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-600 dark:text-purple-300">Words Mastered</h3>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{progress?.masteredWords?.length || 0}</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-600 dark:text-yellow-300">Current Level</h3>
          <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{progress?.level || 'Beginner'}</p>
        </div>
      </div>

      {/* Editable Spreadsheet Table */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 dark:text-white text-gray-900">Your Words (Notebook & Hangman)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="p-2 border dark:border-gray-700 text-gray-700 dark:text-gray-200">Word</th>
                <th className="p-2 border dark:border-gray-700 text-gray-700 dark:text-gray-200">Translation</th>
                <th className="p-2 border dark:border-gray-700 text-gray-700 dark:text-gray-200">Mastered</th>
                <th className="p-2 border dark:border-gray-700 text-gray-700 dark:text-gray-200">Source</th>
              </tr>
            </thead>
            <tbody>
              {editableWords.map((w) => (
                <tr key={w.id} className="even:bg-gray-50 even:dark:bg-gray-900">
                  <td className="p-2 border dark:border-gray-700">
                    <input
                      className="w-full bg-transparent text-gray-900 dark:text-gray-100"
                      value={w.word}
                      onChange={(e) => handleEdit(w.id, 'word', e.target.value)}
                      disabled={w.source === 'hangman'}
                    />
                  </td>
                  <td className="p-2 border dark:border-gray-700">
                    <input
                      className="w-full bg-transparent text-gray-900 dark:text-gray-100"
                      value={w.translation || ''}
                      onChange={(e) => handleEdit(w.id, 'translation', e.target.value)}
                    />
                  </td>
                  <td className="p-2 border dark:border-gray-700 text-center">
                    <input
                      type="checkbox"
                      checked={w.mastered}
                      onChange={(e) => handleEdit(w.id, 'mastered', e.target.checked)}
                    />
                  </td>
                  <td className="p-2 border dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400">{w.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
