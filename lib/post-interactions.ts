// lib/post-interactions.ts
import { db } from '@/lib/db';
import { posts, postLikes, postComments } from '@/db/schema';
import { eq, sql, and } from 'drizzle-orm';

// ─── View Tracking ────────────────────────────────────────────────────────────

/**
 * Increment the view count for a post by slug.
 * Safe to call on every page load — it's fire-and-forget.
 */
export async function incrementViewCount(slug: string): Promise<void> {
  await db
    .update(posts)
    .set({ viewCount: sql`${posts.viewCount} + 1` })
    .where(eq(posts.slug, slug));
}

/**
 * Get the current view count for a post.
 */
export async function getViewCount(postId: string): Promise<number> {
  const result = await db
    .select({ viewCount: posts.viewCount })
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1);
  return result[0]?.viewCount ?? 0;
}

// ─── Like Tracking ────────────────────────────────────────────────────────────

/**
 * Toggle a like for a post. Returns whether the post is now liked.
 * Uses a visitorId (e.g., hashed IP or browser fingerprint) to prevent duplicates.
 */
export async function togglePostLike(
  postId: string,
  visitorId: string
): Promise<{ liked: boolean; likeCount: number }> {
  const existing = await db
    .select({ id: postLikes.id })
    .from(postLikes)
    .where(and(eq(postLikes.postId, postId), eq(postLikes.visitorId, visitorId)))
    .limit(1);

  if (existing.length > 0) {
    // Unlike
    await db
      .delete(postLikes)
      .where(and(eq(postLikes.postId, postId), eq(postLikes.visitorId, visitorId)));
  } else {
    // Like
    await db.insert(postLikes).values({
      id: crypto.randomUUID(),
      postId,
      visitorId,
    });
  }

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(postLikes)
    .where(eq(postLikes.postId, postId));

  return {
    liked: existing.length === 0,
    likeCount: Number(countResult[0]?.count ?? 0),
  };
}

/**
 * Check if a visitor has liked a post, and get total like count.
 */
export async function getPostLikeStatus(
  postId: string,
  visitorId: string
): Promise<{ liked: boolean; likeCount: number }> {
  const [likeCheck, countResult] = await Promise.all([
    db
      .select({ id: postLikes.id })
      .from(postLikes)
      .where(and(eq(postLikes.postId, postId), eq(postLikes.visitorId, visitorId)))
      .limit(1),
    db
      .select({ count: sql<number>`count(*)` })
      .from(postLikes)
      .where(eq(postLikes.postId, postId)),
  ]);

  return {
    liked: likeCheck.length > 0,
    likeCount: Number(countResult[0]?.count ?? 0),
  };
}

/**
 * Get like count for a post (no visitor context).
 */
export async function getLikeCount(postId: string): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(postLikes)
    .where(eq(postLikes.postId, postId));
  return Number(result[0]?.count ?? 0);
}

// ─── Comments ─────────────────────────────────────────────────────────────────

export interface CreateCommentInput {
  postId: string;
  authorName: string;
  authorEmail?: string;
  content: string;
}

/**
 * Create a new comment. Comments are unapproved by default.
 */
export async function createComment(input: CreateCommentInput) {
  const [comment] = await db
    .insert(postComments)
    .values({
      id: crypto.randomUUID(),
      postId: input.postId,
      authorName: input.authorName || 'Anonymous',
      authorEmail: input.authorEmail || null,
      content: input.content,
      approved: false,
    })
    .returning();
  return comment;
}

/**
 * Get approved comments for a post.
 */
export async function getApprovedComments(postId: string) {
  return db
    .select()
    .from(postComments)
    .where(and(eq(postComments.postId, postId), eq(postComments.approved, true)))
    .orderBy(postComments.createdAt);
}

/**
 * Get all comments for a post (admin use).
 */
export async function getAllComments(postId: string) {
  return db
    .select()
    .from(postComments)
    .where(eq(postComments.postId, postId))
    .orderBy(postComments.createdAt);
}

/**
 * Approve a comment (admin only).
 */
export async function approveComment(commentId: string) {
  const [updated] = await db
    .update(postComments)
    .set({ approved: true })
    .where(eq(postComments.id, commentId))
    .returning();
  return updated;
}

/**
 * Delete a comment (admin only).
 */
export async function deleteComment(commentId: string) {
  await db.delete(postComments).where(eq(postComments.id, commentId));
}

/**
 * Get comment count for a post.
 */
export async function getCommentCount(postId: string, approvedOnly = true): Promise<number> {
  const conditions = approvedOnly
    ? and(eq(postComments.postId, postId), eq(postComments.approved, true))
    : eq(postComments.postId, postId);

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(postComments)
    .where(conditions);
  return Number(result[0]?.count ?? 0);
}

// ─── Publish / Unpublish ──────────────────────────────────────────────────────

/**
 * Toggle the published state of a post.
 */
export async function togglePublished(
  postId: string
): Promise<{ published: boolean }> {
  const current = await db
    .select({ published: posts.published })
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1);

  if (current.length === 0) throw new Error('Post not found');

  const newPublished = !current[0].published;
  await db
    .update(posts)
    .set({ published: newPublished, updatedAt: new Date() })
    .where(eq(posts.id, postId));

  return { published: newPublished };
}

// ─── Aggregate Stats ──────────────────────────────────────────────────────────

/**
 * Get full interaction stats for a post.
 */
export async function getPostStats(postId: string, visitorId?: string) {
  const [viewResult, likeCountResult, commentCountResult] = await Promise.all([
    db.select({ viewCount: posts.viewCount }).from(posts).where(eq(posts.id, postId)).limit(1),
    db.select({ count: sql<number>`count(*)` }).from(postLikes).where(eq(postLikes.postId, postId)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(postComments)
      .where(and(eq(postComments.postId, postId), eq(postComments.approved, true))),
  ]);

  let liked = false;
  if (visitorId) {
    const likeCheck = await db
      .select({ id: postLikes.id })
      .from(postLikes)
      .where(and(eq(postLikes.postId, postId), eq(postLikes.visitorId, visitorId)))
      .limit(1);
    liked = likeCheck.length > 0;
  }

  return {
    viewCount: viewResult[0]?.viewCount ?? 0,
    likeCount: Number(likeCountResult[0]?.count ?? 0),
    commentCount: Number(commentCountResult[0]?.count ?? 0),
    liked,
  };
}

// ─── Visitor ID Helper ────────────────────────────────────────────────────────

/**
 * Generate a stable visitor ID from a request (IP + user-agent hash).
 * Use this in API routes to get a consistent per-visitor ID.
 */
export async function getVisitorId(request: Request): Promise<string> {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown';
  const ua = request.headers.get('user-agent') ?? '';
  const raw = `${ip}:${ua}`;

  const encoder = new TextEncoder();
  const data = encoder.encode(raw);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
}