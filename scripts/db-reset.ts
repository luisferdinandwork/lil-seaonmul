// scripts/db-reset.ts
import { config } from 'dotenv';

config({ path: '.env' });

import { db } from '../db/index';
import { sql } from 'drizzle-orm';

async function reset() {
  console.log('');
  console.log('⚠️  DATABASE RESET');
  console.log('   This will DROP and RECREATE all tables.');
  console.log('   All existing data will be permanently deleted.');
  console.log('');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set');
    process.exit(1);
  }

  try {
    // ── 1. Drop all tables in dependency order ──────────────────────────────
    // Child tables (with foreign keys) must be dropped before parent tables.
    console.log('🗑️  Dropping existing tables...');

    await db.execute(sql`DROP TABLE IF EXISTS post_comments CASCADE;`);
    console.log('   ✓ post_comments');

    await db.execute(sql`DROP TABLE IF EXISTS post_likes CASCADE;`);
    console.log('   ✓ post_likes');

    await db.execute(sql`DROP TABLE IF EXISTS posts CASCADE;`);
    console.log('   ✓ posts');

    await db.execute(sql`DROP TABLE IF EXISTS authors CASCADE;`);
    console.log('   ✓ authors');

    // ── 2. Recreate authors ─────────────────────────────────────────────────
    console.log('');
    console.log('🏗️  Recreating tables...');

    await db.execute(sql`
      CREATE TABLE authors (
        id          TEXT        PRIMARY KEY,
        name        TEXT        NOT NULL,
        email       TEXT        NOT NULL UNIQUE,
        password    TEXT        NOT NULL,
        bio         TEXT,
        avatar      TEXT,
        role        TEXT        NOT NULL DEFAULT 'author',
        created_at  TIMESTAMP   NOT NULL DEFAULT NOW(),
        updated_at  TIMESTAMP   NOT NULL DEFAULT NOW()
      );
    `);
    console.log('   ✓ authors');

    // ── 3. Recreate posts ───────────────────────────────────────────────────
    await db.execute(sql`
      CREATE TABLE posts (
        id             TEXT        PRIMARY KEY,
        title          TEXT        NOT NULL,
        slug           TEXT        NOT NULL UNIQUE,
        content        TEXT        NOT NULL,
        excerpt        TEXT,
        featured_image TEXT,
        tags           TEXT[]      DEFAULT '{}',
        author_id      TEXT        NOT NULL REFERENCES authors(id),
        read_time      TEXT        DEFAULT '5 min read',
        published      BOOLEAN     NOT NULL DEFAULT false,
        view_count     INTEGER     NOT NULL DEFAULT 0,
        created_at     TIMESTAMP   NOT NULL DEFAULT NOW(),
        updated_at     TIMESTAMP   NOT NULL DEFAULT NOW()
      );
    `);
    console.log('   ✓ posts');

    // ── 4. Recreate post_likes ──────────────────────────────────────────────
    await db.execute(sql`
      CREATE TABLE post_likes (
        id          TEXT        PRIMARY KEY,
        post_id     TEXT        NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        visitor_id  TEXT        NOT NULL,
        created_at  TIMESTAMP   NOT NULL DEFAULT NOW()
      );
    `);
    console.log('   ✓ post_likes');

    // ── 5. Recreate post_comments ───────────────────────────────────────────
    await db.execute(sql`
      CREATE TABLE post_comments (
        id            TEXT        PRIMARY KEY,
        post_id       TEXT        NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        author_name   TEXT        NOT NULL DEFAULT 'Anonymous',
        author_email  TEXT,
        content       TEXT        NOT NULL,
        approved      BOOLEAN     NOT NULL DEFAULT false,
        created_at    TIMESTAMP   NOT NULL DEFAULT NOW()
      );
    `);
    console.log('   ✓ post_comments');

    console.log('');
    console.log('✅ Database reset complete. All tables are clean and ready.');
    console.log('');
    console.log('   Next steps:');
    console.log('   1. npm run db:seed-admin   → create Lily\'s admin account');
    console.log('   2. npm run db:seed-posts   → seed the 3 sample blog posts');
    console.log('');
  } catch (error) {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

reset();