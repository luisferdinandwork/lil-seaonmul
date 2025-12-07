// app/dashboard/authors/page.tsx
"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

export default function AuthorsPage() {
  const router = useRouter();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [authorToDelete, setAuthorToDelete] = useState<string | null>(null);
  const [authorToEdit, setAuthorToEdit] = useState<Author | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    avatar: '',
    role: 'author'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/authors`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Failed to fetch authors');
      const data = await res.json();
      setAuthors(data);
    } catch (error) {
      console.error('Error fetching authors:', error);
      toast.error('Failed to fetch authors');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAuthor = async () => {
    if (!authorToEdit) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/authors/${authorToEdit.id}`, {
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
      setIsEditDialogOpen(false);
      resetForm();
      fetchAuthors();
    } catch (error) {
      console.error('Error updating author:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update author');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAuthor = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/authors/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete author');
      
      toast.success('Author deleted successfully');
      setIsDeleteDialogOpen(false);
      setAuthorToDelete(null);
      fetchAuthors();
    } catch (error) {
      console.error('Error deleting author:', error);
      toast.error('Failed to delete author');
    }
  };

  const openEditDialog = (author: Author) => {
    setAuthorToEdit(author);
    setFormData({
      name: author.name,
      email: author.email,
      password: '',
      bio: author.bio || '',
      avatar: author.avatar || '',
      role: author.role,
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      bio: '',
      avatar: '',
      role: 'author'
    });
    setAuthorToEdit(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Loading authors...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Authors</h1>
          <p className="text-muted-foreground max-w-2xl">
            Manage your blog authors.
          </p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => router.push('/dashboard/authors/new')}
        >
          <Plus className="h-4 w-4" />
          New Author
        </Button>
      </div>

      {authors.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No authors available yet. Add your first author!</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {authors.map((author) => (
                <TableRow key={author.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div>{author.name}</div>
                        {author.bio && (
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {author.bio}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{author.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={author.role === 'admin' ? 'default' : 'secondary'}>
                      {author.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openEditDialog(author)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setAuthorToDelete(author.id);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Author Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Author</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Author name"
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Author email"
              />
            </div>
            <div>
              <Label htmlFor="edit-password">Password (leave blank to keep current)</Label>
              <Input
                id="edit-password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="New password"
              />
            </div>
            <div>
              <Label htmlFor="edit-role">Role</Label>
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
              <Label htmlFor="edit-bio">Bio</Label>
              <Textarea
                id="edit-bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Author bio"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-avatar">Avatar URL</Label>
              <Input
                id="edit-avatar"
                name="avatar"
                value={formData.avatar}
                onChange={handleInputChange}
                placeholder="Avatar URL"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateAuthor}
              disabled={isSubmitting || !formData.name || !formData.email}
            >
              {isSubmitting ? 'Updating...' : 'Update Author'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this author? This action cannot be undone.</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => authorToDelete && handleDeleteAuthor(authorToDelete)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}