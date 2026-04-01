// sections/home/why-us.tsx
"use client"

import Link from "next/link"
import { ShoppingBag, Gift, Truck, Heart, Layers, Package, Star } from "lucide-react"

const SHOPEE_URL = "https://shopee.co.id/litty.kitty10"

const perks = [
  {
    Icon: Star,
    title: "Rating Shopee 4.9",
    desc: "Ratusan ulasan positif dari pembeli. Kualitas yang bisa diandalkan.",
    accent: false,
  },
  {
    Icon: Gift,
    title: "Pembungkus Hadiah Gratis",
    desc: "Setiap pesanan dibungkus cantik dengan kemasan pastel khas kami.",
    accent: true,
  },
  {
    Icon: Truck,
    title: "Pengiriman Cepat",
    desc: "Diproses di hari yang sama. Aman sampai ke tangan kamu.",
    accent: false,
  },
  {
    Icon: Heart,
    title: "Dibuat dengan Cinta",
    desc: "Dikurasi oleh Lily — setiap produk dipilih karena keunikan & pesonanya.",
    accent: false,
  },
  {
    Icon: Layers,
    title: "Labubu & Teman-teman",
    desc: "Gantungan kunci, boneka, blind box & kolektibel kawaii pilihan.",
    accent: false,
  },
  {
    Icon: Package,
    title: "Stok Siap Kirim",
    desc: "Sebagian besar produk tersedia dan siap dikirim — tanpa menunggu lama.",
    accent: false,
  },
]

export function WhyUs() {
  return (
    <section aria-labelledby="why-us-heading" className="w-full">
      <div className="text-center mb-8">
        <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-2">
          Kenapa pilih kami
        </p>
        <h2 id="why-us-heading" className="text-2xl sm:text-3xl font-bold text-foreground">
          Kenapa kamu akan suka Lil.Seonmul
        </h2>
        <p className="mt-3 text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
          Lebih dari sekadar lucu — kami menghadirkan kesenangan, kualitas, dan sedikit keajaiban di setiap pesanan.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {perks.map(({ Icon, title, desc, accent }) => (
          <div
            key={title}
            className={`group rounded-2xl border p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
              accent
                ? "border-primary/40 bg-primary/5 hover:shadow-primary/15"
                : "border-border bg-card hover:border-primary/30 hover:shadow-primary/10"
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-colors ${
              accent ? "bg-primary/15 group-hover:bg-primary/25" : "bg-secondary group-hover:bg-primary/10"
            }`}>
              <Icon className={`w-4 h-4 ${accent ? "text-primary" : "text-muted-foreground group-hover:text-primary"} transition-colors`} />
            </div>
            <h3 className="font-semibold text-foreground text-sm mb-1 leading-snug">{title}</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href={SHOPEE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          <ShoppingBag className="w-4 h-4" />
          Jelajahi Toko Shopee Kami
        </Link>
      </div>
    </section>
  )
}