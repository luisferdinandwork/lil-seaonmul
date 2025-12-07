/* eslint-disable @typescript-eslint/no-explicit-any */
// scripts/seed-images.ts
import { config } from 'dotenv';
import bcrypt from 'bcryptjs';

// Load environment variables from .env file FIRST
config({ path: '.env.local' });

// Verify environment variables before importing anything else
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

if (!process.env.CLOUDINARY_CLOUD_NAME) {
  console.error('❌ CLOUDINARY_CLOUD_NAME environment variable is not set');
  process.exit(1);
}

// Now dynamically import modules after environment variables are loaded
async function seed() {
  console.log('🌱 Seeding database with images...');
  console.log(`Using database: ${process.env.DATABASE_URL.substring(0, 20)}...`);

  try {
    // Dynamically import modules after environment variables are loaded
    const { db } = await import('../db/index');
    const { posts, authors } = await import('../db/schema');
    const { sql } = await import('drizzle-orm');
    const cloudinary = await import('../lib/cloudinary').then(m => m.default);

    // Clear existing tables - need to truncate in the right order due to foreign key
    await db.execute(sql`TRUNCATE TABLE posts RESTART IDENTITY CASCADE;`);
    await db.execute(sql`TRUNCATE TABLE authors RESTART IDENTITY CASCADE;`);
    console.log('Cleared existing tables');

    // Upload images to Cloudinary and get URLs
    const postImageUrls = await uploadPostImagesToCloudinary(cloudinary);
    const avatarImageUrls = await uploadAvatarImagesToCloudinary(cloudinary);
    
    // Hash passwords for sample authors
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Insert sample authors first
    const sampleAuthors = [
      {
        id: '1',
        name: 'Alex Johnson',
        email: 'alex@example.com',
        password: hashedPassword,
        bio: 'Full-stack developer with expertise in TypeScript and databases.',
        avatar: avatarImageUrls[0], // Using uploaded avatar
        role: 'admin', // Admin role
      },
      {
        id: '2',
        name: 'Sam Wilson',
        email: 'sam@example.com',
        password: hashedPassword,
        bio: 'Frontend developer passionate about React and Next.js.',
        avatar: avatarImageUrls[1], // Using uploaded avatar
        role: 'author',
      },
      {
        id: '3',
        name: 'Taylor Reed',
        email: 'taylor@example.com',
        password: hashedPassword,
        bio: 'TypeScript enthusiast and open source contributor.',
        avatar: avatarImageUrls[2], // Using uploaded avatar
        role: 'author',
      },
    ];

    await db.insert(authors).values(sampleAuthors);
    console.log(`✅ Successfully seeded ${sampleAuthors.length} authors`);
    
    // Insert sample posts with Cloudinary images and author references
    const samplePosts = [
      {
        id: '1',
        title: 'Getting Started with Drizzle ORM',
        slug: 'getting-started-drizzle',
        content: `# Getting Started with Drizzle ORM

Drizzle ORM is a TypeScript-first ORM for SQL databases that provides a type-safe way to interact with your database.

## Installation

\`\`\`bash
npm install drizzle-orm drizzle-kit
\`\`\`

## Features

- Type-safe database queries
- Automatic schema migrations
- Support for multiple SQL databases
- Lightweight and performant

## Conclusion

Drizzle ORM is a great choice for TypeScript projects that need a type-safe database layer.`,
        excerpt: 'Learn the basics of Drizzle ORM and how to set it up with Neon',
        featuredImage: postImageUrls[0],
        tags: ['tutorial', 'database', 'typescript'],
        authorId: '1', // References Alex Johnson (admin)
        readTime: '8 min read',
      },
      {
        id: '2',
        title: 'Building a Next.js Blog',
        slug: 'nextjs-blog-tutorial',
        content: `# Building a Next.js Blog

In this tutorial, we'll build a full-featured blog using Next.js and TypeScript.

## Setup

\`\`\`bash
npx create-next-app@latest my-blog --typescript
cd my-blog
\`\`\`

## Features

- Server-side rendering
- Static site generation
- API routes
- Image optimization

## Deployment

Next.js makes deployment easy with Vercel, Netlify, or any other platform that supports Node.js.`,
        excerpt: 'Step-by-step guide to creating a blog with Next.js and TypeScript',
        featuredImage: postImageUrls[1],
        tags: ['nextjs', 'react', 'web development'],
        authorId: '2', // References Sam Wilson
        readTime: '12 min read',
      },
      {
        id: '3',
        title: 'TypeScript Best Practices',
        slug: 'typescript-best-practices',
        content: `# TypeScript Best Practices

TypeScript brings static typing to JavaScript, helping developers catch errors early and write more maintainable code.

## Type Definitions

Always define explicit types for your functions and variables:

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // Implementation
}
\`\`\`

## Strict Mode

Enable strict mode in your tsconfig.json:

\`\`\`json
{
  "compilerOptions": {
    "strict": true
  }
}
\`\`\`

## Conclusion

Following these best practices will help you write more robust TypeScript code.`,
        excerpt: 'Essential tips and patterns for writing better TypeScript code',
        featuredImage: postImageUrls[2],
        tags: ['typescript', 'programming', 'best practices'],
        authorId: '3',
        readTime: '10 min read',
      },
    ];

    await db.insert(posts).values(samplePosts);
    console.log(`✅ Successfully seeded ${samplePosts.length} posts with images`);
    
    console.log('🔑 Sample login credentials:');
    console.log('Email: alex@example.com, Password: password123 (Admin)');
    console.log('Email: sam@example.com, Password: password123 (Author)');
    console.log('Email: taylor@example.com, Password: password123 (Author)');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Function to upload post images to Cloudinary
async function uploadPostImagesToCloudinary(cloudinary: any): Promise<string[]> {
  console.log('Uploading post images to Cloudinary...');
  
  // Post image URLs from Unsplash
  const postImages = [
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop'
  ];

  const uploadPromises = postImages.map(async (url, index) => {
    try {
      // Fetch the image
      const response = await fetch(url);
      const buffer = Buffer.from(await response.arrayBuffer());
      
      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { 
            folder: 'blog-posts',
            public_id: `blog-post-${index + 1}`,
            resource_type: 'image'
          },
          (error: any, result: any) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      console.log(`Uploaded post image ${index + 1}: ${(result as any).secure_url}`);
      return (result as any).secure_url;
    } catch (error) {
      console.error(`Error uploading post image ${index + 1}:`, error);
      // Return a fallback URL if upload fails
      return `https://via.placeholder.com/800x450?text=Blog+Post+${index + 1}`;
    }
  });

  return Promise.all(uploadPromises);
}

// Function to upload avatar images to Cloudinary
async function uploadAvatarImagesToCloudinary(cloudinary: any): Promise<string[]> {
  console.log('Uploading avatar images to Cloudinary...');
  
  // Avatar image URLs from Unsplash
  const avatarImages = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face'
  ];

  const uploadPromises = avatarImages.map(async (url, index) => {
    try {
      // Fetch the image
      const response = await fetch(url);
      const buffer = Buffer.from(await response.arrayBuffer());
      
      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { 
            folder: 'avatars',
            public_id: `author-${index + 1}`,
            resource_type: 'image',
            transformation: [
              { width: 200, height: 200, gravity: "face", crop: "fill" }
            ]
          },
          (error: any, result: any) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      console.log(`Uploaded avatar image ${index + 1}: ${(result as any).secure_url}`);
      return (result as any).secure_url;
    } catch (error) {
      console.error(`Error uploading avatar image ${index + 1}:`, error);
      // Return a fallback URL if upload fails
      return `https://ui-avatars.com/api/?name=${['Alex', 'Sam', 'Taylor'][index]}&background=random`;
    }
  });

  return Promise.all(uploadPromises);
}

seed();