// scripts/seed-posts.ts
import { config } from 'dotenv';

config({ path: '.env' });

import { db } from '../db/index';
import { authors, posts } from '../db/schema';
import { eq, sql } from 'drizzle-orm';

// ─── Cloudinary URL helper ────────────────────────────────────────────────────
// Replace YOUR_CLOUD_NAME with your actual Cloudinary cloud name.
// For each post, upload a featured image to Cloudinary and set its public_id below.
//
// Recommended upload preset transforms (set in Cloudinary dashboard):
//   Blog featured images : w_1200,h_630,c_fill,q_auto,f_auto
//
// Example public_ids used below — replace with your actual uploaded files:
//   blog/pastel-gift-guide      → uploaded to the "blog" folder
//   blog/color-palette-2024
//   blog/gifting-etiquette
const CLOUD_NAME = 'YOUR_CLOUD_NAME';

function cloudinaryUrl(publicId: string, transforms = 'w_1200,h_630,c_fill,q_auto,f_auto') {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}

// ─── Sample posts ─────────────────────────────────────────────────────────────
// authorEmail must match the admin/author you seeded with seed-admin.ts
const AUTHOR_EMAIL = 'lily@yourdomain.com'; // ← must match seed-admin.ts

const SAMPLE_POSTS = [
  {
    id: crypto.randomUUID(),
    title: 'The Ultimate Pastel Gift Guide for Every Occasion',
    slug: 'pastel-gift-guide-every-occasion',
    excerpt:
      'From birthdays to bridal showers, discover how to choose pastel gifts that feel personal, beautiful, and memorable.',
    content: `Choosing the perfect gift can feel overwhelming — but when you lean into a soft pastel palette, everything becomes a little easier and a lot more beautiful.

## Why Pastel Gifts Feel Special

Pastel tones carry an inherent sense of calm and care. Blush pinks, sage greens, lavender, and butter yellows communicate warmth without being loud. When someone unwraps a gift wrapped in these shades, there's an immediate sense of being known and considered.

## For Birthdays

A curated pastel hamper — think lavender hand cream, a blush-toned candle, and a soft sage journal — makes a deeply personal birthday gift. The cohesive color story does the visual work, so every item feels intentional even if they serve different purposes.

## For Bridal Showers

Bridal showers are made for pastels. Consider gifting a set of linen napkins in dusty rose, paired with a pearl-handled letter opener and a small bouquet of dried pampas grass. These pieces transition beautifully from the event to the couple's home.

## For New Baby

Soft neutral tones are ideal for new baby gifts because they age gracefully as the nursery evolves. A merino wool swaddle in oat, a small wooden mobile, and a handwritten card are all that's needed.

## Wrapping Tips

- Use tissue paper in complementary pastels rather than matching exactly
- Layer two or three tones for depth
- Add a sprig of dried lavender or eucalyptus for a tactile finish
- Choose ribbon over tape wherever possible for a luxurious feel

The most important thing is intention. A pastel palette signals that you paid attention — and that's the heart of great gifting.`,
    featuredImage: cloudinaryUrl('blog/pastel-gift-guide'),
    tags: ['gift guide', 'pastels', 'occasions', 'styling'],
    readTime: '6 min read',
    published: true,
    viewCount: 0,
  },
  {
    id: crypto.randomUUID(),
    title: 'Building Your 2024 Feminine-Neutral Color Palette',
    slug: 'feminine-neutral-color-palette-2024',
    excerpt:
      'How to build a cohesive, timeless color palette for your home, wardrobe, or brand using feminine-neutral tones.',
    content: `Feminine-neutral isn't a single color — it's a relationship between colors. The magic lies in how soft, muted tones interact with warm whites and gentle contrast.

## What Is a Feminine-Neutral Palette?

At its core, a feminine-neutral palette avoids the starkness of pure black-and-white while steering clear of anything overly saturated or bold. Think porcelain, linen, blush, taupe, sage, and the quieter side of gold.

These palettes work because they feel livable. They don't demand attention — they invite it.

## The Five Anchor Tones for 2024

**1. Parchment White**
Not stark, not cream — somewhere in between. Parchment works as a base for everything and makes other pastels read as more sophisticated.

**2. Dusty Rose**
The 2024 version of blush is slightly cooler and more muted than what came before. Less pink, more mauve. It pairs beautifully with both sage and warm neutrals.

**3. Sage Green**
Sage has become a defining color of quiet, grounded femininity. It works in kitchens, in wardrobes, on packaging, and in florals.

**4. Warm Taupe**
A reliable anchor. Warm taupe adds depth without heaviness and keeps palettes from feeling too precious or fragile.

**5. Soft Gold**
Used sparingly — as hardware, as a candle vessel, as jewelry — soft gold elevates the other four tones and adds a sense of occasion.

## Applying the Palette

When decorating a space: use parchment as your wall and large furniture base, introduce dusty rose and sage through soft furnishings, add taupe in natural textures like rattan and linen, and finish with gold accents.

When building a wardrobe capsule: the same rules apply. Neutrals carry the structure; pastels provide the personality.

The goal isn't perfection — it's coherence. A palette that feels considered is one that will continue to feel right over time.`,
    featuredImage: cloudinaryUrl('blog/color-palette-2024'),
    tags: ['color palette', 'design', 'interiors', 'style'],
    readTime: '7 min read',
    published: true,
    viewCount: 0,
  },
  {
    id: crypto.randomUUID(),
    title: 'The Art of Thoughtful Gifting: A Modern Etiquette Guide',
    slug: 'art-of-thoughtful-gifting-etiquette',
    excerpt:
      'Gifting well is a skill. Here\'s how to navigate modern gift-giving with grace, creativity, and genuine thoughtfulness.',
    content: `Somewhere between obligation and delight, great gifting lives. It's not about budget — it's about the story a gift tells and the care it communicates.

## The Shift Away from Registries

For decades, gift registries made gifting simple. But simplicity isn't the same as meaningfulness. More people are now moving toward thoughtful, off-registry gifts that feel personal — even for weddings.

This doesn't mean ignoring registries entirely. It means supplementing them. Give one item from the registry and pair it with something small and unexpected that speaks to who the person is.

## Rules for Gifting Well

**Know the person, not just the occasion**
The occasion tells you when to give. The person tells you what to give. A birthday gift for someone who collects vintage ceramics should look very different from one for someone who travels every month.

**Presentation is part of the gift**
How a gift arrives matters. A beautiful box, considered tissue, a handwritten note — these details signal that you took time. And time is the most finite resource anyone has.

**Experiences outlast objects**
When in doubt, gift an experience. A cooking class, a perfume consultation, a private flower arranging workshop — these become stories. Objects become clutter. Experiences become memories.

**Small can be significant**
Some of the most treasured gifts are small: a book with a note inside explaining why you thought of them, a jar of local honey from their hometown, a pressed flower from your garden. Cost is not a proxy for care.

## On Thank You Notes

Send them. Always. A handwritten note — even a short one — closes the gifting loop with grace and makes the giver feel genuinely seen.

Gifting is one of the oldest human rituals. When we do it well, we're not just handing someone an object — we're saying: I know you, I see you, and I'm glad you're in my life.`,
    featuredImage: cloudinaryUrl('blog/gifting-etiquette'),
    tags: ['gifting', 'etiquette', 'lifestyle', 'thoughtfulness'],
    readTime: '8 min read',
    published: true,
    viewCount: 0,
  },
];

// ─── Seeder ───────────────────────────────────────────────────────────────────

async function migratePostsTable() {
  console.log('🔧 Checking posts table schema...');

  // Add published column if missing
  await db.execute(sql`
    ALTER TABLE posts
    ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT false;
  `);

  // Add view_count column if missing
  await db.execute(sql`
    ALTER TABLE posts
    ADD COLUMN IF NOT EXISTS view_count INTEGER NOT NULL DEFAULT 0;
  `);

  // Add tags column if missing (text array)
  await db.execute(sql`
    ALTER TABLE posts
    ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
  `);

  console.log('✅ Posts table columns verified.');
}

async function seedPosts() {
  console.log('📝 Seeding blog posts...');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set');
    process.exit(1);
  }

  try {
    // Ensure all required columns exist before inserting
    await migratePostsTable();

    // Resolve author by email
    const authorResult = await db
      .select({ id: authors.id, name: authors.name })
      .from(authors)
      .where(eq(authors.email, AUTHOR_EMAIL))
      .limit(1);

    if (authorResult.length === 0) {
      console.error(`❌ No author found with email "${AUTHOR_EMAIL}".`);
      console.error('   Run seed-admin.ts first, then retry.');
      process.exit(1);
    }

    const { id: authorId, name: authorName } = authorResult[0];
    console.log(`✅ Found author: ${authorName} (${authorId})`);

    // Check for existing slugs to avoid conflicts
    let skipped = 0;
    let inserted = 0;

    for (const post of SAMPLE_POSTS) {
      const existing = await db
        .select({ id: posts.id })
        .from(posts)
        .where(eq(posts.slug, post.slug))
        .limit(1);

      if (existing.length > 0) {
        console.log(`⚠️  Skipping "${post.title}" — slug already exists.`);
        skipped++;
        continue;
      }

      await db.insert(posts).values({ ...post, authorId });
      console.log(`   ✓ "${post.title}"`);
      inserted++;
    }

    console.log('');
    console.log(`✅ Done! ${inserted} post(s) inserted, ${skipped} skipped.`);
    console.log('');
    console.log('📸 Cloudinary images expected at:');
    SAMPLE_POSTS.forEach((p) => console.log(`   ${p.featuredImage}`));
    console.log('');
    console.log(
      '   If images are broken, upload your files to Cloudinary with the matching public_ids'
    );
    console.log('   and replace YOUR_CLOUD_NAME at the top of this file.');
  } catch (error) {
    console.error('❌ Error seeding posts:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedPosts();