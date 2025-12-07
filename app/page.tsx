// app/page.tsx
"use client"

import { Hero, Testimonials, MediaGallery, ContactForm } from "@/sections/home"
import { FooterLinks } from "@/components/footer-links"

export default function HomePage() {
  return (
    <main className="flex flex-col">
      <Hero />
      <div className="flex flex-col max-w-8xl mx-auto space-y-10 mt-20">
        {/* <BlogPreview /> */}
        <MediaGallery />
        <Testimonials />
        <ContactForm />
      </div>
      <FooterLinks />
    </main>
  )
}