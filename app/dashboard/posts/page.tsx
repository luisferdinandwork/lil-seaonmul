/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/posts/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Eye,
  Heart,
  MessageCircle,
  Plus,
  Search,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Tag,
  User,
  TrendingUp,
  FileText,
  CheckCircle,
  Clock,
  ChevronDown,
  Filter,
  AlertCircle,
  X,
  ArrowUpRight,
} from "lucide-react";

interface Author {
  id: string;
  name: string;
  avatar?: string;
}

interface PostWithStats {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  tags?: string[];
  author: Author;
  readTime?: string;
  published: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  pendingComments: number;
}

type SortKey = "createdAt" | "viewCount" | "likeCount" | "commentCount" | "title";
type FilterStatus = "all" | "published" | "draft";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<PostWithStats[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();

      // published and viewCount come from the API select — stats endpoint is authoritative
      // for likeCount and commentCount, and also returns viewCount for consistency.
      const enriched: PostWithStats[] = await Promise.all(
        data.map(async (post: any) => {
          try {
            const statsRes = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${post.slug}/stats`
            );
            const postStats = statsRes.ok
              ? await statsRes.json()
              : { viewCount: 0, likeCount: 0, commentCount: 0 };
            return {
              ...post,
              // Explicit boolean cast — guards against string "true"/"false" from some DB drivers
              published:    post.published === true || post.published === 'true',
              viewCount:    postStats.viewCount    ?? post.viewCount    ?? 0,
              likeCount:    postStats.likeCount    ?? 0,
              commentCount: postStats.commentCount ?? 0,
            };
          } catch {
            return {
              ...post,
              published:    post.published === true || post.published === 'true',
              viewCount:    post.viewCount ?? 0,
              likeCount:    0,
              commentCount: 0,
            };
          }
        })
      );

      setPosts(enriched);

      // Compute dashboard stats
      const published = enriched.filter((p) => p.published);
      setStats({
        totalPosts: enriched.length,
        publishedPosts: published.length,
        draftPosts: enriched.length - published.length,
        totalViews: enriched.reduce((s, p) => s + p.viewCount, 0),
        totalLikes: enriched.reduce((s, p) => s + p.likeCount, 0),
        totalComments: enriched.reduce((s, p) => s + p.commentCount, 0),
        pendingComments: 0, // would come from admin comments endpoint
      });
    } catch (err) {
      showToast("Failed to load posts", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTogglePublish = async (post: PostWithStats) => {
    setTogglingId(post.id);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${post.slug}/publish`,
        { method: "PATCH" }
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, published: data.published } : p))
      );
      showToast(data.published ? "Post published ✓" : "Post set to draft");
    } catch {
      showToast("Failed to update publish status", "error");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (post: PostWithStats) => {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setDeletingId(post.id);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${post.slug}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error();
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      showToast("Post deleted");
    } catch {
      showToast("Failed to delete post", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags ?? [])));

  const filtered = posts
    .filter((p) => {
      if (filterStatus === "published" && !p.published) return false;
      if (filterStatus === "draft" && p.published) return false;
      if (selectedTag && !p.tags?.includes(selectedTag)) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.author?.name?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortBy === "title") return dir * a.title.localeCompare(b.title);
      if (sortBy === "createdAt")
        return dir * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      return dir * ((a[sortBy] as number) - (b[sortBy] as number));
    });

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(key);
      setSortDir("desc");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans">
      {/* Toast */}
      {toastMsg && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-sm font-medium transition-all duration-300 ${
            toastMsg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {toastMsg.type === "success" ? (
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
          {toastMsg.text}
          <button onClick={() => setToastMsg(null)}>
            <X className="w-3.5 h-3.5 opacity-50 hover:opacity-100" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Posts</h1>
            <p className="text-stone-500 text-sm mt-1">Manage your blog content</p>
          </div>
          <Link
            href="/dashboard/posts/new"
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Post
          </Link>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            {[
              {
                label: "Total Posts",
                value: stats.totalPosts,
                icon: FileText,
                color: "text-stone-600",
                bg: "bg-stone-100",
              },
              {
                label: "Published",
                value: stats.publishedPosts,
                icon: CheckCircle,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
              {
                label: "Drafts",
                value: stats.draftPosts,
                icon: Clock,
                color: "text-amber-600",
                bg: "bg-amber-50",
              },
              {
                label: "Total Views",
                value: stats.totalViews.toLocaleString(),
                icon: Eye,
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                label: "Total Likes",
                value: stats.totalLikes.toLocaleString(),
                icon: Heart,
                color: "text-rose-600",
                bg: "bg-rose-50",
              },
              {
                label: "Comments",
                value: stats.totalComments.toLocaleString(),
                icon: MessageCircle,
                color: "text-violet-600",
                bg: "bg-violet-50",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-2xl border border-stone-100 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <div className="text-2xl font-bold text-stone-900">{s.value}</div>
                <div className="text-xs text-stone-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white border border-stone-100 rounded-2xl shadow-sm mb-6 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-300 focus:border-stone-300 transition"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status filter */}
            <div className="flex gap-1 bg-stone-100 rounded-xl p-1">
              {(["all", "published", "draft"] as FilterStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                    filterStatus === s
                      ? "bg-white text-stone-900 shadow-sm"
                      : "text-stone-500 hover:text-stone-700"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Tag filter */}
            {allTags.length > 0 && (
              <div className="relative">
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="appearance-none pl-4 pr-8 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-300 transition cursor-pointer"
                >
                  <option value="">All tags</option>
                  {allTags.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
              </div>
            )}
          </div>

          {/* Sort controls */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-stone-100">
            <span className="text-xs text-stone-400 font-medium">Sort by:</span>
            {(
              [
                { key: "createdAt", label: "Date" },
                { key: "viewCount", label: "Views" },
                { key: "likeCount", label: "Likes" },
                { key: "commentCount", label: "Comments" },
                { key: "title", label: "Title" },
              ] as { key: SortKey; label: string }[]
            ).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => toggleSort(key)}
                className={`text-xs px-2.5 py-1 rounded-lg transition-all ${
                  sortBy === key
                    ? "bg-stone-900 text-white"
                    : "text-stone-500 hover:bg-stone-100"
                }`}
              >
                {label}
                {sortBy === key && (
                  <span className="ml-1">{sortDir === "desc" ? "↓" : "↑"}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-xs text-stone-400 mb-3 px-1">
          {filtered.length} {filtered.length === 1 ? "post" : "posts"}
        </p>

        {/* Post Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-10 h-10 border-4 border-stone-200 border-t-stone-600 rounded-full animate-spin" />
            <p className="text-stone-500 text-sm">Loading posts...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32">
            <FileText className="w-12 h-12 text-stone-200 mx-auto mb-4" />
            <p className="text-stone-500 font-medium">No posts found</p>
            <p className="text-stone-400 text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((post) => (
              <div
                key={post.id}
                className={`bg-white border rounded-2xl shadow-sm transition-all hover:shadow-md group ${
                  !post.published ? "border-stone-100 opacity-90" : "border-stone-100"
                }`}
              >
                <div className="p-4 sm:p-5 flex items-start gap-4">
                  {/* Status indicator */}
                  <div className="mt-1 flex-shrink-0">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        post.published ? "bg-emerald-400" : "bg-amber-400"
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-stone-900 text-sm leading-snug line-clamp-1 group-hover:text-stone-700 transition-colors">
                          {post.title}
                        </h3>
                        <div className="flex items-center flex-wrap gap-3 mt-1.5">
                          <span className="text-xs text-stone-400 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {post.author?.name ?? "Unknown"}
                          </span>
                          <span className="text-xs text-stone-400">
                            {new Date(post.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          {post.readTime && (
                            <span className="text-xs text-stone-400">{post.readTime}</span>
                          )}
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              post.published
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {post.published ? "Published" : "Draft"}
                          </span>
                        </div>
                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {post.tags.slice(0, 4).map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {post.tags.length > 4 && (
                              <span className="text-[10px] text-stone-400">
                                +{post.tags.length - 4}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="hidden sm:flex items-center gap-5 flex-shrink-0 text-stone-400 text-xs">
                        <StatPill icon={Eye} value={post.viewCount} label="views" />
                        <StatPill icon={Heart} value={post.likeCount} label="likes" />
                        <StatPill icon={MessageCircle} value={post.commentCount} label="comments" />
                      </div>
                    </div>

                    {/* Mobile stats */}
                    <div className="sm:hidden flex gap-4 mt-3 text-stone-400 text-xs">
                      <StatPill icon={Eye} value={post.viewCount} label="views" />
                      <StatPill icon={Heart} value={post.likeCount} label="likes" />
                      <StatPill icon={MessageCircle} value={post.commentCount} label="comments" />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* View */}
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all"
                      title="View post"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>

                    {/* Edit */}
                    <Link
                      href={`/dashboard/posts/${post.slug}/edit`}
                      className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all"
                      title="Edit post"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>

                    {/* Publish toggle */}
                    <button
                      onClick={() => handleTogglePublish(post)}
                      disabled={togglingId === post.id}
                      className={`p-2 rounded-lg transition-all ${
                        togglingId === post.id
                          ? "opacity-50 cursor-wait"
                          : post.published
                          ? "text-emerald-500 hover:text-amber-500 hover:bg-amber-50"
                          : "text-amber-500 hover:text-emerald-600 hover:bg-emerald-50"
                      }`}
                      title={post.published ? "Unpublish" : "Publish"}
                    >
                      {post.published ? (
                        <ToggleRight className="w-4 h-4" />
                      ) : (
                        <ToggleLeft className="w-4 h-4" />
                      )}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(post)}
                      disabled={deletingId === post.id}
                      className={`p-2 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-all ${
                        deletingId === post.id ? "opacity-50 cursor-wait" : ""
                      }`}
                      title="Delete post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatPill({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
}) {
  return (
    <span className="flex items-center gap-1" title={label}>
      <Icon className="w-3 h-3" />
      <span>{value.toLocaleString()}</span>
    </span>
  );
}