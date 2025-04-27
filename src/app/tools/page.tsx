'use client';

import React, { useState, useEffect } from 'react';
import AuthGuard from '@/components/AuthGuard';
import FeaturePanel from '@/components/leftPanel/FeaturePanel';
import GrammarCheck from '@/components/features/GrammarCheck';
import Dictionary from '@/components/features/Dictionary';
import Summarizer from '@/components/features/Summarizer';
import Paraphraser from '@/components/features/Paraphraser';
import TranslationHistoryPanel from '@/components/learning/TranslationHistoryPanel';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

// Redefine Feature type locally to avoid import error
type Feature = 'translator' | 'grammar' | 'dictionary' | 'summarizer' | 'paraphraser' | 'history' | 'learning' | 'progress' | 'flashcards' | 'quiz' | 'vocabulary' | 'pronunciation' | 'lessons' | 'notebook';

export default function ToolsPage() {
  const [activeFeature, setActiveFeature] = useState<Feature>('translator');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    setUserId(id);
  }, []);

  if (userId === null) return null;

  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'translator':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Translator</h2>
            <p className="mb-4">
              You're currently in the Tools section. To use the translator, please go back to the main page.
            </p>
            <Link 
              href="/" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <FaArrowLeft className="mr-2" /> Go to Translator
            </Link>
          </div>
        );
      case 'grammar':
        return <GrammarCheck />;
      case 'dictionary':
        return <Dictionary />;
      case 'summarizer':
        return <Summarizer />;
      case 'paraphraser':
        return <Paraphraser />;
      case 'history':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Translation History</h2>
            <p className="mb-4">
              Your full translation history is available on the left panel of the main translator page.
            </p>
            <Link 
              href="/" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <FaArrowLeft className="mr-2" /> Go to Translator
            </Link>
          </div>
        );
      case 'learning':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Learning Mode</h2>
            <p className="mb-4">
              Learning Mode provides flashcards, quizzes, and progress tracking to help you master new languages.
            </p>
            <Link 
              href="/learning" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <FaArrowLeft className="mr-2" /> Go to Learning Mode
            </Link>
          </div>
        );
      default:
        return <div>Select a feature from the left panel</div>;
    }
  };

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <FeaturePanel activeFeature={activeFeature} setActiveFeature={setActiveFeature} />
        <main className="flex-1 flex flex-col">
          <div className="p-6 text-white">
            {renderFeatureContent()}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
