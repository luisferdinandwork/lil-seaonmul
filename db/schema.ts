// db/schema.ts
import { pgTable, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

// Authors table with auth fields
export const authors = pgTable('authors', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  bio: text('bio'),
  avatar: text('avatar'),
  role: text('role').notNull().default('author'), // 'author' or 'admin'
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

// Posts table with view count and published status
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
  published: boolean('published').notNull().default(false),
  viewCount: integer('view_count').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

// Post likes — tracked by IP or session to prevent duplicates
export const postLikes = pgTable('post_likes', {
  id: text('id').primaryKey(),
  postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  visitorId: text('visitor_id').notNull(), // fingerprint/IP hash
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Post comments — anonymous with optional name
export const postComments = pgTable('post_comments', {
  id: text('id').primaryKey(),
  postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  authorName: text('author_name').notNull().default('Anonymous'),
  authorEmail: text('author_email'), // optional
  content: text('content').notNull(),
  approved: boolean('approved').notNull().default(false), // admin must approve
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Types
export type Author = typeof authors.$inferSelect;
export type NewAuthor = typeof authors.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type PostLike = typeof postLikes.$inferSelect;
export type NewPostLike = typeof postLikes.$inferInsert;
export type PostComment = typeof postComments.$inferSelect;
export type NewPostComment = typeof postComments.$inferInsert;