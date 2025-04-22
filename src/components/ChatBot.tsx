'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaChevronDown, FaSpinner } from 'react-icons/fa';
import { generateResponse } from '@/lib/groq';
import { RESPONSE_TYPES } from '@/lib/responses';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const RESPONSES = {
  [RESPONSE_TYPES.GREETING]: [
    "Hello! I'm your language learning assistant. How can I help you today?",
    "Hi there! I'm here to help with your language learning journey. What would you like to know?",
    "Greetings! I'm your language learning companion. What can I assist you with?"
  ],
  [RESPONSE_TYPES.GRAMMAR]: [
    "Let me help you with grammar. Could you provide the specific sentence or phrase you'd like to check?",
    "I can help explain grammar rules. What specific grammar question do you have?",
    "Grammar is important! What would you like to know about grammar?"
  ],
  [RESPONSE_TYPES.MEANING]: [
    "I can help explain word meanings. Which word would you like to understand better?",
    "Let's explore word meanings together. What word are you curious about?",
    "Understanding word meanings is crucial. What word would you like me to explain?"
  ],
  [RESPONSE_TYPES.LEARNING]: [
    "Here are some effective language learning tips:\n1. Practice daily\n2. Use flashcards\n3. Listen to native speakers\n4. Read in your target language\n5. Practice speaking with others",
    "To improve your language skills:\n1. Set specific goals\n2. Use language learning apps\n3. Watch movies in the target language\n4. Keep a vocabulary notebook\n5. Find a language partner",
    "Try these learning strategies:\n1. Immerse yourself in the language\n2. Use spaced repetition\n3. Practice speaking out loud\n4. Learn common phrases first\n5. Don't be afraid to make mistakes"
  ],
  [RESPONSE_TYPES.TRANSLATION]: [
    "For translations, please use the translator tool in the main interface. I can help explain the translations or provide additional context!",
    "The translator tool is best for direct translations. I can help you understand the nuances of the translation!",
    "Use the translator tool for direct translations. I'm here to help you understand the cultural context and usage!"
  ],
  [RESPONSE_TYPES.DEFAULT]: [
    "I'm here to help with your language learning journey! You can ask me about meanings, grammar, learning tips, or anything else language-related.",
    "I can assist you with various language learning topics. What would you like to know?",
    "Feel free to ask me anything about language learning, grammar, or vocabulary!"
  ]
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
    }
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const getRandomResponse = (type: string) => {
    const responses = RESPONSES[type as keyof typeof RESPONSES] || RESPONSES[RESPONSE_TYPES.DEFAULT];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const determineResponseType = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.match(/^(hi|hello|hey|greetings)/)) {
      return RESPONSE_TYPES.GREETING;
    }
    if (lowerMessage.includes('grammar') || lowerMessage.includes('sentence') || lowerMessage.includes('phrase')) {
      return RESPONSE_TYPES.GRAMMAR;
    }
    if (lowerMessage.includes('meaning') || lowerMessage.includes('word') || lowerMessage.includes('vocabulary')) {
      return RESPONSE_TYPES.MEANING;
    }
    if (lowerMessage.includes('learn') || lowerMessage.includes('study') || lowerMessage.includes('practice')) {
      return RESPONSE_TYPES.LEARNING;
    }
    if (lowerMessage.includes('translate') || lowerMessage.includes('translation')) {
      return RESPONSE_TYPES.TRANSLATION;
    }
    
    return RESPONSE_TYPES.DEFAULT;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Convert message history to the format expected by generateResponse
      const messageHistory = messages.map(msg => 
        `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`
      );
      
      const response = await generateResponse(input, messageHistory);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I encountered an error while processing your request. Could you please try again?",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-105"
      >
        {isOpen ? <FaTimes /> : <FaRobot className="text-xl" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          ref={chatWindowRef}
          className="absolute bottom-16 right-0 w-96 h-[32rem] bg-gray-900 text-white rounded-lg shadow-xl flex flex-col border border-gray-700"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FaRobot className="text-xl" />
              <h3 className="font-semibold">AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/10 rounded-full p-1 transition-colors"
            >
              <FaChevronDown />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-gray-800 text-gray-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800 rounded-lg p-3 flex items-center space-x-2">
                  <FaSpinner className="animate-spin" />
                  <span className="text-sm text-gray-400">AI is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
            <div className="flex items-end space-x-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                className="flex-1 p-2 border border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
                rows={1}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <FaPaperPlane />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 