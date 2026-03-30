// app/api/posts/[slug]/publish/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { togglePublished } from '@/lib/post-interactions';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const existing = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const result = await togglePublished(existing[0].id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to toggle publish status' }, { status: 500 });
  }
}