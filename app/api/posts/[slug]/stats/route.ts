// app/api/posts/[slug]/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getLikeCount, getCommentCount } from '@/lib/post-interactions';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const existing = await db
      .select({ id: posts.id, viewCount: posts.viewCount })
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const { id: postId, viewCount } = existing[0];

    const [likeCount, commentCount] = await Promise.all([
      getLikeCount(postId),
      getCommentCount(postId),
    ]);

    return NextResponse.json({
      viewCount:    viewCount    ?? 0,
      likeCount:    likeCount    ?? 0,
      commentCount: commentCount ?? 0,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}