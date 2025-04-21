import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Here you would typically:
    // 1. Validate the email format
    // 2. Check if the email already exists in your database
    // 3. Hash the password
    // 4. Create a new user record
    
    // For demo purposes, we'll just generate a random user ID
    const userId = Math.random().toString(36).substr(2, 9);

    return NextResponse.json({ 
      success: true, 
      userId,
      message: 'Account created successfully' 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create account' },
      { status: 400 }
    );
  }
} 