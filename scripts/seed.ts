import { config } from 'dotenv';

// Load environment variables from .env file
config({ path: '.env' });

// Now import database connection after loading env vars
import { db } from '../db/index';
import { posts, authors } from '../db/schema';
import { sql } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Seeding database...');

  // Verify DATABASE_URL is loaded
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  try {
    // Drop existing tables
    await db.execute(sql`DROP TABLE IF EXISTS posts;`);
    await db.execute(sql`DROP TABLE IF EXISTS authors;`);
    console.log('Dropped existing tables');
    
    // Create the authors table
    await db.execute(sql`
      CREATE TABLE authors (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        bio TEXT,
        avatar TEXT,
        role TEXT NOT NULL DEFAULT 'author',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log('Created authors table');
    
    // Create the posts table with author reference
    await db.execute(sql`
      CREATE TABLE posts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL,
        excerpt TEXT,
        featured_image TEXT,
        tags TEXT[],
        author_id TEXT NOT NULL REFERENCES authors(id),
        read_time TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log('Created posts table with new schema');

    // Insert sample authors
    const sampleAuthors = [
      {
        id: '1',
        name: 'Alex Johnson',
        email: 'alex@example.com',
        bio: 'Full-stack developer with expertise in TypeScript and databases.',
        avatar: 'https://example.com/avatars/alex.jpg',
        role: 'admin', // Admin role
      },
      {
        id: '2',
        name: 'Sam Wilson',
        email: 'sam@example.com',
        bio: 'Frontend developer passionate about React and Next.js.',
        avatar: 'https://example.com/avatars/sam.jpg',
        role: 'author',
      },
      {
        id: '3',
        name: 'Taylor Reed',
        email: 'taylor@example.com',
        bio: 'TypeScript enthusiast and open source contributor.',
        avatar: 'https://example.com/avatars/taylor.jpg',
        role: 'author',
      },
    ];

    await db.insert(authors).values(sampleAuthors);
    console.log(`✅ Successfully seeded ${sampleAuthors.length} authors`);

    // Insert sample posts with author references
    const samplePosts = [
      {
        id: '1',
        title: 'Getting Started with Drizzle ORM',
        slug: 'getting-started-drizzle',
        content: 'Drizzle ORM is a TypeScript-first ORM for SQL databases...',
        excerpt: 'Learn the basics of Drizzle ORM and how to set it up with Neon',
        featuredImage: 'https://example.com/images/drizzle.jpg',
        tags: ['tutorial', 'database', 'typescript'],
        authorId: '1', // References Alex Johnson (admin)
        readTime: '8 min read',
      },
      {
        id: '2',
        title: 'Building a Next.js Blog',
        slug: 'nextjs-blog-tutorial',
        content: 'In this tutorial, we\'ll build a full-featured blog using Next.js...',
        excerpt: 'Step-by-step guide to creating a blog with Next.js and TypeScript',
        featuredImage: 'https://example.com/images/nextjs.jpg',
        tags: ['nextjs', 'react', 'web development'],
        authorId: '2', // References Sam Wilson
        readTime: '12 min read',
      },
      {
        id: '3',
        title: 'TypeScript Best Practices',
        slug: 'typescript-best-practices',
        content: 'TypeScript brings static typing to JavaScript...',
        excerpt: 'Essential tips and patterns for writing better TypeScript code',
        featuredImage: 'https://example.com/images/typescript.jpg',
        tags: ['typescript', 'programming', 'best practices'],
        authorId: '3', // References Taylor Reed
        readTime: '10 min read',
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