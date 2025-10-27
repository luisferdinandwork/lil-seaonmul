"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

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

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featuredImage: ""
  });

  useEffect(() => {
    if (params.id) {
      fetchPost(params.id as string);
    }
  }, [params.id]);

  const fetchPost = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${id}`);
      if (!res.ok) throw new Error('Failed to fetch post');
      const data = await res.json();
      setPost(data);
      setFormData({
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt || "",
        featuredImage: data.featuredImage || ""
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update post');
      
      toast.success('Post updated successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="text-center">
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="text-center">
          <p>Post not found</p>
          <Link href="/dashboard">
            <Button className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <Link href="/dashboard">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold">Edit Post</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Post Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePost} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Input
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="featuredImage">Featured Image URL</Label>
              <Input
                id="featuredImage"
                name="featuredImage"
                value={formData.featuredImage}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={10}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Link href="/dashboard">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button type="submit">Update Post</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}