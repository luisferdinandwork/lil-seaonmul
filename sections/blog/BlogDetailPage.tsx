"use client"

import Image from "next/image";
import { Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { notFound } from "next/navigation";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogDetailPageProps {
  params: {
    slug: string;
  };
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${params.slug}`);
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
  }, [params.slug]);

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
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>
        
        {post.featuredImage && (
          <div className="aspect-video w-full relative mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://via.placeholder.com/800x450?text=${encodeURIComponent(post.title)}`;
              }}
            />
          </div>
        )}
        
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>
        
        {post.excerpt && (
          <p className="text-lg text-muted-foreground mb-8 italic">{post.excerpt}</p>
        )}
      </div>
      
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
      </div>
    </div>
  );
}