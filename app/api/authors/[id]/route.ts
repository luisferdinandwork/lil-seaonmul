import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authors } from '@/db/schema';
import { eq } from 'drizzle-orm';

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
    
    // If email is being updated, check if it's already in use by another author
    if (body.email) {
      const emailCheck = await db
        .select({ id: authors.id })
        .from(authors)
        .where(eq(authors.email, body.email))
        .limit(1);
      
      if (emailCheck.length > 0 && emailCheck[0].id !== id) {
        return NextResponse.json(
          { error: 'An author with this email already exists' },
          { status: 409 }
        );
      }
    }
    
    // Update the author
    const updatedAuthor = await db
      .update(authors)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(authors.id, id))
      .returning();
    
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
      .returning();
    
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