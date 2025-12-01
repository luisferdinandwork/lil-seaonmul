// @/sections/blog/BlogDetailPage.tsx
"use client"

import Image from "next/image";
import { Calendar, Clock, User, ArrowLeft, Share2, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import DOMPurify from 'dompurify';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  tags?: string[];
  author?: string;
  readTime?: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogDetailPageProps {
  slug: string;
}

export default function BlogDetailPage({ slug }: BlogDetailPageProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (!slug) {
      setError("No post slug provided");
      setLoading(false);
      return;
    }

    async function fetchPost() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${slug}`);
        if (!res.ok) {
          if (res.status === 404) {
            notFound();
          }
          throw new Error('Failed to fetch post');
        }
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError('Failed to load post. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  // Sanitize HTML content
  const createMarkup = (htmlContent: string) => {
    const cleanHTML = DOMPurify.sanitize(htmlContent, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
        'p', 'br', 'hr',
        'ul', 'ol', 'li',
        'blockquote', 
        'a', 
        'strong', 'em', 'u', 's', 'del',
        'code', 'pre',
        'img',
        'div', 'span'
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'target', 'rel']
    });
    return { __html: cleanHTML };
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
    // In a real app, you would save this to a database or local storage
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="text-center py-12">
          <p className="text-red-500">{error || 'Post not found'}</p>
          <Link href="/blog" className="mt-4 inline-block">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>
      </div>
      
      <article className="bg-card rounded-xl overflow-hidden shadow-sm border">
        {/* Featured Image */}
        {post.featuredImage && (
          <div className="aspect-video w-full relative">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              priority
            />
          </div>
        )}
        
        <div className="p-6 md:p-8">
          {/* Article Header */}
          <header className="mb-8">
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{post.title}</h1>
            
            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg text-muted-foreground mb-6 italic">{post.excerpt}</p>
            )}
            
            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-6 border-b">
              {post.author && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              
              {post.readTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime}</span>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 pt-6">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleBookmark}
                className={`flex items-center gap-2 ${bookmarked ? 'bg-primary/10 text-primary' : ''}`}
              >
                <BookmarkPlus className="h-4 w-4" />
                {bookmarked ? 'Saved' : 'Save'}
              </Button>
            </div>
          </header>
          
          {/* Article Content */}
          <div className="prose prose-lg max-w-none tiptap-content">
            <div dangerouslySetInnerHTML={createMarkup(post.content)} />
          </div>
          
          {/* Related Tags Section */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t">
              <h3 className="font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                    <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer">
                      #{tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
      
      {/* Related Articles Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Placeholder for related articles */}
          {[1, 2].map(item => (
            <div key={item} className="bg-card rounded-lg p-5 border shadow-sm">
              <div className="aspect-video bg-muted rounded mb-4"></div>
              <h3 className="font-semibold mb-2">Related Article Title {item}</h3>
              <p className="text-muted-foreground text-sm mb-3">Brief excerpt of the related article content...</p>
              <Button variant="outline" size="sm">Read More</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}