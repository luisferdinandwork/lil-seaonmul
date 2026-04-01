// app/sections/blog/BlogPage.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Search, X, Eye, Clock, ArrowRight, User,
  SlidersHorizontal, ChevronDown, TrendingUp,
  Calendar, Tag, ChevronUp,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Author {
  id: string;
  name: string;
  email: string;
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
  authorId: string;
  author: Author;
  readTime?: string;
  published: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

type SortOption = "newest" | "oldest" | "popular";

// ─── Main page ────────────────────────────────────────────────────────────────

export default function BlogPage() {
  const [posts, setPosts]                 = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [searchQuery, setSearchQuery]     = useState("");
  const [selectedTags, setSelectedTags]   = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [sort, setSort]                   = useState<SortOption>("newest");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showSort, setShowSort]           = useState(false);
  const searchRef  = useRef<HTMLInputElement>(null);
  const sortRef    = useRef<HTMLDivElement>(null);
  const filterRef  = useRef<HTMLDivElement>(null);

  // ── Fetch ─────────────────────────────────────────────────────────────────────

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`, { cache: "no-store" })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data: any[]) => {
        if (!Array.isArray(data)) throw new Error();
        const published = data
          .filter(p => p.published === true || p.published === "true")
          .map(p => ({
            id:            p.id            || "",
            title:         p.title         || "",
            slug:          p.slug          || "",
            content:       p.content       || "",
            excerpt:       p.excerpt       || "",
            featuredImage: p.featuredImage || "",
            tags:          Array.isArray(p.tags) ? p.tags : [],
            authorId:      p.authorId      || "",
            author:        p.author        || { id: "", name: "Anonymous", email: "", role: "author" },
            readTime:      p.readTime      || "5 min read",
            published:     true,
            viewCount:     p.viewCount     ?? 0,
            createdAt:     p.createdAt     || new Date().toISOString(),
            updatedAt:     p.updatedAt     || new Date().toISOString(),
          }));
        setPosts(published);
        const tags = Array.from(new Set(published.flatMap(p => p.tags || [])));
        setAvailableTags(tags);
      })
      .catch(() => setError("Failed to load posts. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  // ── Filter + sort ─────────────────────────────────────────────────────────────

  useEffect(() => {
    let result = [...posts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
        p.tags?.some(t => t.toLowerCase().includes(q)) ||
        p.author?.name?.toLowerCase().includes(q)
      );
    }

    if (selectedTags.length > 0) {
      result = result.filter(p =>
        selectedTags.every(t => p.tags?.includes(t))
      );
    }

    result.sort((a, b) => {
      if (sort === "newest")  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sort === "oldest")  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sort === "popular") return b.viewCount - a.viewCount;
      return 0;
    });

    setFilteredPosts(result);
  }, [searchQuery, selectedTags, sort, posts]);

  // ── Close dropdowns on outside click ─────────────────────────────────────────

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node))
        setShowSort(false);
      if (filterRef.current && !filterRef.current.contains(e.target as Node))
        setShowFilterPanel(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Keyboard shortcut ────────────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" &&
          document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setShowSort(false);
        setShowFilterPanel(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────────

  const toggleTag = useCallback((tag: string) =>
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    ), []);

  const clearAll = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setSort("newest");
    setShowFilterPanel(false);
  };

  const hasFilters = !!searchQuery || selectedTags.length > 0 || sort !== "newest";
  const featuredPost = (!searchQuery && selectedTags.length === 0) ? filteredPosts[0] : null;
  const gridPosts    = featuredPost ? filteredPosts.slice(1) : filteredPosts;

  const sortLabels: Record<SortOption, string> = {
    newest:  "Newest first",
    oldest:  "Oldest first",
    popular: "Most viewed",
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-5 sm:px-8 pt-14 pb-12 sm:pt-20 sm:pb-16">
          <p className="text-xs font-semibold text-primary/70 tracking-widest uppercase mb-4">
            Journal
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight mb-4">
            Stories &amp; Insights
          </h1>
          <p className="text-muted-foreground text-base max-w-sm leading-relaxed mb-8">
            Trends, tips, and stories from the world of soft pastel gifts.
          </p>

          {/* ── Search bar ── */}
          <div className="relative max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search posts, tags, authors…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-12 py-3 bg-card border border-border rounded-2xl text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <kbd className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground/40 font-mono bg-muted px-1.5 py-0.5 rounded hidden sm:flex items-center">
                /
              </kbd>
            )}
          </div>
        </div>
      </section>

      {/* ── Toolbar (sticky) ── */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="flex items-center gap-2 py-3">

            {/* Filter button + panel */}
            {availableTags.length > 0 && (
              <div ref={filterRef} className="relative">
                <button
                  onClick={() => setShowFilterPanel(v => !v)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-all ${
                    showFilterPanel || selectedTags.length > 0
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:border-primary/40"
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filter</span>
                  {selectedTags.length > 0 && (
                    <span className="bg-primary-foreground/25 text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {selectedTags.length}
                    </span>
                  )}
                  {showFilterPanel
                    ? <ChevronUp className="w-3 h-3 ml-0.5 opacity-70" />
                    : <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
                  }
                </button>

                {/* Filter dropdown panel */}
                {showFilterPanel && (
                  <div className="absolute left-0 top-full mt-2 w-72 bg-card border border-border rounded-2xl shadow-xl z-30 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Tag className="w-3 h-3" />
                        Filter by tag
                      </span>
                      {selectedTags.length > 0 && (
                        <button
                          onClick={() => setSelectedTags([])}
                          className="text-[11px] text-muted-foreground hover:text-primary transition-colors"
                        >
                          Clear tags
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {availableTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                            selectedTags.includes(tag)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sort dropdown */}
            <div ref={sortRef} className="relative">
              <button
                onClick={() => setShowSort(v => !v)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-all ${
                  sort !== "newest"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border hover:border-primary/40"
                }`}
              >
                {sort === "popular" && <TrendingUp className="w-3.5 h-3.5" />}
                <span>{sortLabels[sort]}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showSort ? "rotate-180" : ""}`} />
              </button>

              {showSort && (
                <div className="absolute left-0 top-full mt-2 w-44 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-30 py-1">
                  {(["newest", "oldest", "popular"] as SortOption[]).map(opt => (
                    <button
                      key={opt}
                      onClick={() => { setSort(opt); setShowSort(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                        sort === opt
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {opt === "popular" && <TrendingUp className="w-3.5 h-3.5 opacity-60" />}
                      {opt === "newest" && <Calendar className="w-3.5 h-3.5 opacity-60" />}
                      {opt === "oldest" && <Calendar className="w-3.5 h-3.5 opacity-60 scale-x-[-1]" />}
                      {sortLabels[opt]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Active tag pills (visible in toolbar) */}
            {selectedTags.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none flex-1">
                {selectedTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="flex items-center gap-1 text-[11px] bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium flex-shrink-0 hover:bg-primary/20 transition-colors"
                  >
                    {tag}
                    <X className="w-2.5 h-2.5" />
                  </button>
                ))}
              </div>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Clear all */}
            {hasFilters && (
              <button
                onClick={clearAll}
                className="text-xs text-muted-foreground hover:text-foreground flex-shrink-0 transition-colors px-2 py-1"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="max-w-4xl mx-auto px-5 sm:px-8 py-8 sm:py-10">

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} />
        ) : filteredPosts.length === 0 ? (
          <EmptyState hasFilters={hasFilters} onClear={clearAll} />
        ) : (
          <>
            {/* Results count */}
            <p className="text-xs text-muted-foreground mb-6">
              {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
              {hasFilters && " · filtered"}
            </p>

            {/* Featured post */}
            {featuredPost && <FeaturedCard post={featuredPost} />}

            {/* Grid */}
            {gridPosts.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
                {gridPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

// ─── Featured card ────────────────────────────────────────────────────────────

function FeaturedCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group mb-6">
      <article className="bg-card border border-border rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">

        {/* Mobile: stacked. Desktop: side-by-side */}
        <div className="flex flex-col sm:grid sm:grid-cols-5">

          {/* Image */}
          <div className="sm:col-span-2 relative h-52 sm:h-auto overflow-hidden bg-muted">
            {post.featuredImage ? (
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <PlaceholderImage />
            )}
            <div className="absolute top-3 left-3">
              <span className="text-[10px] font-bold bg-primary text-primary-foreground px-2.5 py-1 rounded-full uppercase tracking-wider">
                Featured
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="sm:col-span-3 p-6 sm:p-8 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 3).map(tag => (
                    <TagPill key={tag} tag={tag} />
                  ))}
                </div>
              )}

              <h2 className="text-lg sm:text-xl font-bold text-foreground leading-snug group-hover:text-primary transition-colors duration-200">
                {post.title}
              </h2>

              {post.excerpt && (
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              )}
            </div>

            {/* Meta */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <AuthorMeta author={post.author} date={post.createdAt} />
              <PostMeta viewCount={post.viewCount} showArrow />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ─── Post card ────────────────────────────────────────────────────────────────

function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 h-full flex flex-col">

        {/* Image */}
        <div className="relative h-40 sm:h-44 overflow-hidden bg-muted flex-shrink-0">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <PlaceholderImage />
          )}
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 gap-3">

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.slice(0, 2).map(tag => (
                <TagPill key={tag} tag={tag} small />
              ))}
              {post.tags.length > 2 && (
                <span className="text-[10px] text-muted-foreground self-center">
                  +{post.tags.length - 2}
                </span>
              )}
            </div>
          )}

          <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200 flex-1">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
              {post.excerpt}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
            <AuthorMeta author={post.author} compact />
            <PostMeta viewCount={post.viewCount} readTime={post.readTime} />
          </div>
        </div>
      </article>
    </Link>
  );
}

// ─── Shared small components ──────────────────────────────────────────────────

function TagPill({ tag, small }: { tag: string; small?: boolean }) {
  return (
    <span className={`bg-primary/10 text-primary font-medium rounded-full ${
      small ? "text-[10px] px-2 py-0.5" : "text-[11px] px-2.5 py-0.5"
    }`}>
      {tag}
    </span>
  );
}

function AuthorMeta({
  author, date, compact,
}: {
  author: Post["author"];
  date?: string;
  compact?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <Avatar author={author} size={compact ? 22 : 28} />
      <div className="min-w-0">
        <p className={`font-semibold text-foreground truncate ${compact ? "text-[11px]" : "text-xs"}`}>
          {author?.name}
        </p>
        {date && (
          <p className="text-[10px] text-muted-foreground">
            {new Date(date).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
            })}
          </p>
        )}
      </div>
    </div>
  );
}

function PostMeta({
  viewCount, readTime, showArrow,
}: {
  viewCount: number;
  readTime?: string;
  showArrow?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground flex-shrink-0">
      <span className="flex items-center gap-0.5">
        <Eye className="w-3 h-3" />
        {viewCount.toLocaleString()}
      </span>
      {readTime && (
        <>
          <span className="text-border">·</span>
          <span className="flex items-center gap-0.5">
            <Clock className="w-3 h-3" />
            {readTime}
          </span>
        </>
      )}
      {showArrow && (
        <span className="flex items-center gap-0.5 text-primary font-semibold ml-1 group-hover:gap-1.5 transition-all">
          Read <ArrowRight className="w-3.5 h-3.5" />
        </span>
      )}
    </div>
  );
}

function PlaceholderImage() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-primary/10 via-primary/5 to-secondary flex items-center justify-center">
      <span className="text-4xl opacity-10">✦</span>
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ author, size }: { author: Post["author"]; size: number }) {
  return (
    <div
      className="rounded-full bg-secondary overflow-hidden flex items-center justify-center flex-shrink-0 ring-1 ring-border"
      style={{ width: size, height: size }}
    >
      {author?.avatar ? (
        <Image
          src={author.avatar}
          alt={author.name}
          width={size}
          height={size}
          className="object-cover w-full h-full"
        />
      ) : (
        <User
          className="text-muted-foreground"
          style={{ width: size * 0.5, height: size * 0.5 }}
        />
      )}
    </div>
  );
}

// ─── States ───────────────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="flex flex-col items-center py-28 gap-4">
      <div className="w-8 h-8 border-[3px] border-border border-t-primary rounded-full animate-spin" />
      <p className="text-muted-foreground text-sm">Loading posts…</p>
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="text-center py-28">
      <p className="text-destructive mb-5 text-sm">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="text-sm px-5 py-2.5 bg-foreground text-background rounded-xl font-semibold hover:bg-foreground/90 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

function EmptyState({ hasFilters, onClear }: { hasFilters: boolean; onClear: () => void }) {
  return (
    <div className="text-center py-28">
      <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-5">
        <Search className="w-6 h-6 text-muted-foreground" />
      </div>
      <p className="text-foreground font-semibold mb-2">No posts found</p>
      <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
        {hasFilters
          ? "Try adjusting your search or filters"
          : "Check back soon — new posts are on the way"}
      </p>
      {hasFilters && (
        <button
          onClick={onClear}
          className="text-sm px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}