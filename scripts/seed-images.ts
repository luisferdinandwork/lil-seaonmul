/* eslint-disable @typescript-eslint/no-explicit-any */
// scripts/seed-images.ts
import { config } from 'dotenv';

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
    const { posts } = await import('../db/schema');
    const { sql } = await import('drizzle-orm');
    const cloudinary = await import('../lib/cloudinary').then(m => m.default);

    // Clear existing posts
    await db.execute(sql`TRUNCATE TABLE posts RESTART IDENTITY CASCADE;`);
    console.log('Cleared existing posts');

    // Upload images to Cloudinary and get URLs
    const imageUrls = await uploadImagesToCloudinary(cloudinary);
    
    // Insert sample posts with Cloudinary images
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
        featuredImage: imageUrls[0],
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
        featuredImage: imageUrls[1],
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
        featuredImage: imageUrls[2],
      },
    ];

    await db.insert(posts).values(samplePosts);
    console.log(`✅ Successfully seeded ${samplePosts.length} posts with images`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Function to upload placeholder images to Cloudinary
async function uploadImagesToCloudinary(cloudinary: any): Promise<string[]> {
  console.log('Uploading images to Cloudinary...');
  
  // Placeholder image URLs (you can replace these with your own images)
  const placeholderImages = [
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop'
  ];

  const uploadPromises = placeholderImages.map(async (url, index) => {
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

      console.log(`Uploaded image ${index + 1}: ${(result as any).secure_url}`);
      return (result as any).secure_url;
    } catch (error) {
      console.error(`Error uploading image ${index + 1}:`, error);
      // Return a fallback URL if upload fails
      return `https://via.placeholder.com/800x450?text=Blog+Post+${index + 1}`;
    }
  });

  return Promise.all(uploadPromises);
}

seed();