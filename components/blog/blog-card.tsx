// components/blog/blog-card.tsx
"use client"

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";

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

interface BlogCardProps {
  post: Post;
  className?: string;
}

export default function BlogCard({ post, className }: BlogCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <Card className={cn(
        "h-full overflow-hidden transition-all duration-300 flex flex-col",
        "hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1",
        "border-border/50 hover:border-primary/30",
        "bg-card backdrop-blur-sm",
        "group-focus:ring-2 group-focus:ring-primary group-focus:ring-offset-2",
        className
      )}>
        {/* Featured Image */}
        <CardHeader className="p-0 relative">
          <div className="aspect-video w-full relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/20">
            {post.featuredImage && !imageError ? (
              <>
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className={cn(
                    "object-cover transition-all duration-500",
                    "group-hover:scale-110 group-hover:rotate-1"
                  )}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={handleImageError}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl">📝</span>
                  </div>
                  <span className="text-sm text-muted-foreground font-medium">
                    {post.title.split(' ').slice(0, 2).join(' ')}
                  </span>
                </div>
              </div>
            )}
            
            {/* Floating Badge */}
            {post.tags && post.tags.length > 0 && (
              <div className="absolute top-3 right-3 z-10">
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "backdrop-blur-md bg-background/80 border-primary/20",
                    "shadow-lg text-xs font-medium",
                    "group-hover:bg-primary group-hover:text-primary-foreground",
                    "transition-all duration-300"
                  )}
                >
                  {post.tags[0]}
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 space-y-4">
          {/* Tags Row */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag, index) => (
                <Badge 
                  key={`${tag}-${index}`}
                  variant="outline" 
                  className={cn(
                    "text-xs font-medium border-primary/20 text-primary",
                    "group-hover:bg-primary/10 transition-colors duration-300"
                  )}
                >
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge 
                  variant="outline" 
                  className="text-xs font-medium border-muted-foreground/20 text-muted-foreground"
                >
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
          
          {/* Meta Information */}
          <div className="flex items-center text-xs text-muted-foreground gap-3 sm:gap-4">
            <div className="flex items-center gap-1.5 group/date">
              <Calendar className="h-3.5 w-3.5 group-hover/date:text-primary transition-colors" />
              <span className="group-hover/date:text-foreground transition-colors">
                {new Date(post.createdAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            {post.readTime && (
              <div className="flex items-center gap-1.5 group/time">
                <Clock className="h-3.5 w-3.5 group-hover/time:text-primary transition-colors" />
                <span className="group-hover/time:text-foreground transition-colors">
                  {post.readTime}
                </span>
              </div>
            )}
          </div>
          
          {/* Title */}
          <h3 className={cn(
            "text-lg sm:text-xl font-bold leading-snug line-clamp-2",
            "group-hover:text-primary transition-colors duration-300"
          )}>
            {post.title}
          </h3>
          
          {/* Excerpt */}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {post.excerpt || post.content.substring(0, 150).replace(/<[^>]*>/g, '') + "..."}
          </p>
        </CardContent>

        <CardFooter className={cn(
          "px-5 sm:px-6 pb-5 sm:pb-6 pt-0 mt-auto",
          "flex items-center gap-2.5"
        )}>
          {/* Author Info */}
          <div className="relative flex-shrink-0">
            {post.author.avatar ? (
              <Image 
                src={post.author.avatar} 
                alt={post.author.name} 
                width={32} 
                height={32} 
                className={cn(
                  "rounded-full ring-2 ring-background",
                  "group-hover:ring-primary/20 transition-all duration-300"
                )}
              />
            ) : (
              <div className={cn(
                "w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/30",
                "flex items-center justify-center ring-2 ring-background",
                "group-hover:ring-primary/20 transition-all duration-300"
              )}>
                <User className="h-4 w-4 text-primary" />
              </div>
            )}
            {post.author.role === 'admin' && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-background" />
            )}
          </div>
          
          <div className="min-w-0 flex-1">
            <p className={cn(
              "text-sm font-medium truncate",
              "group-hover:text-primary transition-colors duration-300"
            )}>
              {post.author.name}
            </p>
            {post.author.role === 'admin' && (
              <Badge 
                variant="secondary" 
                className="text-[10px] h-4 px-1.5 mt-0.5 bg-primary/10 text-primary border-0"
              >
                Admin
              </Badge>
            )}
          </div>
        </CardFooter>

        {/* Decorative Corner Element */}
        <div className={cn(
          "absolute top-0 left-0 w-20 h-20",
          "bg-gradient-to-br from-primary/5 to-transparent",
          "rounded-br-full opacity-0 group-hover:opacity-100",
          "transition-opacity duration-500",
          "pointer-events-none"
        )} />
      </Card>
    </Link>
  );
}