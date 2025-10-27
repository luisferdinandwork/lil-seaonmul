// sections/home/blog-preview.tsx
"use client"

import { useBlogPosts } from '@/hooks/useBlogPosts'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, ArrowRight } from 'lucide-react'

export function BlogPreview() {
  const { posts, loading, error } = useBlogPosts(2)

  if (loading) {
    return (
      <section aria-labelledby="blog-preview" className="py-12 md:py-16 bg-secondary">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 id="blog-preview" className="text-balance text-2xl font-semibold tracking-tight">
                Latest from our Blog
              </h2>
              <p className="mt-2 text-muted-foreground">Tips, trends, and stories from the world of soft pastel gifts.</p>
            </div>
            <Link href="/blog" className="text-primary hover:underline">
              View All Posts
            </Link>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section aria-labelledby="blog-preview" className="py-12 md:py-16 bg-secondary">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 id="blog-preview" className="text-balance text-2xl font-semibold tracking-tight">
                Latest from our Blog
              </h2>
              <p className="mt-2 text-muted-foreground">Tips, trends, and stories from the world of soft pastel gifts.</p>
            </div>
            <Link href="/blog" className="text-primary hover:underline">
              View All Posts
            </Link>
          </div>
          
          <div className="text-center py-8">
            <p className="text-red-500">Failed to load blog posts. Please try again later.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby="blog-preview" className="py-12 md:py-16 bg-secondary">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 id="blog-preview" className="text-balance text-2xl font-semibold tracking-tight">
              Latest from our Blog
            </h2>
            <p className="mt-2 text-muted-foreground">Tips, trends, and stories from the world of soft pastel gifts.</p>
          </div>
          <Link href="/blog" className="text-primary hover:underline">
            View All Posts
          </Link>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                <p className="text-muted-foreground mb-4">
                  {post.excerpt || post.content.substring(0, 100) + "..."}
                </p>
                <Link href={`/blog/${post.slug}`} className="text-primary hover:underline flex items-center">
                  Read more <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}