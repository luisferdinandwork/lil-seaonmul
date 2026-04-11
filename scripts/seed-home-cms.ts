// scripts/seed-home-cms.ts
// Jalankan dengan:  npm run seed:home
//
// FIX: Menggunakan relative imports (../db, ../lib/...) bukan @/ alias.
// tsx tidak bisa resolve alias @/ tanpa konfigurasi tambahan, tapi
// relative imports selalu bekerja.

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../db/schema';
import { nanoid } from 'nanoid';
import {
  heroSlides,
  galleryItems,
  shopCategories,
} from '../db/schema';

// ─── Inisialisasi DB langsung (tanpa @/db) ────────────────────────────────────
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL belum diatur di .env');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL!);
const db  = drizzle(sql, { schema });

// ─── Konstanta ────────────────────────────────────────────────────────────────

const SHOPEE_BASE = 'https://shopee.co.id/litty.kitty10';

// ─── Data Hero Slides ─────────────────────────────────────────────────────────

const heroSlidesData = [
  {
    label: 'Gantungan Kucing',
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=200&h=200&fit=crop',
    shopeeUrl: `${SHOPEE_BASE}/search?keyword=gantungan+kucing`,
    sortOrder: 0,
    active: true,
  },
  {
    label: 'Plush Bear Pink',
    image: 'https://images.unsplash.com/photo-1559715541-5daf8a0296d0?w=200&h=200&fit=crop',
    shopeeUrl: `${SHOPEE_BASE}/search?keyword=plush+bear`,
    sortOrder: 1,
    active: true,
  },
  {
    label: 'Set Hadiah',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238f539?w=200&h=200&fit=crop',
    shopeeUrl: `${SHOPEE_BASE}/search?keyword=set+hadiah`,
    sortOrder: 2,
    active: true,
  },
  {
    label: 'Aksesoris Kawaii',
    image: 'https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=200&h=200&fit=crop',
    shopeeUrl: `${SHOPEE_BASE}/search?keyword=aksesoris+kawaii`,
    sortOrder: 3,
    active: true,
  },
  {
    label: 'Tas Mini Pastel',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=200&h=200&fit=crop',
    shopeeUrl: `${SHOPEE_BASE}/search?keyword=tas+mini+pastel`,
    sortOrder: 4,
    active: true,
  },
  {
    label: 'Stiker Lucu',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200&h=200&fit=crop',
    shopeeUrl: `${SHOPEE_BASE}/search?keyword=stiker+lucu`,
    sortOrder: 5,
    active: true,
  },
];

// ─── Data Gallery Items ───────────────────────────────────────────────────────

const galleryItemsData = [
  {
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&fit=crop',
    alt: 'Koleksi hadiah pastel Lil.Seonmul',
    label: 'Koleksi Terbaru',
    shopeeUrl: SHOPEE_BASE,
    sortOrder: 0,
    active: true,
  },
  {
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&h=400&fit=crop',
    alt: 'Gantungan kunci kawaii',
    label: 'Gantungan Kunci',
    shopeeUrl: `${SHOPEE_BASE}/search?keyword=gantungan+kunci`,
    sortOrder: 1,
    active: true,
  },
  {
    image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&h=400&fit=crop',
    alt: 'Boneka plush lembut',
    label: 'Boneka Plush',
    shopeeUrl: `${SHOPEE_BASE}/search?keyword=boneka+plush`,
    sortOrder: 2,
    active: true,
  },
  {
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&h=400&fit=crop',
    alt: 'Kemasan hadiah cantik',
    label: 'Pembungkus Hadiah',
    shopeeUrl: `${SHOPEE_BASE}/search?keyword=pembungkus+hadiah`,
    sortOrder: 3,
    active: true,
  },
  {
    image: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400&h=400&fit=crop',
    alt: 'Aksesoris lucu untuk hadiah',
    label: 'Aksesoris Lucu',
    shopeeUrl: `${SHOPEE_BASE}/search?keyword=aksesoris+lucu`,
    sortOrder: 4,
    active: true,
  },
];

// ─── Data Shop Categories ─────────────────────────────────────────────────────

const shopCategoriesData = [
  {
    label: 'Gantungan Kunci',
    sub: '15+ desain lucu',
    badge: 'Terlaris',
    badgeVariant: 'bestseller',
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=300&fit=crop',
    shopeeUrl: `${SHOPEE_BASE}/search?keyword=gantungan+kunci`,
    sortOrder: 0,
    active: true,
  },
  {
    label: 'Hadiah Spesial',
    sub: 'Bungkus gratis',
    badge: 'Trending',
    badgeVariant: 'trending',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238f539?w=400&h=300&fit=crop',
    shopeeUrl: `${SHOPEE_BASE}/search?keyword=hadiah+spesial`,
    sortOrder: 1,
    active: true,
  },
  {
    label: 'Mainan Kawaii',
    sub: 'Aman & lembut',
    badge: 'Baru',
    badgeVariant: 'new',
    image: 'https://images.unsplash.com/photo-1559715541-5daf8a0296d0?w=400&h=300&fit=crop',
    shopeeUrl: `${SHOPEE_BASE}/search?keyword=mainan+kawaii`,
    sortOrder: 2,
    active: true,
  },
  {
    label: 'Set Hampers',
    sub: 'Custom sesuka hati',
    badge: 'Populer',
    badgeVariant: 'popular',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&h=300&fit=crop',
    shopeeUrl: `${SHOPEE_BASE}/search?keyword=set+hampers`,
    sortOrder: 3,
    active: true,
  },
];

// ─── Runner ───────────────────────────────────────────────────────────────────

async function seed() {
  console.log('Memulai seeding data Home CMS...\n');

  // Hero Slides
  console.log('Menyisipkan hero slides...');
  await db.delete(heroSlides);
  const heroRows = heroSlidesData.map(d => ({ id: nanoid(), ...d }));
  await db.insert(heroSlides).values(heroRows);
  heroRows.forEach(r => console.log(`  OK  ${r.label} (id: ${r.id})`));

  // Gallery Items
  console.log('\nMenyisipkan gallery items...');
  await db.delete(galleryItems);
  const galleryRows = galleryItemsData.map(d => ({ id: nanoid(), ...d }));
  await db.insert(galleryItems).values(galleryRows);
  galleryRows.forEach(r => console.log(`  OK  ${r.label} (id: ${r.id})`));

  // Shop Categories
  console.log('\nMenyisipkan shop categories...');
  await db.delete(shopCategories);
  const catRows = shopCategoriesData.map(d => ({ id: nanoid(), ...d }));
  await db.insert(shopCategories).values(catRows);
  catRows.forEach(r => console.log(`  OK  ${r.label} (id: ${r.id})`));

  console.log('\nSeeding selesai!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeder gagal:', err);
  process.exit(1);
});