// lib/auth.ts
// JWT-based auth utilities (jose — Edge-compatible).
// Install: npm install jose
//
// Add to .env:
//   JWT_SECRET=your-random-secret-at-least-32-chars

import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';
import { db } from '@/db';
import { authors } from '@/db/schema';
import { eq } from 'drizzle-orm';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

const SECRET    = new TextEncoder().encode(process.env.JWT_SECRET);
const ALGORITHM = 'HS256';
const EXPIRY    = '7d';

// ─── Payload shape ────────────────────────────────────────────────────────────

export type JWTPayload = {
  sub:   string; // author id
  email: string;
  role:  string; // 'admin' | 'author'
};

// ─── Sign ─────────────────────────────────────────────────────────────────────

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(SECRET);
}

// ─── Verify ───────────────────────────────────────────────────────────────────

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

// ─── Extract token from request ───────────────────────────────────────────────
// Supports both Authorization: Bearer <token> header and an httpOnly cookie.

export function extractToken(req: NextRequest): string | null {
  const header = req.headers.get('authorization');
  if (header?.startsWith('Bearer ')) return header.substring(7);
  return req.cookies.get('token')?.value ?? null;
}

// ─── Guards ───────────────────────────────────────────────────────────────────

/** Returns decoded payload for any authenticated user, or null. */
export async function getSession(req: NextRequest): Promise<JWTPayload | null> {
  const token = extractToken(req);
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Returns decoded payload only when role === 'admin'.
 * Import and call this in every home-CMS write route.
 *
 * Usage:
 *   const session = await isAdmin(req);
 *   if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 */
export async function isAdmin(req: NextRequest): Promise<JWTPayload | null> {
  const session = await getSession(req);
  if (!session || session.role !== 'admin') return null;
  return session;
}

/** Fetches the full author row for the authenticated user (used in /api/auth/me). */
export async function getAuthorFromRequest(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return null;

  const [author] = await db
    .select()
    .from(authors)
    .where(eq(authors.id, session.sub))
    .limit(1);

  return author ?? null;
}