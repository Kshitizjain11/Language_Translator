'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FaLanguage, 
  FaHistory, 
  FaSpellCheck, 
  FaBook, 
  FaFileAlt, 
  FaRobot, 
  FaQuestionCircle,
  FaChartLine
} from 'react-icons/fa';

interface FeaturePanelProps {
  activeFeature: string;
  setActiveFeature: (feature: string) => void;
  onLearningHoverStart?: () => void;
  onLearningHoverEnd?: () => void;
}

import { useRouter } from 'next/navigation';

export default function FeaturePanel({ activeFeature, setActiveFeature, onLearningHoverStart, onLearningHoverEnd }: FeaturePanelProps) {
  const router = useRouter();
  const features = [
    { id: 'translator', name: 'Translator', icon: <FaLanguage className="w-5 h-5" /> },
    { id: 'grammar', name: 'Grammar Check', icon: <FaSpellCheck className="w-5 h-5" /> },
    { id: 'dictionary', name: 'Dictionary', icon: <FaBook className="w-5 h-5" /> },
    { id: 'summarizer', name: 'Summarizer', icon: <FaFileAlt className="w-5 h-5" /> },
    { id: 'paraphraser', name: 'Paraphraser', icon: <FaRobot className="w-5 h-5" /> },
    { id: 'history', name: 'History', icon: <FaHistory className="w-5 h-5" /> },
    { id: 'learning', name: 'Learning Mode', icon: <FaChartLine className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-500 to-purple-600 h-screen flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h1 className="text-xl font-bold text-white">LangTools</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {features.map((feature) => (
            <li key={feature.id}>
              <button
                onClick={() => {
                  if (feature.id === 'learning') {
                    router.push('/learning');
                  } else {
                    setActiveFeature(feature.id);
                  }
                }}
                onMouseEnter={feature.id === 'learning' ? onLearningHoverStart : undefined}
                onFocus={feature.id === 'learning' ? onLearningHoverStart : undefined}
                onMouseLeave={feature.id === 'learning' ? onLearningHoverEnd : undefined}
                onBlur={feature.id === 'learning' ? onLearningHoverEnd : undefined}
                className={`flex items-center w-full px-4 py-3 text-left transition-colors ${
                  activeFeature === feature.id
                    ? 'bg-white/20 text-white border-r-4 border-white'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <span className="mr-3">{feature.icon}</span>
                {feature.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <Link href="/help" className="flex items-center text-white/80 hover:text-white">
          <FaQuestionCircle className="mr-2" />
          Help Center
        </Link>
      </div>
    </aside>
  );
}
