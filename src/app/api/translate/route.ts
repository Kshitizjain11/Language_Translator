import { NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'

export async function POST(request: Request) {
  try {
    const { text, sourceLang, targetLang } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    return new Promise((resolve) => {
      const scriptPath = path.join(process.cwd(), 'LangTranslateusignGroqApi.py')
      const pythonProcess = spawn('python', [
        scriptPath,
        '--text', text,
        '--source', sourceLang || 'English',
        '--target', targetLang || 'Spanish'
      ])

      let result = ''
      let error = ''

      pythonProcess.stdout.on('data', (data) => {
        result += data.toString()
      })

      pythonProcess.stderr.on('data', (data) => {
        error += data.toString()
      })

      pythonProcess.on('error', (err) => {
        resolve(NextResponse.json(
          { error: `Failed to start Python process: ${err.message}` },
          { status: 500 }
        ))
      })

      pythonProcess.on('close', (code) => {
        if (code !== 0 || error) {
          resolve(NextResponse.json(
            { error: error || 'Translation failed' },
            { status: 500 }
          ))
        } else {
          const translation = result.trim()
          if (!translation) {
            resolve(NextResponse.json(
              { error: 'No translation received' },
              { status: 500 }
            ))
          } else {
            resolve(NextResponse.json({ translation }))
          }
        }
      })
    })
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}
