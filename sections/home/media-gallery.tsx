// sections/home/media-gallery.tsx
"use client"

import Image from "next/image"

const images = [
  { src: "/pastel-gift-flatlay.jpg", alt: "Pastel gift flatlay", span: "col-span-2 row-span-2" },
  { src: "/soft-pink-packaging.jpg", alt: "Soft pink packaging", span: "" },
  { src: "/neutral-minimal-product.jpg", alt: "Neutral minimal product", span: "" },
  { src: "/pastel-lifestyle-setup.jpg", alt: "Pastel lifestyle setup", span: "" },
  { src: "/branding-mood-board-pastel.jpg", alt: "Branding mood board pastel", span: "" },
  { src: "/soft-pastel-ribbon-details.jpg", alt: "Soft pastel ribbon details", span: "" },
]

export function MediaGallery() {
  return (
    <section aria-labelledby="gallery-heading" className="w-full">
      {/* Section header */}
      <div className="text-center mb-8">
        <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-2">Our Collection</p>
        <h2 id="gallery-heading" className="text-3xl font-bold text-foreground sm:text-4xl">
          Peek Inside Our World 🎁
        </h2>
        <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
          Kawaii keychains, pastel packaging, and adorable gifts — all in one place.
        </p>
      </div>

      {/* Bento-style grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 grid-rows-[auto] gap-3 sm:gap-4">
        {/* Large featured image */}
        <figure className="col-span-2 sm:col-span-1 sm:row-span-2 rounded-2xl overflow-hidden bg-card ring-1 ring-border group aspect-square sm:aspect-auto">
          <div className="relative w-full h-full min-h-[200px]">
            <Image
              src={images[0].src}
              alt={images[0].alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </figure>

        {/* Remaining 5 images */}
        {images.slice(1).map((img) => (
          <figure
            key={img.src}
            className="rounded-2xl overflow-hidden bg-card ring-1 ring-border group aspect-square"
          >
            <div className="relative w-full h-full">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </figure>
        ))}
      </div>
    </section>
  )
}