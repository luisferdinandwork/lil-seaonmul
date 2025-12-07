// app/api/posts/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts, authors } from '@/db/schema';
import { eq, not, and, or, arrayContains } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }
    
    // Get the post with author details
    const postResult = await db
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
      .where(eq(posts.slug, slug))
      .limit(1);
    
    if (postResult.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    const currentPost = postResult[0];
    
    // Get related posts (posts with similar tags)
    // Only if currentPost has tags
    let relatedPosts: { id: string; title: string; slug: string; excerpt: string | null; featuredImage: string | null; tags: string[] | null; author: { id: string; name: string; avatar: string | null; } | null; createdAt: Date; }[] = [];
    if (currentPost.tags && currentPost.tags.length > 0) {
      relatedPosts = await db
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          excerpt: posts.excerpt,
          featuredImage: posts.featuredImage,
          tags: posts.tags,
          author: {
            id: authors.id,
            name: authors.name,
            avatar: authors.avatar,
          },
          createdAt: posts.createdAt,
        })
        .from(posts)
        .leftJoin(authors, eq(posts.authorId, authors.id))
        .where(
          and(
            not(eq(posts.id, currentPost.id)),
            // Find posts that have at least one tag in common with the current post
            or(
              ...currentPost.tags.map((tag: string) => 
                arrayContains(posts.tags, [tag])
              )
            )
          )
        )
        .limit(3);
    }
    
    // Get popular tags using a different approach
    // First, get all posts with their tags
    const allPosts = await db
      .select({
        tags: posts.tags
      })
      .from(posts);
    
    // Count tag occurrences
    const tagCounts: Record<string, number> = {};
    allPosts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    // Convert to array and sort by count
    const popularTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return NextResponse.json({
      post: currentPost,
      relatedPosts,
      popularTags,
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }
    
    // Check if the post exists
    const existingPost = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1);
    
    if (existingPost.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // If authorId is provided, check if author exists
    if (body.authorId) {
      const existingAuthor = await db
        .select({ id: authors.id })
        .from(authors)
        .where(eq(authors.id, body.authorId))
        .limit(1);

      if (existingAuthor.length === 0) {
        return NextResponse.json(
          { error: 'Author not found' },
          { status: 404 }
        );
      }
    }
    
    // Update the post
    const updatedPost = await db
      .update(posts)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(posts.slug, slug))
      .returning();
    
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
      .where(eq(posts.id, updatedPost[0].id))
      .limit(1);
    
    return NextResponse.json(postWithAuthor[0]);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }
    
    // Get the post before deletion to return it in the response
    const postToDelete = await db
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
      .where(eq(posts.slug, slug))
      .limit(1);
    
    if (postToDelete.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // Delete the post
    await db
      .delete(posts)
      .where(eq(posts.slug, slug));
    
    return NextResponse.json({ 
      message: 'Post deleted successfully', 
      post: postToDelete[0] 
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}