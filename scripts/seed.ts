// scripts/seed.ts
import { config } from 'dotenv';

// Load environment variables from .env file
config({ path: '.env' });

// Now import database connection after loading env vars
import { db } from '../db/index';
import { posts } from '../db/schema';
import { sql } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Seeding database...');

  // Verify DATABASE_URL is loaded
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  try {
    // Clear existing posts using Drizzle's SQL helper
    await db.execute(sql`TRUNCATE TABLE posts RESTART IDENTITY CASCADE;`);
    console.log('Cleared existing posts');

    // Insert sample posts
    const samplePosts = [
      {
        id: '1',
        title: 'Getting Started with Drizzle ORM',
        slug: 'getting-started-drizzle',
        content: 'Drizzle ORM is a TypeScript-first ORM for SQL databases...',
        excerpt: 'Learn the basics of Drizzle ORM and how to set it up with Neon',
        featuredImage: 'https://example.com/images/drizzle.jpg',
      },
      {
        id: '2',
        title: 'Building a Next.js Blog',
        slug: 'nextjs-blog-tutorial',
        content: 'In this tutorial, we\'ll build a full-featured blog using Next.js...',
        excerpt: 'Step-by-step guide to creating a blog with Next.js and TypeScript',
        featuredImage: 'https://example.com/images/nextjs.jpg',
      },
      {
        id: '3',
        title: 'TypeScript Best Practices',
        slug: 'typescript-best-practices',
        content: 'TypeScript brings static typing to JavaScript...',
        excerpt: 'Essential tips and patterns for writing better TypeScript code',
        featuredImage: 'https://example.com/images/typescript.jpg',
      },
    ];

    await db.insert(posts).values(samplePosts);
    console.log(`✅ Successfully seeded ${samplePosts.length} posts`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }

  process.exit(0);
}

seed();