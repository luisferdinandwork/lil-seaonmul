// app/api/posts/[slug]/view/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { incrementViewCount } from '@/lib/post-interactions';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await incrementViewCount(slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
  }
}