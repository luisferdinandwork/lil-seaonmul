import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    // Check if database connection is working
    await db.select({ count: sql`count(*)` }).from(posts).limit(1);
    
    const allPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        content: posts.content,
        excerpt: posts.excerpt,
        featuredImage: posts.featuredImage,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
      })
      .from(posts);
    
    return NextResponse.json(allPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, content, excerpt, featuredImage } = body;

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, and content are required' }, 
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPost = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1);

    if (existingPost.length > 0) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' }, 
        { status: 409 }
      );
    }

    // Generate a unique ID
    const id = uuidv4();

    // Create the new post
    const newPost = await db
      .insert(posts)
      .values({
        id,
        title,
        slug,
        content,
        excerpt: excerpt || null,
        featuredImage: featuredImage || null,
      })
      .returning({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        content: posts.content,
        excerpt: posts.excerpt,
        featuredImage: posts.featuredImage,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
      });

    return NextResponse.json(newPost[0], { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}