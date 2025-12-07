// db/schema.ts
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

// Authors table with auth fields
export const authors = pgTable('authors', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(), // Added for authentication
  bio: text('bio'),
  avatar: text('avatar'),
  role: text('role').notNull().default('author'), // 'author' or 'admin'
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

// Posts table remains the same
export const posts = pgTable('posts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  featuredImage: text('featured_image'),
  tags: text('tags').array().default([]),
  authorId: text('author_id').notNull().references(() => authors.id),
  readTime: text('read_time').default('5 min read'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

// Types
export type Author = typeof authors.$inferSelect;
export type NewAuthor = typeof authors.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;