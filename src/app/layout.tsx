import './globals.css'
import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ChatBot from '@/components/ChatBot'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Language Translator',
  description: 'A smart language learning and translation tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
          {children}
        </main>
        <ChatBot />
      </body>
    </html>
  )
}
