/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/authors/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authors } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
    }
    
    const author = await db
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
      .from(authors)
      .where(eq(authors.id, id))
      .limit(1);
    
    if (author.length === 0) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }
    
    return NextResponse.json(author[0]);
  } catch (error) {
    console.error('Error fetching author:', error);
    return NextResponse.json(
      { error: 'Failed to fetch author', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, password, bio, avatar, role } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
    }
    
    // Check if the author exists
    const existingAuthor = await db
      .select({ id: authors.id, email: authors.email })
      .from(authors)
      .where(eq(authors.id, id))
      .limit(1);
    
    if (existingAuthor.length === 0) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }
    
    // If email is being updated, check if it's already in use by another author
    if (email && email !== existingAuthor[0].email) {
      const emailCheck = await db
        .select({ id: authors.id })
        .from(authors)
        .where(eq(authors.email, email))
        .limit(1);
      
      if (emailCheck.length > 0 && emailCheck[0].id !== id) {
        return NextResponse.json(
          { error: 'An author with this email already exists' },
          { status: 409 }
        );
      }
    }
    
    // Validate role if provided
    if (role && !['author', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be either "author" or "admin"' },
        { status: 400 }
      );
    }
    
    // Prepare update data
    const updateData: any = {
      name,
      email,
      bio: bio || null,
      avatar: avatar || null,
      role: role || 'author',
      updatedAt: new Date(),
    };
    
    // Only update password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    
    // Update the author
    const updatedAuthor = await db
      .update(authors)
      .set(updateData)
      .where(eq(authors.id, id))
      .returning({
        id: authors.id,
        name: authors.name,
        email: authors.email,
        bio: authors.bio,
        avatar: authors.avatar,
        role: authors.role,
        createdAt: authors.createdAt,
        updatedAt: authors.updatedAt,
      });
    
    return NextResponse.json(updatedAuthor[0]);
  } catch (error) {
    console.error('Error updating author:', error);
    return NextResponse.json(
      { error: 'Failed to update author', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
    }
    
    // Check if the author exists
    const existingAuthor = await db
      .select({ id: authors.id })
      .from(authors)
      .where(eq(authors.id, id))
      .limit(1);
    
    if (existingAuthor.length === 0) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }
    
    // Delete the author
    const deletedAuthor = await db
      .delete(authors)
      .where(eq(authors.id, id))
      .returning({
        id: authors.id,
        name: authors.name,
        email: authors.email,
        bio: authors.bio,
        avatar: authors.avatar,
        role: authors.role,
        createdAt: authors.createdAt,
        updatedAt: authors.updatedAt,
      });
    
    return NextResponse.json({ 
      message: 'Author deleted successfully', 
      author: deletedAuthor[0] 
    });
  } catch (error) {
    console.error('Error deleting author:', error);
    return NextResponse.json(
      { error: 'Failed to delete author', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}