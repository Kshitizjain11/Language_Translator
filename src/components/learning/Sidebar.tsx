'use client';

import React, { useState } from 'react';
import { FaChartLine, FaLayerGroup, FaQuestionCircle, FaBook, FaMicrophone, FaBookmark, FaChevronRight } from 'react-icons/fa';

interface SidebarProps {
  activeTab: 'progress' | 'flashcards' | 'quiz' | 'vocabulary' | 'pronunciation' | 'lessons' | 'notebook';
  setActiveTab: (tab: 'progress' | 'flashcards' | 'quiz' | 'vocabulary' | 'pronunciation' | 'lessons' | 'notebook') => void;
  onLearningHoverStart?: () => void;
  onLearningHoverEnd?: () => void;
  visible?: boolean;
}

export default function Sidebar({ activeTab, setActiveTab, onLearningHoverStart, onLearningHoverEnd, visible }: SidebarProps) {
  // Always render, control visibility with CSS
  const show = !!visible;

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
    <div className="relative h-full">
      {/* Expandable sidebar */}
      <aside 
        className={`w-64 h-full bg-white shadow-lg rounded-xl p-6 flex flex-col space-y-4 absolute left-0 top-0 transition-all duration-200 z-20"
          ${show ? 'opacity-100 pointer-events-auto translate-x-0' : 'opacity-0 pointer-events-none -translate-x-4'}`}
        style={{ boxShadow: show ? '0 8px 32px rgba(0,0,0,0.16)' : 'none' }}
        onMouseEnter={onLearningHoverStart}
        onMouseLeave={onLearningHoverEnd}
      >
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
    </div>
  );
}
