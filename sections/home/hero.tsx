// sections/home/hero.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, MessageCircle, Star, ArrowRight } from "lucide-react"

const SHOPEE_URL = "https://shopee.co.id/litty.kitty10"
const WA_URL =
  "https://wa.me/6282154359140?text=Halo%20Lil.Seonmul%21%20Saya%20tertarik%20dengan%20produk%20dan%20layanan%20kalian."

type HeroSlide = { id: string; label: string; image: string; shopeeUrl: string }

export function Hero() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/home/hero-slides`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setSlides)
      .catch(() => setSlides([]))
  }, [])

  return (
    <header
      aria-label="Banner utama Lil.Seonmul"
      className="relative overflow-hidden bg-background min-h-[92dvh] sm:min-h-[85dvh] flex flex-col"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] max-w-[480px] max-h-[480px] rounded-full bg-primary/20 blur-3xl z-0 pointer-events-none" />
      <div className="absolute bottom-16 left-0 w-[30vw] h-[30vw] max-w-[320px] max-h-[320px] rounded-full bg-pink-300/15 blur-2xl z-0 pointer-events-none" />

      {/* Konten utama */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full px-5 sm:px-8 py-20">
        <div className="inline-flex items-center gap-2 self-start bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          Tersedia di Shopee
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-5 max-w-lg">
          Hadiah yang terasa seperti{" "}
          <span className="text-primary drop-shadow-[0_0_30px_rgba(240,140,170,0.6)]">
            pelukan hangat
          </span>
        </h1>

        <p className="text-white/80 text-base sm:text-lg max-w-sm leading-relaxed mb-8">
          Gantungan kunci lucu, hadiah pastel & mainan kawaii — dibuat dengan cinta oleh Lily Octavia.
        </p>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-primary text-primary" />
            ))}
          </div>
          <span className="text-white/70 text-sm">
            <span className="text-white font-semibold">4.9</span> · 500+ pembeli senang
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            href={SHOPEE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-7 py-3.5 rounded-2xl shadow-xl shadow-primary/30 hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <ShoppingBag className="w-4 h-4" />
            Belanja di Shopee
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
          <Link
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/25 text-white font-semibold text-sm px-7 py-3.5 rounded-2xl hover:bg-white/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <MessageCircle className="w-4 h-4" />
            Chat di WhatsApp
          </Link>
        </div>
      </div>

      {/* Strip produk — dari database */}
      {mounted && slides.length > 0 && (
        <div className="relative z-10 w-full overflow-hidden">
          <div className="flex gap-3 px-5 sm:px-8 pb-6 pt-2 overflow-x-auto scrollbar-none">
            {slides.map((slide) => (
              <Link
                key={slide.id}
                href={slide.shopeeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 group"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 ring-1 ring-white/10 group-hover:ring-primary/60 transition-all duration-300">
                  <Image
                    src={slide.image}
                    alt={slide.label}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="96px"
                  />
                </div>
                <p className="text-[10px] text-white/60 text-center mt-1.5 group-hover:text-white/90 transition-colors">
                  {slide.label}
                </p>
              </Link>
            ))}
          </div>
          <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-black/40 to-transparent pointer-events-none" />
        </div>
      )}

      {/* Loading skeleton untuk slide */}
      {!mounted && (
        <div className="relative z-10 w-full overflow-hidden">
          <div className="flex gap-3 px-5 sm:px-8 pb-6 pt-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex-shrink-0 animate-pulse">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10" />
                <div className="w-14 h-2 bg-white/10 rounded mt-2 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="absolute bottom-28 sm:bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 text-white/30 z-10 hidden sm:flex">
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-white/30 animate-pulse" />
        <p className="text-[9px] tracking-[0.3em] uppercase">Gulir</p>
      </div>
    </header>
  )
}