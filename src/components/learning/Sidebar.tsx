'use client';

import React from 'react';
import { FaChartLine, FaLayerGroup, FaQuestionCircle, FaBook, FaMicrophone, FaBookmark } from 'react-icons/fa';

interface SidebarProps {
  activeTab: 'progress' | 'flashcards' | 'quiz' | 'vocabulary' | 'pronunciation' | 'lessons' | 'notebook';
  setActiveTab: (tab: 'progress' | 'flashcards' | 'quiz' | 'vocabulary' | 'pronunciation' | 'lessons' | 'notebook') => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    {
      id: 'progress',
      label: 'Progress History',
      icon: <FaChartLine />,
    },
    {
      id: 'lessons',
      label: 'Lessons',
      icon: <FaBook />,
    },
    {
      id: 'flashcards',
      label: 'Flashcards',
      icon: <FaLayerGroup />,
    },
    {
      id: 'quiz',
      label: 'Translation Quiz',
      icon: <FaQuestionCircle />,
    },
    {
      id: 'vocabulary',
      label: 'Vocabulary Trainer',
      icon: <FaBook />,
    },
    {
      id: 'pronunciation',
      label: 'Pronunciation Practice',
      icon: <FaMicrophone />,
    },
    {
      id: 'notebook',
      label: 'My Notebook',
      icon: <FaBookmark />,
    },
  ] as const;

  return (
    <aside className="w-64 h-full bg-white shadow-lg rounded-xl p-6 flex flex-col space-y-4 sticky top-0">
      <h2 className="text-xl font-bold mb-6 text-blue-600">Learning Mode</h2>
      {menuItems.map((item) => (
        <button
          key={item.id}
          className={`text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center space-x-3 ${
            activeTab === item.id
              ? 'bg-blue-100 text-blue-700'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
          onClick={() => setActiveTab(item.id)}
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
      <div className="flex-1" />
      <div className="text-xs text-gray-400 pt-4 border-t">Smart Language Learning</div>
    </aside>
  );
}
