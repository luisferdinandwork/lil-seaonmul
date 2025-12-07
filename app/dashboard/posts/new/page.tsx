// app/dashboard/posts/new/page.tsx
"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import ImageUpload from "@/components/ImageUpload";
import dynamic from "next/dynamic";
import { useAuth } from "@/app/auth-context";
import TagsInput from "@/components/dashboard/TagsInput";

interface PostFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  authorId: string;
  tags: string[];
}

const TiptapEditor = dynamic(() => import('@/components/TiptapEditor'), {
  ssr: false,
  loading: () => (
    <div className="border rounded-md overflow-hidden">
      <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
      <div className="min-h-[200px] p-4 bg-gray-50">
        <p className="text-gray-500">Loading editor...</p>
      </div>
    </div>
  )
});

export default function NewPostPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [popularTags, setPopularTags] = useState<{ tag: string; count: number }[]>([]);
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featuredImage: "",
    authorId: "",
    tags: []
  });

  // Set authorId when user is available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, authorId: user.id }));
    }
  }, [user]);

  // Fetch popular tags
  useEffect(() => {
    const fetchPopularTags = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tags/popular`);
        if (res.ok) {
          const data = await res.json();
          setPopularTags(data);
        }
      } catch (error) {
        console.error('Error fetching popular tags:', error);
      }
    };

    fetchPopularTags();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate before submitting
    if (!formData.title || !formData.slug || !formData.content || !formData.authorId) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create post');
      }
      
      toast.success('Post created successfully');
      router.push(`/blog/${data.slug}`);
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, featuredImage: url }));
  };

  const handleContentChange = (value: string) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  const handleTagsChange = (tags: string[]) => {
    setFormData(prev => ({ ...prev, tags }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      title,
      slug: generateSlug(title) // Auto-generate slug from title
    }));
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p>You must be logged in to create a post.</p>
          <Link href="/login" className="mt-4 inline-block">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/dashboard">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold">Create New Post</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreatePost} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
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
              <p className="text-sm text-muted-foreground">
                The URL-friendly version of the title. Auto-generated from title.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={2}
              />
              <p className="text-sm text-muted-foreground">
                A short summary of the post (optional).
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Tags</Label>
              <TagsInput 
                value={formData.tags} 
                onChange={handleTagsChange}
                popularTags={popularTags}
              />
              <p className="text-sm text-muted-foreground">
                Add tags to categorize your post. Press Enter to add a tag.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Featured Image</Label>
              <ImageUpload onImageUpload={handleImageUpload} currentImage={formData.featuredImage} />
              {formData.featuredImage && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Current image:</p>
                  <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    <Image
                      src={formData.featuredImage}
                      alt="Featured preview"
                      fill
                      className="object-cover"
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <TiptapEditor 
                value={formData.content} 
                onChange={handleContentChange} 
                placeholder="Write your post content here..."
              />
            </div>
            
            {/* Hidden input for authorId */}
            <input 
              type="hidden" 
              name="authorId" 
              value={formData.authorId} 
            />
            
            <div className="flex justify-end gap-2">
              <Link href="/dashboard">
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Post'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}