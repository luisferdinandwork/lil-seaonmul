// sections/home/hero.tsx
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { ShoppingBag, MessageCircle, Sparkles } from "lucide-react"

export function Hero() {
  const waLink =
    "https://wa.me/6282154359140?text=Hi%20Lil.Seonmul%21%20I%27m%20interested%20in%20your%20products%20%26%20services."
  const shopeeLink = "https://shopee.co.id/litty.kitty10"

  return (
    <header
      aria-label="Lil.Seonmul hero banner"
      className={cn(
        "relative overflow-hidden",
        "bg-[url('/soft-pastel-banner-for-lil-seonmul.jpg')]",
        "bg-cover bg-center bg-no-repeat",
        "min-h-[90vh] md:min-h-[80vh]",
        "flex items-center"
      )}
    >
      {/* Gradient overlay - softer than full black */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/50 to-black/30 z-0" />

      {/* Decorative blobs */}
      <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-primary/20 blur-3xl z-0 animate-pulse" />
      <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-pink-300/15 blur-2xl z-0" />

      <div className="container mx-auto max-w-5xl px-4 py-16 md:py-20 relative z-10 w-full">
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-center md:justify-between">

          {/* Left: Text content */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left max-w-xl">
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 text-xs font-medium text-white/90 mb-4">
              <Sparkles className="w-3 h-3" />
              Brand by Lily Octavia
            </span>

            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
              Lil.<span className="text-primary drop-shadow-[0_0_20px_rgba(240,180,200,0.8)]">Seonmul</span>
            </h1>

            <p className="mt-4 text-base text-white/85 sm:text-lg leading-relaxed">
              Cute keychains, pastel gifts & kawaii toys — crafted for everyday delight ✨
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap justify-center md:justify-start gap-5 mt-6 text-white/80">
              <div className="text-center">
                <p className="text-xl font-bold text-white">500+</p>
                <p className="text-xs">Happy Buyers</p>
              </div>
              <div className="h-8 w-px bg-white/20 self-center" />
              <div className="text-center">
                <p className="text-xl font-bold text-white">4.9★</p>
                <p className="text-xs">Shopee Rating</p>
              </div>
              <div className="h-8 w-px bg-white/20 self-center" />
              <div className="text-center">
                <p className="text-xl font-bold text-white">Free</p>
                <p className="text-xs">Gift Wrapping</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link href={shopeeLink} aria-label="Shop on Shopee" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button
                  className="w-full sm:w-auto gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold px-6 py-5 rounded-xl shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-primary/50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Shop on Shopee
                </Button>
              </Link>
              <Link href={waLink} aria-label="Chat on WhatsApp" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto gap-2 border-white/40 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 text-sm font-semibold px-6 py-5 rounded-xl transition-all hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Logo card */}
          <div
            className={cn(
              "w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 shrink-0",
              "rounded-3xl bg-white/90 shadow-2xl shadow-black/30 backdrop-blur-sm",
              "ring-1 ring-white/40 overflow-hidden",
              "transition-all duration-500 hover:scale-105 hover:shadow-primary/30",
              "animate-in fade-in slide-in-from-bottom-6 duration-700"
            )}
          >
            <div className="relative w-full h-full">
              <Image
                src="/assets/logo.png"
                alt="Lil.Seonmul logo"
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 192px, 256px"
                priority
              />
            </div>
          </div>

        </div>

        {/* Bottom scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50">
          <div className="w-px h-8 bg-gradient-to-b from-white/0 to-white/40 animate-pulse" />
          <p className="text-[10px] tracking-widest uppercase">Scroll</p>
        </div>
      </div>
    </header>
  )
}