// app/api/posts/[slug]/like/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { togglePostLike, getPostLikeStatus, getVisitorId } from '@/lib/post-interactions';

async function resolvePostId(slug: string): Promise<string | null> {
  const result = await db
    .select({ id: posts.id })
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);
  return result[0]?.id ?? null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const postId = await resolvePostId(slug);
    if (!postId) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    const visitorId = await getVisitorId(request);
    const status = await getPostLikeStatus(postId, visitorId);
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get like status' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const postId = await resolvePostId(slug);
    if (!postId) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    const visitorId = await getVisitorId(request);
    const result = await togglePostLike(postId, visitorId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
  }
}