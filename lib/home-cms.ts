// lib/home-cms.ts
// Utility functions for reading and writing home-page CMS data.
// All writes are admin-only — enforce that in your API routes.

import { db } from '@/db';
import {
  heroSlides, galleryItems, shopCategories,
  type NewHeroSlide, type NewGalleryItem, type NewShopCategory,
  type HeroSlide, type GalleryItem, type ShopCategory,
} from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { nanoid } from 'nanoid';

// ─── Hero slides ──────────────────────────────────────────────────────────────

export async function getHeroSlides(): Promise<HeroSlide[]> {
  return db
    .select()
    .from(heroSlides)
    .where(eq(heroSlides.active, true))
    .orderBy(asc(heroSlides.sortOrder));
}

export async function getAllHeroSlides(): Promise<HeroSlide[]> {
  return db.select().from(heroSlides).orderBy(asc(heroSlides.sortOrder));
}

export async function createHeroSlide(
  data: Omit<NewHeroSlide, 'id' | 'createdAt' | 'updatedAt'>
): Promise<HeroSlide> {
  const [row] = await db
    .insert(heroSlides)
    .values({ id: nanoid(), ...data })
    .returning();
  return row;
}

export async function updateHeroSlide(
  id: string,
  data: Partial<Omit<NewHeroSlide, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<HeroSlide> {
  const [row] = await db
    .update(heroSlides)
    .set(data)
    .where(eq(heroSlides.id, id))
    .returning();
  return row;
}

export async function deleteHeroSlide(id: string): Promise<void> {
  await db.delete(heroSlides).where(eq(heroSlides.id, id));
}

// ─── Gallery items ────────────────────────────────────────────────────────────

export async function getGalleryItems(): Promise<GalleryItem[]> {
  return db
    .select()
    .from(galleryItems)
    .where(eq(galleryItems.active, true))
    .orderBy(asc(galleryItems.sortOrder));
}

export async function getAllGalleryItems(): Promise<GalleryItem[]> {
  return db.select().from(galleryItems).orderBy(asc(galleryItems.sortOrder));
}

export async function createGalleryItem(
  data: Omit<NewGalleryItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<GalleryItem> {
  const [row] = await db
    .insert(galleryItems)
    .values({ id: nanoid(), ...data })
    .returning();
  return row;
}

export async function updateGalleryItem(
  id: string,
  data: Partial<Omit<NewGalleryItem, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<GalleryItem> {
  const [row] = await db
    .update(galleryItems)
    .set(data)
    .where(eq(galleryItems.id, id))
    .returning();
  return row;
}

export async function deleteGalleryItem(id: string): Promise<void> {
  await db.delete(galleryItems).where(eq(galleryItems.id, id));
}

// ─── Shop categories ──────────────────────────────────────────────────────────

export async function getShopCategories(): Promise<ShopCategory[]> {
  return db
    .select()
    .from(shopCategories)
    .where(eq(shopCategories.active, true))
    .orderBy(asc(shopCategories.sortOrder));
}

export async function getAllShopCategories(): Promise<ShopCategory[]> {
  return db.select().from(shopCategories).orderBy(asc(shopCategories.sortOrder));
}

export async function createShopCategory(
  data: Omit<NewShopCategory, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ShopCategory> {
  const [row] = await db
    .insert(shopCategories)
    .values({ id: nanoid(), ...data })
    .returning();
  return row;
}

export async function updateShopCategory(
  id: string,
  data: Partial<Omit<NewShopCategory, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ShopCategory> {
  const [row] = await db
    .update(shopCategories)
    .set(data)
    .where(eq(shopCategories.id, id))
    .returning();
  return row;
}

export async function deleteShopCategory(id: string): Promise<void> {
  await db.delete(shopCategories).where(eq(shopCategories.id, id));
}