import React from 'react';
import { FaBook, FaGraduationCap, FaLanguage, FaList } from 'react-icons/fa';

type ActiveTab = 'progress' | 'flashcards' | 'quiz' | 'vocabulary' | 'pronunciation';

interface FeaturePanelProps {
  activeFeature: ActiveTab;
  setActiveFeature: (feature: ActiveTab) => void;
}

const features = [
  { id: 'vocabulary' as ActiveTab, label: 'Vocabulary', icon: FaBook },
  { id: 'grammar' as ActiveTab, label: 'Grammar', icon: FaGraduationCap },
  { id: 'practice' as ActiveTab, label: 'Practice', icon: FaLanguage },
  { id: 'progress' as ActiveTab, label: 'Progress', icon: FaList },
];

const FeaturePanel: React.FC<FeaturePanelProps> = ({ activeFeature, setActiveFeature }) => {
  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Learning Tools</h2>
      <nav>
        <ul className="space-y-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <li key={feature.id}>
                <button
                  onClick={() => setActiveFeature(feature.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    activeFeature === feature.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{feature.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default FeaturePanel; 