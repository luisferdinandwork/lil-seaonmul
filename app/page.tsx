// app/page.tsx
"use client"

import { Hero } from "@/sections/home/hero"
import { MediaGallery } from "@/sections/home/media-gallery"
import { ShopShowcase } from "@/sections/home/shop-showcase"
import { WhyUs } from "@/sections/home/why-us"
import { ContactForm } from "@/sections/home/contact-form"
import { FooterLinks } from "@/components/footer-links"
import { Ribbon } from "lucide-react"

export default function HomePage() {
  return (
    <main className="flex flex-col bg-background">
      <Hero />

      <div className="flex items-center justify-center py-6 px-4">
        <div className="flex items-center gap-3">
          <Ribbon className="w-3.5 h-3.5 text-primary/50" />
          <div className="h-px w-12 bg-primary/30" />
          <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-medium">
            Hadiah Pastel Lembut
          </span>
          <div className="h-px w-12 bg-primary/30" />
          <Ribbon className="w-3.5 h-3.5 text-primary/50" />
        </div>
      </div>

      <div className="flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-6 gap-16 pb-20">
        <MediaGallery />
        <ShopShowcase />
        <WhyUs />
        <ContactForm />
      </div>

      <FooterLinks />
    </main>
  )
}