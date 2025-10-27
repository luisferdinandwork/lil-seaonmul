import Image from "next/image"

export function MediaGallery() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      <figure className="rounded-lg overflow-hidden bg-card ring-1 ring-border">
        <div className="aspect-square w-full relative">
          <Image
            src="/pastel-gift-flatlay.jpg"
            alt="Pastel gift flatlay"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>
      </figure>
      <figure className="rounded-lg overflow-hidden bg-card ring-1 ring-border">
        <div className="aspect-square w-full relative">
          <Image
            src="/soft-pink-packaging.jpg"
            alt="Soft pink packaging"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>
      </figure>
      <figure className="rounded-lg overflow-hidden bg-card ring-1 ring-border">
        <div className="aspect-square w-full relative">
          <Image
            src="/neutral-minimal-product.jpg"
            alt="Neutral minimal product"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>
      </figure>
      <figure className="rounded-lg overflow-hidden bg-card ring-1 ring-border">
        <div className="aspect-square w-full relative">
          <Image
            src="/pastel-lifestyle-setup.jpg"
            alt="Pastel lifestyle setup"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>
      </figure>
      <figure className="rounded-lg overflow-hidden bg-card ring-1 ring-border">
        <div className="aspect-square w-full relative">
          <Image
            src="/branding-mood-board-pastel.jpg"
            alt="Branding mood board pastel"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>
      </figure>
      <figure className="rounded-lg overflow-hidden bg-card ring-1 ring-border">
        <div className="aspect-square w-full relative">
          <Image
            src="/soft-pastel-ribbon-details.jpg"
            alt="Soft pastel ribbon details"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>
      </figure>
    </div>
  )
}