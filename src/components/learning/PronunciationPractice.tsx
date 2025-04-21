'use client';

import React, { useState, useRef } from 'react';
import { FaMicrophone, FaPlay, FaStop, FaVolumeUp } from 'react-icons/fa';

interface PhraseData {
  id: string;
  text: string;
  audioUrl: string;
  translation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export default function PronunciationPractice({ userId }: { userId: string }) {
  const [phrases, setPhrases] = useState<PhraseData[]>([]);
  const [currentPhrase, setCurrentPhrase] = useState<PhraseData | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

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
      setFeedback('Error: Could not access microphone. Please check your permissions.');
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
      const audio = new Audio(currentPhrase.audioUrl);
      audio.play();
    }
  };

  const playRecording = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const audio = new Audio(url);
      audio.play();
      URL.revokeObjectURL(url);
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
      setFeedback(data.feedback);
    } catch (error) {
      console.error('Error analyzing pronunciation:', error);
      setFeedback('Error analyzing pronunciation. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {currentPhrase ? (
          <>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">{currentPhrase.text}</h3>
              <p className="text-gray-600">{currentPhrase.translation}</p>
            </div>

            <div className="flex justify-center space-x-4 mb-8">
              <button
                onClick={playOriginal}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <FaVolumeUp className="inline-block mr-2" />
                Listen
              </button>

              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-green-500 hover:bg-green-600'
                } text-white`}
              >
                {isRecording ? (
                  <>
                    <FaStop className="inline-block mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <FaMicrophone className="inline-block mr-2" />
                    Start Recording
                  </>
                )}
              </button>

              {audioBlob && (
                <button
                  onClick={playRecording}
                  className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <FaPlay className="inline-block mr-2" />
                  Play Recording
                </button>
              )}
            </div>

            {feedback && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Feedback:</h4>
                <p className="text-gray-700">{feedback}</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No phrases available. Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
} 