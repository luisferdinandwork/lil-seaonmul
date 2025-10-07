import { Hero } from "@/components/hero"
import { Testimonials } from "@/components/testimonials"
import { MediaGallery } from "@/components/media-gallery"
import { ContactForm } from "@/components/contact-form"
import { FooterLinks } from "@/components/footer-links"

export default function HomePage() {
  return (
    <main className="flex flex-col">
      <Hero />
      <section aria-labelledby="testimonials" className="py-12 md:py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 id="testimonials" className="text-balance text-2xl font-semibold tracking-tight">
            What our customers say
          </h2>
          <p className="mt-2 text-muted-foreground">Real words from people who love our soft pastel aesthetic.</p>
          <div className="mt-8">
            <Testimonials />
          </div>
        </div>
      </section>

      <section aria-labelledby="gallery" className="py-12 md:py-16 bg-secondary">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 id="gallery" className="text-balance text-2xl font-semibold tracking-tight">
            Media gallery
          </h2>
          <p className="mt-2 text-muted-foreground">A glimpse of our products, mood, and branding direction.</p>
          <div className="mt-8">
            <MediaGallery />
          </div>
        </div>
      </section>

      <section aria-labelledby="contact" className="py-12 md:py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 id="contact" className="text-balance text-2xl font-semibold tracking-tight">
            Contact us
          </h2>
          <p className="mt-2 text-muted-foreground">
            Have a question or want to collaborate? Send a message—we’ll get back soon.
          </p>
          <div className="mt-8">
            <ContactForm />
          </div>
        </div>
      </section>

      <FooterLinks />
    </main>
  )
}
