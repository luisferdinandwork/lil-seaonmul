// app/sections/blog/BlogDetailPage.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar, User, Clock, Eye, Heart, MessageCircle,
  ArrowLeft, Send, Loader2, CheckCircle,
} from "lucide-react";
import TiptapContent from "@/components/editor/TiptapContent";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Author {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  role: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  tags?: string[];
  author: Author;
  readTime?: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  tags?: string[];
  author: { id: string; name: string; avatar?: string } | null;
  createdAt: string;
}

interface Comment {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BlogDetailPage({ slug }: { slug: string }) {
  const [post, setPost]               = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [likeCount, setLikeCount]     = useState(0);
  const [liked, setLiked]             = useState(false);
  const [liking, setLiking]           = useState(false);
  const [comments, setComments]       = useState<Comment[]>([]);
  const [commentName, setCommentName] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const viewTracked = useRef(false);

  // ── Data loading ──────────────────────────────────────────────────────────────

  useEffect(() => {
    fetch(`/api/posts/${slug}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => { setPost(d.post ?? d); setRelatedPosts(d.relatedPosts ?? []); })
      .catch(() => setError("Post not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!post || viewTracked.current) return;
    viewTracked.current = true;
    fetch(`/api/posts/${slug}/view`, { method: "POST" }).catch(() => {});
  }, [post, slug]);

  useEffect(() => {
    if (!post) return;
    fetch(`/api/posts/${slug}/like`)
      .then(r => r.json())
      .then(d => { setLikeCount(d.likeCount ?? 0); setLiked(d.liked ?? false); })
      .catch(() => {});
  }, [post, slug]);

  useEffect(() => {
    if (!post) return;
    fetch(`/api/posts/${slug}/comments`)
      .then(r => r.json())
      .then(d => Array.isArray(d) && setComments(d))
      .catch(() => {});
  }, [post, slug]);

  // ── Actions ───────────────────────────────────────────────────────────────────

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);
    try {
      const res = await fetch(`/api/posts/${slug}/like`, { method: "POST" });
      const d = await res.json();
      setLiked(d.liked);
      setLikeCount(d.likeCount);
    } catch {}
    setLiking(false);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName:  commentName.trim() || "Anonymous",
          authorEmail: commentEmail.trim() || undefined,
          content:     commentText.trim(),
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        setCommentText(""); setCommentName(""); setCommentEmail("");
      }
    } catch {}
    setSubmitting(false);
  };

  // ── States ────────────────────────────────────────────────────────────────────

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-border border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (error || !post) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <p className="text-muted-foreground text-lg">Post not found</p>
      <Link href="/blog" className="text-sm text-foreground underline underline-offset-4">
        ← Back to blog
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero image ── */}
      {post.featuredImage && (
        <div className="relative w-full h-72 sm:h-[420px] overflow-hidden">
          <Image src={post.featuredImage} alt={post.title} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* Back */}
        <Link href="/blog"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to blog
        </Link>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {post.tags.map(tag => (
              <Link key={tag} href={`/blog?tag=${tag}`}
                className="text-xs bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary px-3 py-1 rounded-full transition-colors">
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-5">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center flex-wrap gap-4 pb-6 mb-8 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-secondary overflow-hidden flex-shrink-0 ring-2 ring-border">
              {post.author?.avatar ? (
                <Image src={post.author.avatar} alt={post.author.name} width={36} height={36}
                  className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{post.author?.name}</p>
              {post.author?.role === "admin" && (
                <p className="text-[10px] text-primary font-medium">Admin</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground ml-auto flex-wrap justify-end">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "long", day: "numeric", year: "numeric",
              })}
            </span>
            {post.readTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readTime}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {(post.viewCount + 1).toLocaleString()} views
            </span>
          </div>
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-muted-foreground text-lg leading-relaxed mb-8 font-light border-l-2 border-primary/30 pl-4 italic">
            {post.excerpt}
          </p>
        )}

        {/* ── Content — rendered with same Tiptap styles as the editor ── */}
        <TiptapContent
          html={post.content}
          className="mb-12 text-foreground"
        />

        {/* ── Like button ── */}
        <div className="flex items-center justify-center py-10 border-t border-b border-border mb-12">
          <button onClick={handleLike} disabled={liking}
            className={`flex flex-col items-center gap-2 px-10 py-6 rounded-2xl border-2 transition-all duration-200 ${
              liked
                ? "border-primary/40 bg-primary/5 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
            } ${liking ? "opacity-70 cursor-wait" : "cursor-pointer"}`}>
            <Heart className={`w-8 h-8 transition-all duration-200 ${liked ? "fill-current scale-110" : ""}`} />
            <span className="text-2xl font-bold text-foreground">{likeCount}</span>
            <span className="text-xs font-medium">{liked ? "You liked this ✓" : "Like this post"}</span>
          </button>
        </div>

        {/* ── Author bio ── */}
        {post.author?.bio && (
          <div className="bg-secondary/50 border border-border rounded-2xl p-6 mb-12 flex gap-4">
            <div className="w-14 h-14 rounded-full bg-secondary overflow-hidden flex-shrink-0 ring-2 ring-border">
              {post.author.avatar ? (
                <Image src={post.author.avatar} alt={post.author.name} width={56} height={56}
                  className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">{post.author.name}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{post.author.bio}</p>
            </div>
          </div>
        )}

        {/* ── Comments ── */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-muted-foreground" />
            Comments
            {comments.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">({comments.length})</span>
            )}
          </h2>

          {comments.length > 0 ? (
            <div className="space-y-4 mb-8">
              {comments.map(c => (
                <div key={c.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <span className="text-sm font-semibold text-foreground">{c.authorName}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">{c.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm mb-8">No comments yet. Be the first!</p>
          )}

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">Comment submitted!</p>
                <p className="text-xs text-emerald-600 mt-0.5">Pending approval — it&apos;ll appear shortly.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleComment} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4 text-sm">Leave a comment</h3>
              <div className="grid sm:grid-cols-2 gap-3 mb-3">
                <input type="text" value={commentName}
                  onChange={e => setCommentName(e.target.value)}
                  placeholder="Your name (optional)"
                  className="w-full text-sm bg-background border border-input rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/50" />
                <input type="email" value={commentEmail}
                  onChange={e => setCommentEmail(e.target.value)}
                  placeholder="Email (optional)"
                  className="w-full text-sm bg-background border border-input rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/50" />
              </div>
              <textarea value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Write your comment…"
                rows={4} required
                className="w-full text-sm bg-background border border-input rounded-xl px-4 py-3 mb-3 outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/50 resize-none" />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Comments are moderated before appearing.</p>
                <button type="submit" disabled={submitting || !commentText.trim()}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ── Related posts ── */}
        {relatedPosts.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-6">Related Posts</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedPosts.map(r => (
                <Link key={r.id} href={`/blog/${r.slug}`}
                  className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                  <div className="relative h-36 overflow-hidden bg-secondary">
                    {r.featuredImage ? (
                      <Image src={r.featuredImage} alt={r.title} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl opacity-20">✦</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {r.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}