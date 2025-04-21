'use client'

import React, { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AuthGuardProps {
  children: ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (!userId) router.push('/login')
  }, [router])

  return <>{children}</>
}
