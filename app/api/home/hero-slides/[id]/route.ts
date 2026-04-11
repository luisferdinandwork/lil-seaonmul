// app/api/home/hero-slides/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { updateHeroSlide, deleteHeroSlide } from '@/lib/home-cms';
import { uploadToCloudinary, CLOUDINARY_FOLDERS } from '@/lib/cloudinary-upload';
import { isAdmin } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ✅ Promise type
) {
  if (!await isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params  // ✅ await params

  const form = await req.formData();
  const updates: Record<string, unknown> = {};
  if (form.has('label'))     updates.label     = form.get('label');
  if (form.has('shopeeUrl')) updates.shopeeUrl = form.get('shopeeUrl');
  if (form.has('sortOrder')) updates.sortOrder = Number(form.get('sortOrder'));
  if (form.has('active'))    updates.active    = form.get('active') !== 'false';

  const imageFile = form.get('image') as File | null;
  if (imageFile && imageFile.size > 0) {
    const { url } = await uploadToCloudinary(
      Buffer.from(await imageFile.arrayBuffer()),
      CLOUDINARY_FOLDERS.heroSlides
    );
    updates.image = url;
  }

  const result = await updateHeroSlide(id, updates);
  return NextResponse.json(result ?? { id });  // ✅ fallback if result is undefined
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ✅ Promise type
) {
  if (!await isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params  // ✅ await params

  await deleteHeroSlide(id);
  return NextResponse.json({ deleted: true });
}