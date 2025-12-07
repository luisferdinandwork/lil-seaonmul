// app/dashboard/authors/new/page.tsx
"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { 
  User, 
  Mail, 
  Lock, 
  FileText, 
  Image as ImageIcon, 
  Shield,
  ArrowLeft,
  Sparkles,
  Eye,
  EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function NewAuthorPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    avatar: '',
    role: 'author'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Update avatar preview
    if (name === 'avatar') {
      setAvatarPreview(value);
    }
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/authors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create author');
      }
      
      toast.success('Author created successfully! 🎉');
      router.push('/dashboard/authors');
    } catch (error) {
      console.error('Error creating author:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create author');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isFormValid = formData.name && formData.email && formData.password;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/dashboard/authors')}
          className="hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
              Create New Author
            </h1>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              <Sparkles className="h-3 w-3 mr-1" />
              New
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Add a new author to collaborate on your blog content
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                Basic Information
              </CardTitle>
              <CardDescription>
                Essential details for the author account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Full Name
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                    className={cn(
                      "transition-all duration-300",
                      "focus:border-primary/50 focus:ring-primary/20"
                    )}
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Email Address
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    required
                    className={cn(
                      "transition-all duration-300",
                      "focus:border-primary/50 focus:ring-primary/20"
                    )}
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    Password
                    <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a secure password"
                      required
                      className={cn(
                        "pr-10 transition-all duration-300",
                        "focus:border-primary/50 focus:ring-primary/20"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters long
                  </p>
                </div>

                {/* Role Field */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Role
                  </Label>
                  <Select value={formData.role} onValueChange={handleRoleChange}>
                    <SelectTrigger className="focus:ring-primary/20">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="author">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>Author</span>
                          <span className="text-xs text-muted-foreground">
                            - Can create and edit posts
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          <span>Admin</span>
                          <span className="text-xs text-muted-foreground">
                            - Full access
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Additional Information Card */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                Additional Details
              </CardTitle>
              <CardDescription>
                Optional information to enhance the author profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Bio Field */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Biography
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about this author..."
                  rows={4}
                  className={cn(
                    "resize-none transition-all duration-300",
                    "focus:border-primary/50 focus:ring-primary/20"
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.bio.length}/500 characters
                </p>
              </div>

              {/* Avatar URL Field */}
              <div className="space-y-2">
                <Label htmlFor="avatar" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-primary" />
                  Avatar URL
                </Label>
                <Input
                  id="avatar"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleInputChange}
                  placeholder="https://example.com/avatar.jpg"
                  className={cn(
                    "transition-all duration-300",
                    "focus:border-primary/50 focus:ring-primary/20"
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  Provide a URL to an image for the author&apos;s avatar
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Card - Right Side */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Preview Card */}
            <Card className={cn(
              "border-border/50 shadow-sm",
              "bg-gradient-to-br from-card to-card/50 backdrop-blur-sm"
            )}>
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Preview
                </CardTitle>
                <CardDescription className="text-xs">
                  How the author will appear
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Preview */}
                <div className="flex flex-col items-center text-center space-y-3">
                  <Avatar className="h-24 w-24 ring-4 ring-background shadow-lg">
                    <AvatarImage src={avatarPreview} alt={formData.name || "Author"} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/30 text-primary text-xl font-semibold">
                      {formData.name ? getUserInitials(formData.name) : <User className="h-8 w-8" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">
                      {formData.name || "Author Name"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {formData.email || "email@example.com"}
                    </p>
                    <Badge 
                      variant={formData.role === 'admin' ? 'default' : 'secondary'}
                      className={cn(
                        "text-xs",
                        formData.role === 'admin' && "bg-primary text-primary-foreground"
                      )}
                    >
                      {formData.role === 'admin' ? (
                        <><Shield className="h-3 w-3 mr-1" /> Admin</>
                      ) : (
                        <><User className="h-3 w-3 mr-1" /> Author</>
                      )}
                    </Badge>
                  </div>
                </div>

                {/* Bio Preview */}
                {formData.bio && (
                  <div className={cn(
                    "p-4 rounded-lg",
                    "bg-muted/50 border border-border/50"
                  )}>
                    <p className="text-sm text-muted-foreground italic line-clamp-4">
                      &quot;{formData.bio}&quot;
                    </p>
                  </div>
                )}

                {/* Info List */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-muted/30">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/20">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-muted/30">
                    <span className="text-muted-foreground">Posts</span>
                    <span className="font-medium">0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting || !isFormValid}
                className={cn(
                  "w-full gap-2 shadow-sm",
                  "hover:shadow-md hover:scale-[1.02]",
                  "transition-all duration-300"
                )}
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Create Author
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.push('/dashboard/authors')}
                className="w-full hover:bg-accent transition-all duration-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}