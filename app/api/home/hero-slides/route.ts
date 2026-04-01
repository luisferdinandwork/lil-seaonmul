// app/api/home/hero-slides/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getHeroSlides, getAllHeroSlides, createHeroSlide } from '@/lib/home-cms';
import { uploadToCloudinary, CLOUDINARY_FOLDERS } from '@/lib/cloudinary-upload';
import { isAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const showAll = req.nextUrl.searchParams.get('all') === 'true';
  if (showAll) {
    if (!await isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json(await getAllHeroSlides());
  }
  return NextResponse.json(await getHeroSlides());
}

export async function POST(req: NextRequest) {
  if (!await isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form      = await req.formData();
  const label     = form.get('label')     as string | null;
  const shopeeUrl = form.get('shopeeUrl') as string | null;
  const sortOrder = Number(form.get('sortOrder') ?? 0);
  const active    = form.get('active') !== 'false';
  const imageFile = form.get('image')    as File | null;

  if (!label || !shopeeUrl || !imageFile)
    return NextResponse.json({ error: 'label, shopeeUrl dan image wajib diisi' }, { status: 400 });

  const { url } = await uploadToCloudinary(
    Buffer.from(await imageFile.arrayBuffer()),
    CLOUDINARY_FOLDERS.heroSlides,
  );
  return NextResponse.json(await createHeroSlide({ label, shopeeUrl, image: url, sortOrder, active }), { status: 201 });
}