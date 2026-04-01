// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { authors } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password wajib diisi' },
        { status: 400 }
      );
    }

    const [author] = await db
      .select()
      .from(authors)
      .where(eq(authors.email, email))
      .limit(1);

    if (!author) {
      return NextResponse.json({ error: 'Kredensial tidak valid' }, { status: 401 });
    }

    // Only admin can log in
    if (author.role !== 'admin') {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const valid = await bcrypt.compare(password, author.password);
    if (!valid) {
      return NextResponse.json({ error: 'Kredensial tidak valid' }, { status: 401 });
    }

    // Issue a real JWT
    const token = await signToken({
      sub:   author.id,
      email: author.email,
      role:  author.role,
    });

    const { password: _, ...userWithoutPassword } = author;

    // Send token in body + httpOnly cookie so both Bearer and cookie auth work
    const response = NextResponse.json({ user: userWithoutPassword, token });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 60 * 24 * 7, // 7 days
      path:     '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}