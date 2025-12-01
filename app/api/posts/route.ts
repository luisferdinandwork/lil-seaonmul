import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts, authors } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

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
        tags: posts.tags,
        authorId: posts.authorId,
        author: {
          id: authors.id,
          name: authors.name,
          email: authors.email,
          bio: authors.bio,
          avatar: authors.avatar,
          role: authors.role,
        },
        readTime: posts.readTime,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
      })
      .from(posts)
      .leftJoin(authors, eq(posts.authorId, authors.id));
    
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
    const { title, slug, content, excerpt, featuredImage, tags, authorId, readTime } = body;

    // Validate required fields
    if (!title || !slug || !content || !authorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Check if author exists
    const existingAuthor = await db
      .select({ id: authors.id })
      .from(authors)
      .where(eq(authors.id, authorId))
      .limit(1);

    if (existingAuthor.length === 0) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      );
    }

    // Insert the new post
    const newPost = await db.insert(posts).values({
      id: crypto.randomUUID(),
      title,
      slug,
      content,
      excerpt: excerpt || null,
      featuredImage: featuredImage || null,
      tags: tags || [],
      authorId,
      readTime: readTime || '5 min read',
    }).returning();

    // Get the full post with author details
    const postWithAuthor = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        content: posts.content,
        excerpt: posts.excerpt,
        featuredImage: posts.featuredImage,
        tags: posts.tags,
        authorId: posts.authorId,
        author: {
          id: authors.id,
          name: authors.name,
          email: authors.email,
          bio: authors.bio,
          avatar: authors.avatar,
          role: authors.role,
        },
        readTime: posts.readTime,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
      })
      .from(posts)
      .leftJoin(authors, eq(posts.authorId, authors.id))
      .where(eq(posts.id, newPost[0].id))
      .limit(1);

    return NextResponse.json(postWithAuthor[0], { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}