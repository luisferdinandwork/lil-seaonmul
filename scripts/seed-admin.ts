// scripts/seed-admin.ts
import 'dotenv/config';

import bcrypt from 'bcryptjs';
import { db } from '../db/index';
import { authors } from '../db/schema';
import { eq } from 'drizzle-orm';

// ─── Konfigurasi ──────────────────────────────────────────────────────────────
// Ubah sesuai kebutuhan sebelum menjalankan di production.

const ADMIN = {
  name: 'Lily',
  email: 'lily@yourdomain.com',        // ← ganti dengan email asli
  password: 'admin123',                 // ← ganti dengan password kuat
  bio: 'Founder & creative director. Passionate about soft aesthetics, thoughtful gifting, and feminine-neutral design.',
  avatar: null as string | null,        // ← opsional, isi URL Cloudinary jika ada
  role: 'admin' as const,               // HARUS 'admin' agar isAdmin() di lib/auth.ts bekerja
};

// ─── Validasi environment ─────────────────────────────────────────────────────

function validateEnv() {
  const missing: string[] = [];

  if (!process.env.DATABASE_URL) {
    missing.push('DATABASE_URL');
  }
  if (!process.env.JWT_SECRET) {
    missing.push('JWT_SECRET');
  }

  if (missing.length > 0) {
    console.error('❌ Environment variable berikut belum diset:');
    missing.forEach((v) => console.error(`   - ${v}`));
    console.error('');
    console.error('   Pastikan file .env atau .env.local sudah berisi variabel tersebut.');
    console.error('   Contoh:');
    console.error('     DATABASE_URL=postgresql://user:pass@host:5432/db');
    console.error('     JWT_SECRET=abc123... (min. 32 karakter, generate dengan:');
    console.error('       node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))" )');
    process.exit(1);
  }
}

// ─── Cloudinary helper (opsional) ─────────────────────────────────────────────
// Jika avatar ingin menggunakan Cloudinary, isi CLOUD_NAME dan public_id.
// Jika tidak, biarkan ADMIN.avatar = null.

// const CLOUD_NAME = 'your-cloud-name';
// function cloudinaryUrl(publicId: string, transforms = 'w_200,h_200,c_fill,g_face,q_auto,f_auto') {
//   return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
// }
// ADMIN.avatar = cloudinaryUrl('avatars/lily');

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function seedAdmin() {
  console.log('');
  console.log('👤 Seeding admin account...');
  console.log('─'.repeat(50));

  validateEnv();

  try {
    // Cek apakah admin sudah ada
    const existing = await db
      .select({ id: authors.id, role: authors.role })
      .from(authors)
      .where(eq(authors.email, ADMIN.email))
      .limit(1);

    if (existing.length > 0) {
      const record = existing[0];
      console.log(`⚠️  Akun dengan email "${ADMIN.email}" sudah ada.`);
      console.log(`   ID  : ${record.id}`);
      console.log(`   Role: ${record.role}`);

      if (record.role !== 'admin') {
        console.log('');
        console.log('   ⚠️  Role bukan "admin" — memperbarui role...');
        await db
          .update(authors)
          .set({ role: 'admin' })
          .where(eq(authors.id, record.id));
        console.log('   ✅ Role berhasil diubah menjadi "admin".');
      }

      console.log('');
      console.log('   Jika ingin re-seed, hapus record terlebih dahulu:');
      console.log(`   DELETE FROM authors WHERE id = '${record.id}';`);
      process.exit(0);
    }

    // Hash password
    console.log('   🔐 Meng-hash password...');
    const hashedPassword = await bcrypt.hash(ADMIN.password, 12);

    // Insert admin baru
    const id = crypto.randomUUID();

    await db.insert(authors).values({
      id,
      name: ADMIN.name,
      email: ADMIN.email,
      password: hashedPassword,
      bio: ADMIN.bio,
      avatar: ADMIN.avatar,
      role: ADMIN.role,
    });

    console.log('');
    console.log('✅ Admin account berhasil dibuat!');
    console.log('');
    console.log('   Detail akun:');
    console.log(`     ID     : ${id}`);
    console.log(`     Name   : ${ADMIN.name}`);
    console.log(`     Email  : ${ADMIN.email}`);
    console.log(`     Role   : ${ADMIN.role}`);
    console.log(`     Avatar : ${ADMIN.avatar ?? '(kosong)'}`);
    console.log('');
    console.log('─'.repeat(50));
    console.log('');
    console.log('⚠️  SEBELUM DEPLOY KE PRODUCTION:');
    console.log('   1. Ganti password default dengan password yang kuat.');
    console.log('   2. Pastikan JWT_SECRET sudah di-generate secara random (min. 32 karakter).');
    console.log('   3. Jangan pernah commit .env ke git.');
    console.log('');
  } catch (error) {
    console.error('');
    console.error('❌ Gagal men-seed admin:');
    console.error('');
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
      if ('code' in error) {
        console.error(`   Error code: ${(error as { code: string }).code}`);
      }
    } else {
      console.error(error);
    }
    console.error('');
    console.error('   Kemungkinan penyebab:');
    console.error('   - DATABASE_URL salah atau database belum dibuat');
    console.error('   - Tabel "authors" belum ada (jalankan migration dulu)');
    console.error('   - Koneksi database gagal');
    console.error('');
    process.exit(1);
  }

  process.exit(0);
}

seedAdmin();