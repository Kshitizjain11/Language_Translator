import { RESPONSES, RESPONSE_TYPES } from './responses';

const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function generateResponse(message: string, history: string[]): Promise<string> {
  if (!GROQ_API_KEY) {
    return getDummyResponse(message);
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: 'You are Lumi, an advanced AI language learning assistant. When users enable auto-translate, warn them that their translation history will not be saved. Keep responses concise and helpful. You can use markdown formatting when appropriate.'
          },
          ...history.map(msg => ({
            role: msg.startsWith('User:') ? 'user' : 'assistant',
            content: msg.replace(/^(User|Assistant):\s*/, '')
          })),
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
        presence_penalty: 0.6,
        frequency_penalty: 0.3
      })
    });

    if (!response.ok) {
      throw new Error('Groq API request failed');
    }

    const data: GroqResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Groq API:', error);
    return getDummyResponse(message);
  }
}

function getDummyResponse(message: string): string {
  const responseType = determineResponseType(message);
  const responses = RESPONSES[responseType as keyof typeof RESPONSES] || RESPONSES[RESPONSE_TYPES.DEFAULT];
  return responses[Math.floor(Math.random() * responses.length)];
}

function determineResponseType(message: string): string {
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
} 