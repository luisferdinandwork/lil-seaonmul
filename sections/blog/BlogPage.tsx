/* eslint-disable @typescript-eslint/no-explicit-any */
// sections/blog/BlogPage.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, User, Search, X, Filter, Eye, Heart, MessageCircle, Clock, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

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

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();

        if (Array.isArray(data)) {
          // Only show published posts on the public page
          const typedPosts: Post[] = data
            .filter((post: any) => post.published !== false)
            .map((post: any) => ({
              id: post.id || "",
              title: post.title || "",
              slug: post.slug || "",
              content: post.content || "",
              excerpt: post.excerpt || "",
              featuredImage: post.featuredImage || "",
              tags: Array.isArray(post.tags) ? post.tags : [],
              authorId: post.authorId || "",
              author: post.author || { id: "", name: "Anonymous", email: "", role: "author" },
              readTime: post.readTime || "5 min read",
              published: post.published ?? true,
              viewCount: post.viewCount ?? 0,
              createdAt: post.createdAt || new Date().toISOString(),
              updatedAt: post.updatedAt || new Date().toISOString(),
            }));

          setPosts(typedPosts);
          setFilteredPosts(typedPosts);

          const allTags = typedPosts.flatMap((post) => post.tags || []);
          setAvailableTags(Array.from(new Set(allTags)));
        }
      } catch (err) {
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    let result = posts;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(query)) ||
          (post.tags && post.tags.some((tag) => tag.toLowerCase().includes(query))) ||
          post.author?.name?.toLowerCase().includes(query)
      );
    }
    if (selectedTags.length > 0) {
      result = result.filter(
        (post) => post.tags && selectedTags.every((tag) => post.tags?.includes(tag))
      );
    }
    setFilteredPosts(result);
  }, [searchQuery, selectedTags, posts]);

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
  };

  const featuredPost = filteredPosts[0];
  const restPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen bg-[#fdfcfb]">
      {/* Hero */}
      <div className="border-b border-stone-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 tracking-tight mb-4">
            Stories & Insights
          </h1>
          <p className="text-stone-500 text-lg max-w-xl mx-auto leading-relaxed">
            Discover the latest trends, tips, and stories from the world of soft pastel gifts and
            feminine-neutral design.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tag filter bar */}
        {availableTags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-10">
            <button
              onClick={() => setSelectedTags([])}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                selectedTags.length === 0
                  ? "bg-stone-900 text-white border-stone-900"
                  : "border-stone-200 text-stone-500 hover:border-stone-400"
              }`}
            >
              All
            </button>
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                  selectedTags.includes(tag)
                    ? "bg-stone-900 text-white border-stone-900"
                    : "border-stone-200 text-stone-500 hover:border-stone-400"
                }`}
              >
                {tag}
              </button>
            ))}
            {(selectedTags.length > 0 || searchQuery) && (
              <button
                onClick={clearFilters}
                className="text-xs text-stone-400 hover:text-stone-600 ml-2"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center py-32 gap-4">
            <div className="w-10 h-10 border-4 border-stone-200 border-t-stone-600 rounded-full animate-spin" />
            <p className="text-stone-400 text-sm">Loading posts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-32">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm px-4 py-2 bg-stone-900 text-white rounded-xl"
            >
              Try Again
            </button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-32">
            <Search className="w-12 h-12 text-stone-200 mx-auto mb-4" />
            <p className="text-stone-500 font-medium">No posts found</p>
            <p className="text-stone-400 text-sm mt-1 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="text-sm px-4 py-2 bg-stone-900 text-white rounded-xl"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-stone-400 mb-6">
              {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
            </p>

            {/* Featured post (first) */}
            {featuredPost && !searchQuery && selectedTags.length === 0 && (
              <Link href={`/blog/${featuredPost.slug}`} className="block group mb-10">
                <div className="bg-white border border-stone-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                  <div className="grid md:grid-cols-2">
                    {featuredPost.featuredImage ? (
                      <div className="relative h-64 md:h-auto overflow-hidden">
                        <Image
                          src={featuredPost.featuredImage}
                          alt={featuredPost.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="h-64 md:h-auto bg-gradient-to-br from-stone-100 to-stone-200" />
                    )}
                    <div className="p-8 sm:p-10 flex flex-col justify-center">
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {featuredPost.tags?.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-stone-100 text-stone-600 px-2.5 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h2 className="text-2xl font-bold text-stone-900 leading-snug mb-3 group-hover:text-stone-700 transition-colors">
                        {featuredPost.title}
                      </h2>
                      {featuredPost.excerpt && (
                        <p className="text-stone-500 text-sm leading-relaxed mb-5 line-clamp-3">
                          {featuredPost.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-3 text-xs text-stone-400">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {featuredPost.author?.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(featuredPost.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-stone-400">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {featuredPost.viewCount}
                          </span>
                          <span className="flex items-center gap-1.5 text-stone-500 font-medium group-hover:gap-2.5 transition-all">
                            Read more <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Post grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(searchQuery || selectedTags.length > 0 ? filteredPosts : restPosts).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-stone-100">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
              <span className="text-4xl opacity-30">✦</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col flex-1">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {post.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h3 className="font-semibold text-stone-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-stone-700 transition-colors">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-stone-500 text-xs leading-relaxed line-clamp-2 mb-4 flex-1">
              {post.excerpt}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-stone-50">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center overflow-hidden">
                {post.author?.avatar ? (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={24}
                    height={24}
                    className="object-cover"
                  />
                ) : (
                  <User className="w-3 h-3 text-stone-400" />
                )}
              </div>
              <span className="text-xs text-stone-500">{post.author?.name}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-stone-400">
              <span className="flex items-center gap-0.5">
                <Eye className="w-3 h-3" />
                {post.viewCount}
              </span>
              <span className="flex items-center gap-0.5">
                <Clock className="w-3 h-3" />
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}