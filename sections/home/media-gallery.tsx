// sections/home/media-gallery.tsx
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const SHOPEE_URL = "https://shopee.co.id/litty.kitty10"

type GalleryItem = {
  id: string; image: string; alt: string; label: string; shopeeUrl?: string | null
}

export function MediaGallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/home/gallery`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setItems(data)
        setLoading(false)
      })
      .catch(() => {
        setItems([])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <MediaGallerySkeleton />
  }

  if (items.length === 0) return null

  const [featured, ...rest] = items

  return (
    <section aria-labelledby="gallery-heading" className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-2">
            Koleksi kami
          </p>
          <h2 id="gallery-heading" className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
            Intip dunia kami
          </h2>
        </div>
        <Link
          href={SHOPEE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors self-start sm:self-auto"
        >
          Lihat semua produk
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Sel unggulan */}
        <figure className="col-span-2 sm:col-span-1 sm:row-span-2 rounded-3xl overflow-hidden bg-muted group relative">
          <Link href={featured.shopeeUrl ?? SHOPEE_URL} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
            <div className="relative w-full aspect-[4/3] sm:aspect-auto sm:h-full min-h-[200px] sm:min-h-[360px]">
              <Image src={featured.image} alt={featured.alt} fill priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-white text-xs font-semibold bg-primary/80 backdrop-blur-sm px-3 py-1 rounded-full">
                  {featured.label}
                </span>
              </div>
            </div>
          </Link>
        </figure>

        {/* Sel lainnya */}
        {rest.map((item) => (
          <figure key={item.id} className="rounded-2xl overflow-hidden bg-muted group relative aspect-square">
            <Link href={item.shopeeUrl ?? SHOPEE_URL} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
              <Image src={item.image} alt={item.alt} fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-white text-[11px] font-semibold bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  {item.label}
                </span>
              </div>
            </Link>
          </figure>
        ))}
      </div>
    </section>
  )
}

function MediaGallerySkeleton() {
  return (
    <section aria-label="Memuat galeri" className="w-full animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div className="space-y-2">
          <div className="w-24 h-3 bg-muted rounded" />
          <div className="w-48 h-7 bg-muted rounded" />
        </div>
        <div className="w-32 h-4 bg-muted rounded" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="col-span-2 sm:col-span-1 sm:row-span-2 rounded-3xl bg-muted min-h-[200px] sm:min-h-[360px]" />
        <div className="rounded-2xl bg-muted aspect-square" />
        <div className="rounded-2xl bg-muted aspect-square" />
        <div className="rounded-2xl bg-muted aspect-square" />
        <div className="rounded-2xl bg-muted aspect-square hidden sm:block" />
      </div>
    </section>
  )
}