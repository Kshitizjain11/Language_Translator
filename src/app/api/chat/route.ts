import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { message, language } = await req.json();

  const apiKey = process.env.GROQ_API_KEY || "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";
  const model = 'llama3-8b-8192';
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const prompt = `You are a helpful AI assistant. Reply in ${language}.\nUser: ${message}`;

  const payload = {
    model,
    messages: [
      { role: 'system', content: `You are a helpful AI assistant. Reply in ${language}.` },
      { role: 'user', content: message }
    ],
    max_tokens: 512,
    temperature: 0.7
  };

  try {
    const groqRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!groqRes.ok) {
      const err = await groqRes.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }
    const data = await groqRes.json();
    const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ error: error?.toString() || 'Unknown error' }, { status: 500 });
  }
}
