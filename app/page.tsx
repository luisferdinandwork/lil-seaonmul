// app/page.tsx
"use client"

import { BlogPreview, Hero, Testimonials, MediaGallery, ContactForm } from "@/sections/home"
import { FooterLinks } from "@/components/footer-links"

export default function HomePage() {
  return (
    <main className="flex flex-col">
      <Hero />
      <div className="flex flex-col max-w-7xl mx-auto space-y-10 mt-20">
        <BlogPreview />
        <Testimonials />
        <MediaGallery />
        <ContactForm />
      </div>
      <FooterLinks />
    </main>
  )
}