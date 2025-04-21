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
}

export default function FeaturePanel({ activeFeature, setActiveFeature }: FeaturePanelProps) {
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
    <aside className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">LangTools</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {features.map((feature) => (
            <li key={feature.id}>
              <button
                onClick={() => setActiveFeature(feature.id)}
                className={`flex items-center w-full px-4 py-3 text-left ${
                  activeFeature === feature.id
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">{feature.icon}</span>
                {feature.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <Link href="/help" className="flex items-center text-gray-600 hover:text-blue-600">
          <FaQuestionCircle className="mr-2" />
          Help Center
        </Link>
      </div>
    </aside>
  );
}
