// db/schema.ts
import { pgTable, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

// ─── Existing tables ──────────────────────────────────────────────────────────

export const authors = pgTable('authors', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  bio: text('bio'),
  avatar: text('avatar'),
  role: text('role').notNull().default('author'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

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

export const postLikes = pgTable('post_likes', {
  id: text('id').primaryKey(),
  postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  visitorId: text('visitor_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const postComments = pgTable('post_comments', {
  id: text('id').primaryKey(),
  postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  authorName: text('author_name').notNull().default('Anonymous'),
  authorEmail: text('author_email'),
  content: text('content').notNull(),
  approved: boolean('approved').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ─── Home CMS tables ──────────────────────────────────────────────────────────

/**
 * hero_slides
 * Strip thumbnail produk di bagian bawah hero.
 * Setiap baris = satu kartu (label + gambar Cloudinary + tautan Shopee).
 */
export const heroSlides = pgTable('hero_slides', {
  id: text('id').primaryKey(),
  label: text('label').notNull(),
  image: text('image').notNull(),
  shopeeUrl: text('shopee_url').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

/**
 * gallery_items
 * Grid bento galeri ("Intip dunia kami").
 * sortOrder = 0 → sel unggulan besar.
 */
export const galleryItems = pgTable('gallery_items', {
  id: text('id').primaryKey(),
  image: text('image').notNull(),
  alt: text('alt').notNull(),
  label: text('label').notNull(),
  shopeeUrl: text('shopee_url'),
  sortOrder: integer('sort_order').notNull().default(0),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

/**
 * shop_categories
 * Kartu kategori di ShopShowcase ("Temukan Hadiah Sempurna").
 * badgeVariant: 'trending' | 'bestseller' | 'new' | 'popular'
 */
export const shopCategories = pgTable('shop_categories', {
  id: text('id').primaryKey(),
  label: text('label').notNull(),
  sub: text('sub').notNull(),
  badge: text('badge').notNull(),
  badgeVariant: text('badge_variant').notNull().default('trending'),
  image: text('image').notNull(),
  shopeeUrl: text('shopee_url').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type Author      = typeof authors.$inferSelect;
export type NewAuthor   = typeof authors.$inferInsert;
export type Post        = typeof posts.$inferSelect;
export type NewPost     = typeof posts.$inferInsert;
export type PostLike    = typeof postLikes.$inferSelect;
export type NewPostLike = typeof postLikes.$inferInsert;
export type PostComment    = typeof postComments.$inferSelect;
export type NewPostComment = typeof postComments.$inferInsert;

export type HeroSlide      = typeof heroSlides.$inferSelect;
export type NewHeroSlide   = typeof heroSlides.$inferInsert;
export type GalleryItem    = typeof galleryItems.$inferSelect;
export type NewGalleryItem = typeof galleryItems.$inferInsert;
export type ShopCategory    = typeof shopCategories.$inferSelect;
export type NewShopCategory = typeof shopCategories.$inferInsert;