// app/api/home/shop-categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getShopCategories, getAllShopCategories, createShopCategory } from '@/lib/home-cms';
import { uploadToCloudinary, CLOUDINARY_FOLDERS } from '@/lib/cloudinary-upload';
import { isAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const showAll = req.nextUrl.searchParams.get('all') === 'true';
  if (showAll) {
    if (!await isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json(await getAllShopCategories());
  }
  return NextResponse.json(await getShopCategories());
}

export async function POST(req: NextRequest) {
  if (!await isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form         = await req.formData();
  const label        = form.get('label')        as string | null;
  const sub          = form.get('sub')          as string | null;
  const badge        = form.get('badge')        as string | null;
  const badgeVariant = (form.get('badgeVariant') as string | null) ?? 'trending';
  const shopeeUrl    = form.get('shopeeUrl')    as string | null;
  const sortOrder    = Number(form.get('sortOrder') ?? 0);
  const active       = form.get('active') !== 'false';
  const imageFile    = form.get('image')        as File | null;

  if (!label || !sub || !badge || !shopeeUrl || !imageFile)
    return NextResponse.json({ error: 'label, sub, badge, shopeeUrl dan image wajib diisi' }, { status: 400 });

  const { url } = await uploadToCloudinary(Buffer.from(await imageFile.arrayBuffer()), CLOUDINARY_FOLDERS.shopCategories);
  return NextResponse.json(
    await createShopCategory({ label, sub, badge, badgeVariant, shopeeUrl, image: url, sortOrder, active }),
    { status: 201 }
  );
}