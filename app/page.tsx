// app/page.tsx
"use client"

import { Hero, WhyUs, MediaGallery, ContactForm } from "@/sections/home"
import { FooterLinks } from "@/components/footer-links"

export default function HomePage() {
  return (
    <main className="flex flex-col bg-background">
      <Hero />

      {/* Floating section divider */}
      <div className="flex items-center justify-center py-6 px-4">
        <div className="flex items-center gap-3">
          <span className="text-lg">🎀</span>
          <div className="h-px w-16 bg-primary/30" />
          <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">
            Soft Pastel Gifts
          </span>
          <div className="h-px w-16 bg-primary/30" />
          <span className="text-lg">🎀</span>
        </div>
      </div>

      <div className="flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-6 gap-16 pb-20">
        <MediaGallery />
        <WhyUs />
        <ContactForm />
      </div>

      <FooterLinks />
    </main>
  )
}