// app/api/posts/[slug]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getApprovedComments, createComment } from '@/lib/post-interactions';

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

    const comments = await getApprovedComments(postId);
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
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

    const body = await request.json();
    const { authorName, authorEmail, content } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
    }
    if (content.trim().length > 2000) {
      return NextResponse.json({ error: 'Comment too long (max 2000 chars)' }, { status: 400 });
    }

    const comment = await createComment({
      postId,
      authorName: authorName?.trim() || 'Anonymous',
      authorEmail: authorEmail?.trim() || undefined,
      content: content.trim(),
    });

    return NextResponse.json(
      { message: 'Comment submitted and pending approval', comment },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit comment' }, { status: 500 });
  }
}