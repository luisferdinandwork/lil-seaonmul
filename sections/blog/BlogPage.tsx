"use client"

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User, Search, X, Filter } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
        
        // Type guard to ensure data is an array of Post objects
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
          
          // Extract all unique tags
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
    // Filter posts based on search query and selected tags
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
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Blog</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover the latest trends, tips, and stories from the world of soft pastel gifts and feminine-neutral design.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search posts, tags, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 w-full md:w-auto"
          >
            <Filter className="h-4 w-4" />
            Filters
            {(selectedTags.length > 0 || searchQuery) && (
              <Badge variant="secondary" className="ml-1">
                {selectedTags.length + (searchQuery ? 1 : 0)}
              </Badge>
            )}
          </Button>
          
          {(selectedTags.length > 0 || searchQuery) && (
            <Button 
              variant="ghost" 
              onClick={clearFilters}
              className="text-muted-foreground w-full md:w-auto"
            >
              Clear all
            </Button>
          )}
        </div>
        
        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Filter by tags</h3>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <Badge 
                  key={tag} 
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
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
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Popular Tags */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {availableTags.slice(0, 8).map(tag => (
                  <Badge 
                    key={tag} 
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Authors */}
            <div>
              <h3 className="font-semibold mb-3">Authors</h3>
              <div className="space-y-3">
                {Array.from(new Map(posts.map(post => [post.author.id, post.author])).values()).map(author => (
                  <Link key={author.id} href={`/blog?author=${author.id}`} className="flex items-center gap-2 group">
                    {author.avatar ? (
                      <Image 
                        src={author.avatar} 
                        alt={author.name} 
                        width={32} 
                        height={32} 
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <span className="text-sm group-hover:text-primary transition-colors">
                      {author.name}
                    </span>
                    {author.role === 'admin' && (
                      <Badge variant="secondary" className="text-xs">Admin</Badge>
                    )}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Recent Posts */}
            <div>
              <h3 className="font-semibold mb-3">Recent Posts</h3>
              <div className="space-y-3">
                {posts.slice(0, 3).map(post => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
                    <div className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading posts...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No posts match your filters.</p>
              <Button onClick={clearFilters}>Clear filters</Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden transition-all hover:shadow-lg">
                  <CardHeader className="p-0">
                    {post.featuredImage ? (
                      <div className="aspect-video w-full relative">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://via.placeholder.com/400x225?text=${encodeURIComponent(post.title)}`;
                          }}
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">No Image</span>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="p-5">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags?.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mb-3 gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      {post.readTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{post.readTime}</span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt || post.content.substring(0, 120) + "..."}
                    </p>
                  </CardContent>
                  <CardFooter className="px-5 pb-5 pt-0 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {post.author.avatar ? (
                        <Image 
                          src={post.author.avatar} 
                          alt={post.author.name} 
                          width={24} 
                          height={24} 
                          className="rounded-full"
                        />
                      ) : (
                        <User className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        {post.author.name}
                      </span>
                      {post.author.role === 'admin' && (
                        <Badge variant="outline" className="text-xs">Admin</Badge>
                      )}
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <Button variant="outline" size="sm">
                        Read Post
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}