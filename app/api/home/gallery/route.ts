// app/api/home/gallery/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getGalleryItems, getAllGalleryItems, createGalleryItem } from '@/lib/home-cms';
import { uploadToCloudinary, CLOUDINARY_FOLDERS } from '@/lib/cloudinary-upload';
import { isAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const showAll = req.nextUrl.searchParams.get('all') === 'true';
  if (showAll) {
    if (!await isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json(await getAllGalleryItems());
  }
  return NextResponse.json(await getGalleryItems());
}

export async function POST(req: NextRequest) {
  if (!await isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form      = await req.formData();
  const alt       = form.get('alt')       as string | null;
  const label     = form.get('label')     as string | null;
  const shopeeUrl = (form.get('shopeeUrl') as string | null) ?? undefined;
  const sortOrder = Number(form.get('sortOrder') ?? 0);
  const active    = form.get('active') !== 'false';
  const imageFile = form.get('image')     as File | null;

  if (!alt || !label || !imageFile)
    return NextResponse.json({ error: 'alt, label dan image wajib diisi' }, { status: 400 });

  const { url } = await uploadToCloudinary(Buffer.from(await imageFile.arrayBuffer()), CLOUDINARY_FOLDERS.gallery);
  return NextResponse.json(await createGalleryItem({ image: url, alt, label, shopeeUrl, sortOrder, active }), { status: 201 });
}