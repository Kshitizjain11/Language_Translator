import { NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY || "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"
const GROQ_MODEL = "llama3-8b-8192"

export async function POST(request: Request) {
  try {
    const { text, sourceLang = 'English', targetLang = 'Spanish' } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a translator. Translate from ${sourceLang} to ${targetLang}. Only provide the translation.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.2,
        max_tokens: 300
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Groq API error:', error)
      return NextResponse.json(
        { error: 'Translation service error' },
        { status: response.status }
      )
    }

    const result = await response.json()
    const translation = result.choices[0].message.content.trim()

    if (!translation) {
      return NextResponse.json(
        { error: 'No translation received' },
        { status: 500 }
      )
    }

    return NextResponse.json({ translation })
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: 'Translation service error' },
      { status: 500 }
    )
  }
}
