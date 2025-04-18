import { NextResponse } from 'next/server'
import { spawn } from 'child_process'

export async function POST(request: Request) {
  try {
    const { text, sourceLang, targetLang } = await request.json()

    return new Promise((resolve) => {
      const pythonProcess = spawn('python', [
        'LangTranslateusignGroqApi.py',
        '--text', text,
        '--source', sourceLang,
        '--target', targetLang
      ])

      let result = ''
      let error = ''

      pythonProcess.stdout.on('data', (data) => {
        result += data.toString()
      })

      pythonProcess.stderr.on('data', (data) => {
        error += data.toString()
      })

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          resolve(NextResponse.json(
            { error: error || 'Translation failed' },
            { status: 500 }
          ))
        } else {
          resolve(NextResponse.json({ translation: result.trim() }))
        }
      })
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}
