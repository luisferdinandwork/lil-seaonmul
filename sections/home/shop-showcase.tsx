// sections/home/shop-showcase.tsx
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight, ShoppingBag, Gift,
  TrendingUp, Sparkles, Dices, ShieldCheck,
  Package, Zap, MessageCircle, Star,
  type LucideIcon,
} from "lucide-react"

const SHOPEE_URL = "https://shopee.co.id/litty.kitty10"

type ShopCategory = {
  id: string; label: string; sub: string; badge: string
  badgeVariant: string; image: string; shopeeUrl: string
}

const BADGE_MAP: Record<string, { Icon: LucideIcon; style: string }> = {
  trending:   { Icon: TrendingUp, style: "bg-rose-100 text-rose-600" },
  bestseller: { Icon: Star,       style: "bg-primary/15 text-primary" },
  new:        { Icon: Sparkles,   style: "bg-purple-100 text-purple-600" },
  popular:    { Icon: Dices,      style: "bg-amber-100 text-amber-600" },
}

const trustBadges = [
  { Icon: ShieldCheck,   label: "100% Produk Asli" },
  { Icon: Package,       label: "Kemasan Aman" },
  { Icon: Zap,           label: "Kirim Hari Ini" },
  { Icon: MessageCircle, label: "Dukungan WhatsApp" },
]

export function ShopShowcase() {
  const [categories, setCategories] = useState<ShopCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/home/shop-categories`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setCategories(data)
        setLoading(false)
      })
      .catch(() => {
        setCategories([])
        setLoading(false)
      })
  }, [])

  return (
    <section aria-labelledby="shop-heading" className="w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-2">
            Belanja berdasarkan kategori
          </p>
          <h2 id="shop-heading" className="text-2xl sm:text-3xl font-bold text-foreground">
            Temukan Hadiah Sempurna
          </h2>
        </div>
        <Link
          href={SHOPEE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors self-start sm:self-auto"
        >
          <ShoppingBag className="w-4 h-4" />
          Lihat semua di Shopee
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Kartu kategori */}
      {loading && <CategoryCardsSkeleton />}

      {!loading && categories.length > 0 && (
        <div className="-mx-5 sm:mx-0">
          <div className="flex gap-3 px-5 sm:hidden overflow-x-auto scrollbar-none pb-1">
            {categories.map((cat) => <CategoryCard key={cat.id} cat={cat} />)}
          </div>
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => <CategoryCard key={cat.id} cat={cat} desktop />)}
          </div>
        </div>
      )}

      {/* Banner fitur */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-primary/8 to-transparent border border-primary/20 p-6 sm:p-8">
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-primary/15 blur-2xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full">
              <Gift className="w-3 h-3" />
              Pembungkus hadiah gratis untuk setiap pesanan
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
              Setiap pesanan tiba<br />
              <span className="text-primary">terbungkus cantik</span>
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Tanpa biaya tambahan. Kemasan pastel khas kami membuat unboxing terasa seperti hadiah untuk diri sendiri.
            </p>
          </div>
          <Link
            href={SHOPEE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-6 py-3 rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-200"
          >
            <ShoppingBag className="w-4 h-4" />
            Belanja Sekarang
          </Link>
        </div>
      </div>

      {/* Badge kepercayaan */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {trustBadges.map(({ Icon, label }) => (
          <div key={label} className="flex items-center gap-2.5 bg-secondary border border-border rounded-2xl px-4 py-3">
            <Icon className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-xs font-semibold text-foreground">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function CategoryCard({ cat, desktop }: { cat: ShopCategory; desktop?: boolean }) {
  const { Icon, style } = BADGE_MAP[cat.badgeVariant] ?? BADGE_MAP.trending
  return (
    <Link
      href={cat.shopeeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex-shrink-0 rounded-2xl overflow-hidden border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 block ${desktop ? "w-full" : "w-44"}`}
    >
      <div className={`relative overflow-hidden bg-muted ${desktop ? "aspect-[4/3]" : "aspect-square"}`}>
        <Image src={cat.image} alt={cat.label} fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 176px, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
      <div className="p-3 sm:p-4">
        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 ${style}`}>
          <Icon className="w-2.5 h-2.5" />
          {cat.badge}
        </span>
        <h3 className="font-bold text-foreground text-sm leading-tight">{cat.label}</h3>
        <p className="text-muted-foreground text-xs mt-0.5">{cat.sub}</p>
      </div>
      <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-200 shadow-sm">
        <ArrowRight className="w-3.5 h-3.5 text-primary" />
      </div>
    </Link>
  )
}

function CategoryCardsSkeleton() {
  return (
    <div className="-mx-5 sm:mx-0 animate-pulse">
      {/* Mobile skeleton */}
      <div className="flex gap-3 px-5 sm:hidden overflow-x-hidden pb-1">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-44 rounded-2xl bg-muted overflow-hidden">
            <div className="aspect-square bg-muted" />
            <div className="p-4 space-y-2">
              <div className="w-14 h-4 bg-muted rounded-full" />
              <div className="w-24 h-3.5 bg-muted rounded" />
              <div className="w-16 h-3 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
      {/* Desktop skeleton */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-muted overflow-hidden">
            <div className="aspect-[4/3] bg-muted" />
            <div className="p-4 space-y-2">
              <div className="w-14 h-4 bg-muted rounded-full" />
              <div className="w-28 h-4 bg-muted rounded" />
              <div className="w-20 h-3 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}