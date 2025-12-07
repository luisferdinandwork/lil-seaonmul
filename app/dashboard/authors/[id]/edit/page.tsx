// app/dashboard/authors/[id]/edit/page.tsx
"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface Author {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditAuthorPage() {
  const params = useParams();
  const router = useRouter();
  const [author, setAuthor] = useState<Author | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    avatar: '',
    role: 'author'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/authors/${params.id}`);
        if (!res.ok) throw new Error('Failed to fetch author');
        const data = await res.json();
        setAuthor(data);
        setFormData({
          name: data.name,
          email: data.email,
          password: '',
          bio: data.bio || '',
          avatar: data.avatar || '',
          role: data.role,
        });
      } catch (error) {
        console.error('Error fetching author:', error);
        toast.error('Failed to fetch author');
        router.push('/dashboard/authors');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchAuthor();
    }
  }, [params.id, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author) return;
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/authors/${author.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password || undefined, // Only send password if provided
          bio: formData.bio,
          avatar: formData.avatar,
          role: formData.role,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update author');
      }
      
      toast.success('Author updated successfully');
      router.push('/dashboard/authors');
    } catch (error) {
      console.error('Error updating author:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update author');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p>Loading author...</p>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p>Author not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Edit Author</h1>
        <p className="text-muted-foreground">
          Update author information.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Author Information</CardTitle>
          <CardDescription>
            Update the details for this author account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Author name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Author email"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password (leave blank to keep current)</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="New password"
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="author">Author</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Author bio"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                name="avatar"
                value={formData.avatar}
                onChange={handleInputChange}
                placeholder="Avatar URL"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.push('/dashboard/authors')}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting || !formData.name || !formData.email}
              >
                {isSubmitting ? 'Updating...' : 'Update Author'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}