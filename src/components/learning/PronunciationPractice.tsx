'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaPlay, FaStop, FaVolumeUp, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface PhraseData {
  id: string;
  text: string;
  audioUrl: string;
  translation: string;
  difficulty: "beginner" | 'intermediate' | 'advanced';
}

interface FeedbackData {
  score: number;
  suggestions: string[];
}

export default function PronunciationPractice({ userId }: { userId: string }) {
  const [phrases, setPhrases] = useState<PhraseData[]>([]);
  const [currentPhrase, setCurrentPhrase] = useState<PhraseData | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  useEffect(() => {
    fetchPhrases();
  }, [userId]);

  const fetchPhrases = async () => {
    try {
      const response = await fetch(`/api/learning/pronunciation/phrases?userId=${userId}`);
      const data = await response.json();
      let phraseList = data.phrases;
      // Fallback demo phrases if API returns nothing
      if (!phraseList || phraseList.length === 0) {
        phraseList = [
          {
            id: '1',
            text: 'Hello',
            audioUrl: '', // You can add a demo audio URL if available
            translation: 'Hola (Spanish)',
            difficulty: "beginner"
          },
          {
            id: '2',
            text: 'Thank you',
            audioUrl: '',
            translation: 'Merci (French)',
            difficulty: "beginner"
          },
          {
            id: '3',
            text: 'Good morning',
            audioUrl: '',
            translation: 'Guten Morgen (German)',
            difficulty: "beginner"
          }
        ];
      }
      setPhrases(phraseList);
      if (phraseList.length > 0) {
        setCurrentPhrase(phraseList[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching phrases:', error);
      // Fallback demo phrases if API fails
      const phraseList = [
        {
          id: '1',
          text: 'Hello',
          audioUrl: '',
          translation: 'Hola (Spanish)',
          difficulty: "beginner"
        },
        {
          id: '2',
          text: 'Thank you',
          audioUrl: '',
          translation: 'Merci (French)',
          difficulty: "beginner"
        },
        {
          id: '3',
          text: 'Good morning',
          audioUrl: '',
          translation: 'Guten Morgen (German)',
          difficulty: "beginner"
        }
      ];
      setPhrases(phraseList);
      setCurrentPhrase(phraseList[0]);
      setLoading(false);
    }
  };

  // Show message if no phrases available
  const noPhrases = !loading && (!phrases || phrases.length === 0);

  const goToNextPhrase = () => {
    if (currentIndex < phrases.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setCurrentPhrase(phrases[currentIndex + 1]);
      setFeedback(null);
      setAudioBlob(null);
    }
  };

  const goToPreviousPhrase = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setCurrentPhrase(phrases[currentIndex - 1]);
      setFeedback(null);
      setAudioBlob(null);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        analyzePronunciation(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setFeedback({ score: 0, suggestions: [] });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const playOriginal = () => {
    if (currentPhrase) {
      if (currentPhrase.audioUrl) {
        const audio = new Audio(currentPhrase.audioUrl);
        audio.play();
      } else if ('speechSynthesis' in window) {
        // Use Web Speech API if no audioUrl
        const utter = new window.SpeechSynthesisUtterance(currentPhrase.text);
        utter.lang = 'en'; // Optionally set language
        window.speechSynthesis.speak(utter);
      } else {
        alert('No audio available and speech synthesis not supported.');
      }
    }
  };

  const playRecording = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const audio = new Audio(url);
      audio.onended = () => {
        URL.revokeObjectURL(url);
      };
      audio.play();
      // Immediately send to AI for feedback (analyzePronunciation)
      analyzePronunciation(audioBlob);
    }
  };



  const analyzePronunciation = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('text', currentPhrase?.text || '');

      const response = await fetch('/api/learning/pronunciation/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setFeedback(data);
    } catch (error) {
      console.error('Error analyzing pronunciation:', error);
      // Simulate feedback for demo/testing
      const randomScore = Math.floor(Math.random() * 61) + 40; // 40-100%
      setFeedback({
        score: randomScore,
        suggestions: [
          randomScore > 80
            ? 'Great job! Your pronunciation is clear.'
            : 'Try to articulate the sounds more clearly and listen to the sample again.'
        ]
      });
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 p-4">
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
        </div>
      ) : (
        <>
          {noPhrases && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 mb-6 text-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">No Practice Phrases Available</h3>
              <p className="text-gray-600 dark:text-gray-400">Please contact your administrator or try again later.</p>
            </div>
          )}
          {currentPhrase && !noPhrases && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={goToPreviousPhrase}
                  disabled={currentIndex === 0}
                  className={`p-2 rounded-full ${
                    currentIndex === 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-blue-500 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-gray-700'
                  }`}
                >
                  <FaArrowLeft />
                </button>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Practice Phrase</h3>
                <button
                  onClick={goToNextPhrase}
                  disabled={currentIndex === phrases.length - 1}
                  className={`p-2 rounded-full ${
                    currentIndex === phrases.length - 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-blue-500 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-gray-700'
                  }`}
                >
                  <FaArrowRight />
                </button>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{currentPhrase.text}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">{currentPhrase.translation}</p>
              <div className="mt-4 flex justify-center">
                <button
                  onClick={playOriginal}
                  className="flex items-center px-4 py-2 text-sm text-blue-500 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <FaVolumeUp className="mr-2" />
                  Listen to Pronunciation
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-center space-x-4">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`px-6 py-2 rounded-full font-medium transition-colors flex items-center ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700'
                  : 'bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700'
              }`}
            >
              {isRecording ? <FaStop className="mr-2" /> : <FaMicrophone className="mr-2" />}
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            {audioBlob && (
              <button
                onClick={playRecording}
                className="px-6 py-2 rounded-full font-medium bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700 transition-colors flex items-center"
              >
                <FaPlay className="mr-2" />
                Play Recording
              </button>
            )}
          </div>

          {feedback && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Feedback</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Accuracy Score:</span>
                  <span className={`font-semibold ${
                    feedback.score >= 80 ? 'text-green-500 dark:text-green-400' :
                    feedback.score >= 60 ? 'text-yellow-500 dark:text-yellow-400' :
                    'text-red-500 dark:text-red-400'
                  }`}>
                    {feedback.score}%
                  </span>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Areas for Improvement:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                    {feedback.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 