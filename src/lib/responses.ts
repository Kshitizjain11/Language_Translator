export const RESPONSE_TYPES = {
  GREETING: 'greeting',
  GRAMMAR: 'grammar',
  MEANING: 'meaning',
  LEARNING: 'learning',
  TRANSLATION: 'translation',
  DEFAULT: 'default',
  WARNING: 'warning'
} as const;

export const RESPONSES = {
  [RESPONSE_TYPES.WARNING]: [
    "⚠️ Please note: When auto-translate is enabled, your translation history will not be saved. This helps maintain better performance.",
    "⚠️ Important: Auto-translate mode does not save translation history to ensure smooth operation.",
    "⚠️ Note: Translation history is disabled during auto-translate to optimize performance."
  ],
  [RESPONSE_TYPES.GREETING]: [
    "Hello! How can I assist you today?",
    "Hi there! What can I help you with?",
    "Greetings! How may I help you?"
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
    "I'm here to help! What would you like to know?",
    "I'll do my best to assist you. What's on your mind?",
    "Feel free to ask me anything!"
  ]
} as const; 