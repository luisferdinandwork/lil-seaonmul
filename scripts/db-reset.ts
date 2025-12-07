// /scripts/db-reset.ts
import { db } from '../db'; 
import { sql } from 'drizzle-orm';
import { posts } from '@/db/schema'

async function resetDatabase() {
  try {
    console.log('Starting database reset...');
    
    // Drop the table if it exists
    await db.execute(sql`DROP TABLE IF EXISTS posts CASCADE;`);
    console.log('Dropped existing posts table');
    
    // Recreate the table
    await db.execute(sql`
      CREATE TABLE posts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL,
        excerpt TEXT,
        featured_image TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log('Created new posts table');
    
    console.log('Database reset completed successfully!');
  } catch (error) {
    console.error('Database reset failed:', error);
    process.exit(1);
  }
}

resetDatabase();