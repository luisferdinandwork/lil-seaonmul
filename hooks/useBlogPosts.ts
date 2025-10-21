// hooks/useBlogPosts.ts
"use client"

import { useState, useEffect } from 'react'

interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  createdAt: string
  featuredImage?: string
}

export function useBlogPosts(limit: number = 2) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts?limit=${limit}`, {
          cache: 'no-store',
        })
        
        if (!res.ok) {
          throw new Error('Failed to fetch posts')
        }
        
        const data = await res.json()
        setPosts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [limit])

  return { posts, loading, error }
}