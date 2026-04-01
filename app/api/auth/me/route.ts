// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthorFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const author = await getAuthorFromRequest(request);

    if (!author) {
      return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
    }

    const { password: _, ...userWithoutPassword } = author;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}