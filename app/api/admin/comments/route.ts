// app/api/admin/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { postComments, posts } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const comments = await db
      .select({
        id: postComments.id,
        postId: postComments.postId,
        postTitle: posts.title,
        postSlug: posts.slug,
        authorName: postComments.authorName,
        authorEmail: postComments.authorEmail,
        content: postComments.content,
        approved: postComments.approved,
        createdAt: postComments.createdAt,
      })
      .from(postComments)
      .leftJoin(posts, eq(postComments.postId, posts.id))
      .orderBy(postComments.createdAt);

    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}