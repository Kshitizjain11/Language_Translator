'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaLanguage, 
  FaHistory, 
  FaSpellCheck, 
  FaBook, 
  FaFileAlt, 
  FaRobot, 
  FaQuestionCircle,
  FaChartLine,
  FaLayerGroup,
  FaMicrophone,
  FaBookmark,
  FaGraduationCap
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';

type Feature = 'translator' | 'grammar' | 'dictionary' | 'summarizer' | 'paraphraser' | 'history' | 'learning' | 'progress' | 'flashcards' | 'quiz' | 'vocabulary' | 'pronunciation' | 'lessons' | 'notebook';

interface FeaturePanelProps {
  activeFeature: Feature;
  setActiveFeature: Dispatch<SetStateAction<Feature>>;
}

export default function FeaturePanel({ activeFeature, setActiveFeature }: FeaturePanelProps) {
  const [isLearningHovered, setIsLearningHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const learningButtonRef = useRef<HTMLLIElement>(null);
  const router = useRouter();

  const mainFeatures = [
    { id: 'translator' as Feature, name: 'Translator', icon: <FaLanguage className="w-5 h-5" /> },
    { id: 'grammar' as Feature, name: 'Grammar Check', icon: <FaSpellCheck className="w-5 h-5" /> },
    { id: 'dictionary' as Feature, name: 'Dictionary', icon: <FaBook className="w-5 h-5" /> },
    { id: 'summarizer' as Feature, name: 'Summarizer', icon: <FaFileAlt className="w-5 h-5" /> },
    { id: 'paraphraser' as Feature, name: 'Paraphraser', icon: <FaRobot className="w-5 h-5" /> },
    { id: 'history' as Feature, name: 'History', icon: <FaHistory className="w-5 h-5" /> },
  ];

  const learningFeatures = [
    { id: 'progress' as Feature, name: 'Progress History', icon: <FaChartLine className="w-5 h-5" /> },
    { id: 'lessons' as Feature, name: 'Lessons', icon: <FaGraduationCap className="w-5 h-5" /> },
    { id: 'flashcards' as Feature, name: 'Flashcards', icon: <FaLayerGroup className="w-5 h-5" /> },
    { id: 'quiz' as Feature, name: 'Translation Quiz', icon: <FaQuestionCircle className="w-5 h-5" /> },
    { id: 'vocabulary' as Feature, name: 'Vocabulary Trainer', icon: <FaBook className="w-5 h-5" /> },
    { id: 'pronunciation' as Feature, name: 'Pronunciation Practice', icon: <FaMicrophone className="w-5 h-5" /> },
    { id: 'notebook' as Feature, name: 'My Notebook', icon: <FaBookmark className="w-5 h-5" /> },
  ];

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsLearningHovered(true);
    setTimeout(() => setIsVisible(true), 50);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
    timeoutRef.current = setTimeout(() => {
      setIsLearningHovered(false);
    }, 300);
  };

  return (
    <div className="flex h-screen">
      {/* Main Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-500 to-purple-600 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <img src="/logo.png" alt="LingQuest Logo" style={{width:'54px',height:'54px',borderRadius:'12px',boxShadow:'0 2px 8px #0002',background:'#fff'}} />
          <h1 className="text-2xl font-bold text-white tracking-wide" style={{letterSpacing:'0.03em'}}>LingQuest</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {mainFeatures.map((feature) => (
              <li key={feature.id}>
                <button
                  onClick={() => setActiveFeature(feature.id)}
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

            {/* Learning Mode */}
            <li 
              ref={learningButtonRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="relative"
            >
              <button
                className={`flex items-center w-full px-4 py-3 text-left transition-colors ${
                  activeFeature === 'learning' || learningFeatures.some(f => f.id === activeFeature)
                    ? 'bg-white/20 text-white border-r-4 border-white'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <span className="mr-3"><FaBookmark className="w-5 h-5" /></span>
                Learning Mode
              </button>

              {/* Learning Features Dropdown */}
              {isLearningHovered && (
                <div 
                  className={`fixed top-0 z-50 w-64 bg-white shadow-xl h-screen flex flex-col transform transition-all duration-300 ease-in-out rounded-r-xl border-r border-gray-100
                    ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                  style={{ left: '256px' }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="p-4 border-b border-gray-100">
                    <h2 className="text-blue-600 font-semibold text-lg">Learning Mode</h2>
                  </div>
                  
                  <nav className="flex-1 overflow-y-auto py-2">
                    <ul className="space-y-1">
                      {learningFeatures.map((feature) => (
                        <li key={feature.id}>
                          <button
                            onClick={() => setActiveFeature(feature.id)}
                            className={`flex items-center w-full px-4 py-2.5 text-left transition-all duration-200 ${
                              activeFeature === feature.id
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span className={`mr-3 transition-colors duration-200 ${
                              activeFeature === feature.id
                                ? 'text-blue-600'
                                : 'text-gray-500'
                            }`}>
                              {feature.icon}
                            </span>
                            <span className="font-medium">{feature.name}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  <div className="p-4 text-xs text-gray-500 border-t border-gray-100">
                    Smart Language Learning
                  </div>
                </div>
              )}
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <Link href="/help" className="flex items-center text-white/80 hover:text-white">
            <FaQuestionCircle className="mr-2" />
            Help Center
          </Link>
        </div>
      </aside>
    </div>
  );
}
