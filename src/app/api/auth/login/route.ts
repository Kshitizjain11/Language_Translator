import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Here you would typically validate the credentials against your database
    // For demo purposes, we'll accept any email/password combination
    const userId = Math.random().toString(36).substr(2, 9);

    return NextResponse.json({ 
      success: true, 
      userId,
      message: 'Login successful' 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  }
} 