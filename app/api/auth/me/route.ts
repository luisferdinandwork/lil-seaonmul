// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { authors } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // In a real app, you would verify the JWT token here
    // For simplicity, we'll assume the token is the user ID
    const author = await db.select().from(authors).where(eq(authors.id, token)).limit(1);

    if (author.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = author[0];
    
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}