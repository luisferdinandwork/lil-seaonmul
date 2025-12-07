// app/api/authors/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authors } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function GET() {
  try {
    // Check if database connection is working
    await db.select({ count: sql`count(*)` }).from(authors).limit(1);
    
    const allAuthors = await db
      .select({
        id: authors.id,
        name: authors.name,
        email: authors.email,
        bio: authors.bio,
        avatar: authors.avatar,
        role: authors.role,
        createdAt: authors.createdAt,
        updatedAt: authors.updatedAt,
      })
      .from(authors);
    
    return NextResponse.json(allAuthors);
  } catch (error) {
    console.error('Error fetching authors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch authors', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, bio, avatar, role } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate role
    if (role && !['author', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be either "author" or "admin"' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingAuthor = await db
      .select({ id: authors.id })
      .from(authors)
      .where(eq(authors.email, email))
      .limit(1);

    if (existingAuthor.length > 0) {
      return NextResponse.json(
        { error: 'An author with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new author
    const newAuthor = await db.insert(authors).values({
      id: crypto.randomUUID(),
      name,
      email,
      password: hashedPassword,
      bio: bio || null,
      avatar: avatar || null,
      role: role || 'author',
    }).returning({
      id: authors.id,
      name: authors.name,
      email: authors.email,
      bio: authors.bio,
      avatar: authors.avatar,
      role: authors.role,
      createdAt: authors.createdAt,
      updatedAt: authors.updatedAt,
    });

    return NextResponse.json(newAuthor[0], { status: 201 });
  } catch (error) {
    console.error('Error creating author:', error);
    return NextResponse.json(
      { error: 'Failed to create author', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}