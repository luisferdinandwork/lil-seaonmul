"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"

export function Hero() {
  const waLink =
    "https://wa.me/6282154359140?text=Hi%20Lil.Seonmul%21%20I%27m%20interested%20in%20your%20products%20%26%20services."
  const shopeeLink = "https://shopee.co.id/litty.kitty10"

  return (
    <header
      aria-label="Lil.Seonmul hero banner"
      className={cn(
        "relative overflow-hidden border-b",
        // Set background image
        "bg-[url('/soft-pastel-banner-for-lil-seonmul.jpg')]",
        "bg-cover bg-center bg-no-repeat"
      )}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      
      <div className="container mx-auto max-w-6xl px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            {/* Light text for dark background */}
            <p className="text-sm uppercase tracking-widest text-white/80">Brand by Lily Octavia</p>
            <h1 className="mt-3 text-pretty text-4xl font-bold leading-tight md:text-5xl text-white">
              Lil.Seonmul
            </h1>
            <p className="mt-3 text-lg text-white/90 md:text-xl">
              Soft pastel gifts & services with a feminine-neutral touch. Crafted for delight, styled for everyday
              charm.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href={waLink} aria-label="Chat on WhatsApp" target="_blank" rel="noopener noreferrer">
                <Button variant="default" className="bg-primary">
                  Chat on WhatsApp
                </Button>
              </Link>
              <Link href={shopeeLink} aria-label="Shop on Shopee" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  Shop on Shopee
                </Button>
              </Link>
            </div>
          </div>

          <div
            className={cn(
              "mt-8 w-full md:mt-0 md:w-[420px]",
              "rounded-xl bg-white/90 p-4 shadow-sm ring-1 ring-white/20 backdrop-blur-sm",
              "transition-all duration-500 animate-in fade-in slide-in-from-right-8",
            )}
          >
            {/* Brand logo placeholder */}
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-white relative">
              <Image
                src="/assets/logo.png"
                alt="Lil.Seonmul logo placeholder"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 420px"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}