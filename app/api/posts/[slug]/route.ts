// app/api/posts/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts, authors } from '@/db/schema';
import { eq, not, and, or, arrayContains } from 'drizzle-orm';

// ─── Shared select shape ──────────────────────────────────────────────────────
// Single source of truth — every handler uses this so nothing is ever missed.
const postSelect = {
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
  published: posts.published,   // ← was missing before
  viewCount: posts.viewCount,   // ← was missing before
  createdAt: posts.createdAt,
  updatedAt: posts.updatedAt,
};

// ─── GET /api/posts/[slug] ────────────────────────────────────────────────────

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }

    const postResult = await db
      .select(postSelect)
      .from(posts)
      .leftJoin(authors, eq(posts.authorId, authors.id))
      .where(eq(posts.slug, slug))
      .limit(1);

    if (postResult.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const currentPost = postResult[0];

    // Related posts — share at least one tag
    let relatedPosts: typeof postResult = [];
    if (currentPost.tags && currentPost.tags.length > 0) {
      relatedPosts = await db
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
          published: posts.published,
          viewCount: posts.viewCount,
          createdAt: posts.createdAt,
          updatedAt: posts.updatedAt,
        })
        .from(posts)
        .leftJoin(authors, eq(posts.authorId, authors.id))
        .where(
          and(
            not(eq(posts.id, currentPost.id)),
            eq(posts.published, true),         // only show published related posts
            or(
              ...currentPost.tags.map((tag: string) =>
                arrayContains(posts.tags, [tag])
              )
            )
          )
        )
        .limit(3);
    }

    // Popular tags
    const allPosts = await db.select({ tags: posts.tags }).from(posts);
    const tagCounts: Record<string, number> = {};
    allPosts.forEach((post) => {
      post.tags?.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    const popularTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({ post: currentPost, relatedPosts, popularTags });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// ─── PUT /api/posts/[slug] ────────────────────────────────────────────────────

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

    const existingPost = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1);

    if (existingPost.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (body.authorId) {
      const existingAuthor = await db
        .select({ id: authors.id })
        .from(authors)
        .where(eq(authors.id, body.authorId))
        .limit(1);

      if (existingAuthor.length === 0) {
        return NextResponse.json({ error: 'Author not found' }, { status: 404 });
      }
    }

    // Whitelist updatable fields — never let viewCount be overwritten from body
    const {
      title, slug: newSlug, content, excerpt,
      featuredImage, tags, authorId, readTime, published,
    } = body;

    const updatedPost = await db
      .update(posts)
      .set({
        ...(title !== undefined && { title }),
        ...(newSlug !== undefined && { slug: newSlug }),
        ...(content !== undefined && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(featuredImage !== undefined && { featuredImage }),
        ...(tags !== undefined && { tags }),
        ...(authorId !== undefined && { authorId }),
        ...(readTime !== undefined && { readTime }),
        ...(published !== undefined && { published }),
        updatedAt: new Date(),
      })
      .where(eq(posts.slug, slug))
      .returning();

    const postWithAuthor = await db
      .select(postSelect)
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

// ─── DELETE /api/posts/[slug] ─────────────────────────────────────────────────

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }

    const postToDelete = await db
      .select(postSelect)
      .from(posts)
      .leftJoin(authors, eq(posts.authorId, authors.id))
      .where(eq(posts.slug, slug))
      .limit(1);

    if (postToDelete.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await db.delete(posts).where(eq(posts.slug, slug));

    return NextResponse.json({
      message: 'Post deleted successfully',
      post: postToDelete[0],
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}