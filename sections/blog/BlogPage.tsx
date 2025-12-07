"use client"

import Link from "next/link";
import Image from "next/image";
import { Calendar, User, Search, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import BlogCard from "@/components/blog/blog-card";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

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
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();
        
        if (Array.isArray(data)) {
          const typedPosts: Post[] = data.map(post => ({
            id: post.id || '',
            title: post.title || '',
            slug: post.slug || '',
            content: post.content || '',
            excerpt: post.excerpt || '',
            featuredImage: post.featuredImage || '',
            tags: Array.isArray(post.tags) ? post.tags : [],
            authorId: post.authorId || '',
            author: post.author || {
              id: '',
              name: 'Anonymous',
              email: '',
              role: 'author'
            },
            readTime: post.readTime || '5 min read',
            createdAt: post.createdAt || new Date().toISOString(),
            updatedAt: post.updatedAt || new Date().toISOString(),
          }));
          
          setPosts(typedPosts);
          setFilteredPosts(typedPosts);
          
          const allTags = typedPosts.flatMap(post => post.tags || []);
          const uniqueTags = Array.from(new Set(allTags)) as string[];
          setAvailableTags(uniqueTags);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        setError('Failed to load posts. Please try again later.');
        console.error(err);
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
      result = result.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.content.toLowerCase().includes(query) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(query)) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query))) ||
        (post.author && post.author.name.toLowerCase().includes(query))
      );
    }
    
    if (selectedTags.length > 0) {
      result = result.filter(post => 
        post.tags && selectedTags.every(tag => post.tags?.includes(tag))
      );
    }
    
    setFilteredPosts(result);
  }, [searchQuery, selectedTags, posts]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-10 sm:mb-12">
        <div className="inline-block mb-4">
          {/* <Badge 
            variant="secondary" 
            className="text-sm px-4 py-1.5 bg-primary/10 text-primary border-primary/20"
          >
            ✨ Our Blog
          </Badge> */}
        </div>
        <h1 className={cn(
          "text-3xl sm:text-4xl lg:text-5xl font-bold mb-4",
          "bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent"
        )}>
          Stories & Insights
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Discover the latest trends, tips, and stories from the world of soft pastel gifts and feminine-neutral design.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-8 sm:mb-10">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search posts, tags, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "pl-10 pr-10 h-11",
                "border-border/50 focus:border-primary/50",
                "transition-all duration-300"
              )}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 h-11",
              "border-border/50 hover:border-primary/50",
              "hover:bg-primary/5 transition-all duration-300"
            )}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {(selectedTags.length > 0 || searchQuery) && (
              <Badge variant="secondary" className="ml-1 bg-primary text-primary-foreground">
                {selectedTags.length + (searchQuery ? 1 : 0)}
              </Badge>
            )}
          </Button>
          
          {(selectedTags.length > 0 || searchQuery) && (
            <Button 
              variant="ghost" 
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground h-11"
            >
              Clear all
            </Button>
          )}
        </div>
        
        {/* Filters Panel */}
        {showFilters && (
          <div className={cn(
            "mt-4 p-4 sm:p-5 rounded-xl border border-border/50",
            "bg-gradient-to-br from-primary/5 via-secondary/5 to-background",
            "backdrop-blur-sm transition-all duration-300"
          )}>
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
              <Filter className="h-4 w-4 text-primary" />
              Filter by tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <Badge 
                  key={tag} 
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all duration-300",
                    selectedTags.includes(tag) 
                      ? "bg-primary text-primary-foreground shadow-sm hover:shadow-md" 
                      : "hover:bg-primary/10 hover:border-primary/50"
                  )}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content Layout */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Sidebar */}
        <aside className="w-full lg:w-72 flex-shrink-0 order-2 lg:order-1">
          <div className="sticky top-24 space-y-6 sm:space-y-8">
            {/* Popular Tags */}
            <div className={cn(
              "p-5 rounded-xl border border-border/50",
              "bg-gradient-to-br from-card to-card/50 backdrop-blur-sm"
            )}>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Filter className="h-4 w-4 text-primary" />
                </div>
                <span>Popular Tags</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {availableTags.slice(0, 10).map(tag => (
                  <Badge 
                    key={tag} 
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-all duration-300",
                      selectedTags.includes(tag) 
                        ? "bg-primary text-primary-foreground shadow-sm" 
                        : "hover:bg-primary/10 hover:border-primary/50"
                    )}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Authors */}
            <div className={cn(
              "p-5 rounded-xl border border-border/50",
              "bg-gradient-to-br from-card to-card/50 backdrop-blur-sm"
            )}>
              <h3 className="font-semibold mb-4">Our Authors</h3>
              <div className="space-y-3">
                {Array.from(new Map(posts.map(post => [post.author.id, post.author])).values()).map(author => (
                  <Link 
                    key={author.id} 
                    href={`/blog?author=${author.id}`} 
                    className={cn(
                      "flex items-center gap-3 p-2.5 rounded-lg",
                      "hover:bg-primary/5 transition-all duration-300 group"
                    )}
                  >
                    {author.avatar ? (
                      <Image 
                        src={author.avatar} 
                        alt={author.name} 
                        width={36} 
                        height={36} 
                        className="rounded-full ring-2 ring-background group-hover:ring-primary/20 transition-all"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-secondary/30 flex items-center justify-center ring-2 ring-background group-hover:ring-primary/20 transition-all">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium group-hover:text-primary transition-colors block truncate">
                        {author.name}
                      </span>
                      {author.role === 'admin' && (
                        <Badge variant="secondary" className="text-[10px] h-4 px-1.5 mt-0.5 bg-primary/10 text-primary border-0">
                          Admin
                        </Badge>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Recent Posts */}
            <div className={cn(
              "p-5 rounded-xl border border-border/50",
              "bg-gradient-to-br from-card to-card/50 backdrop-blur-sm"
            )}>
              <h3 className="font-semibold mb-4">Recent Posts</h3>
              <div className="space-y-4">
                {posts.slice(0, 4).map(post => (
                  <Link 
                    key={post.id} 
                    href={`/blog/${post.slug}`} 
                    className={cn(
                      "block p-2.5 rounded-lg",
                      "hover:bg-primary/5 transition-all duration-300 group"
                    )}
                  >
                    <div className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {post.title}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric'
                      })}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 order-1 lg:order-2">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-muted-foreground">Loading posts...</p>
            </div>
          ) : error ? (
            <div className={cn(
              "text-center py-20 px-6 rounded-xl",
              "bg-destructive/5 border border-destructive/20"
            )}>
              <p className="text-destructive font-medium mb-2">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Search className="h-10 w-10 text-primary/50" />
              </div>
              <p className="text-lg font-medium mb-2">No posts found</p>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
              <Button onClick={clearFilters} variant="default">
                Clear filters
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredPosts.length}</span> {filteredPosts.length === 1 ? 'post' : 'posts'}
              </div>
              <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {filteredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}