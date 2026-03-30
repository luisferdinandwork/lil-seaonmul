// scripts/seed-admin.ts
import { config } from 'dotenv';
import bcrypt from 'bcryptjs';

config({ path: '.env' });

import { db } from '../db/index';
import { authors } from '../db/schema';
import { eq } from 'drizzle-orm';

// ─── Cloudinary image URL helper ─────────────────────────────────────────────
// Format: https://res.cloudinary.com/<cloud_name>/image/upload/<public_id>
// Replace YOUR_CLOUD_NAME with your actual Cloudinary cloud name.
// Upload Lily's avatar to Cloudinary and paste the public_id below.
const CLOUD_NAME = 'YOUR_CLOUD_NAME';

function cloudinaryUrl(publicId: string, transforms = 'w_200,h_200,c_fill,g_face,q_auto,f_auto') {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}

// ─── Admin data ───────────────────────────────────────────────────────────────
const ADMIN = {
  id: crypto.randomUUID(),
  name: 'Lily',
  email: 'lily@yourdomain.com',       // ← change to real email
  password: 'admin123',  // ← change before running in production
  bio: 'Founder & creative director. Passionate about soft aesthetics, thoughtful gifting, and feminine-neutral design.',
  // Upload an avatar to Cloudinary and replace the public_id below.
  // e.g. if you uploaded to the "avatars" folder: 'avatars/lily'
  avatar: cloudinaryUrl('avatars/lily'),
  role: 'admin' as const,
};

async function seedAdmin() {
  console.log('👤 Seeding admin account...');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set');
    process.exit(1);
  }

  try {
    // Check if an admin with this email already exists
    const existing = await db
      .select({ id: authors.id })
      .from(authors)
      .where(eq(authors.email, ADMIN.email))
      .limit(1);

    if (existing.length > 0) {
      console.log(`⚠️  Admin with email "${ADMIN.email}" already exists — skipping.`);
      console.log('   If you want to re-seed, delete the existing record first.');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(ADMIN.password, 12);

    await db.insert(authors).values({
      ...ADMIN,
      password: hashedPassword,
    });

    console.log('✅ Admin account created successfully!');
    console.log('');
    console.log('  Name  :', ADMIN.name);
    console.log('  Email :', ADMIN.email);
    console.log('  Role  :', ADMIN.role);
    console.log('  Avatar:', ADMIN.avatar);
    console.log('');
    console.log('⚠️  Remember to update the password before deploying to production.');
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedAdmin();