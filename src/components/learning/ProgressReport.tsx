import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { UserProgress, Translation } from '@/types/learning';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ProgressReportProps {
  userId: string;
}

export default function ProgressReport({ userId }: ProgressReportProps) {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [recentTranslations, setRecentTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgressData();
  }, [userId]);

  const fetchProgressData = async () => {
    try {
      // Fetch progress data
      const progressRes = await fetch(`/api/learning/progress?userId=${userId}`);
      const progressData = await progressRes.json();
      setProgress(progressData.progress);

      // Fetch recent translations
      const translationsRes = await fetch(`/api/learning/translations?userId=${userId}`);
      const translationsData = await translationsRes.json();
      setRecentTranslations(translationsData.translations);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Words Learned',
        data: progress?.weeklyProgress || [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-8">
      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-600">Total XP</h3>
          <p className="text-2xl font-bold text-blue-900">{progress?.xp || 0}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-600">Current Streak</h3>
          <p className="text-2xl font-bold text-green-900">{progress?.streakDays || 0} days</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-600">Words Mastered</h3>
          <p className="text-2xl font-bold text-purple-900">{progress?.uniqueWords || 0}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-600">Current Level</h3>
          <p className="text-2xl font-bold text-yellow-900">{progress?.level || 'Beginner'}</p>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
        <div className="h-64">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Recent Translations</h3>
        <div className="space-y-4">
          {recentTranslations.map((translation) => (
            <div
              key={translation.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium">{translation.sourceText}</p>
                <p className="text-gray-600">{translation.targetText}</p>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(translation.lastTranslated).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      {progress?.badges && progress.badges.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Achievements</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {progress.badges.map((badge, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg"
              >
                <div className="text-3xl mb-2">🏆</div>
                <p className="text-center text-sm font-medium">{badge}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
