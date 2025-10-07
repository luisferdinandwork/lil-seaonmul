export function MediaGallery() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      <figure className="rounded-lg overflow-hidden bg-card ring-1 ring-border">
        <img src="/pastel-gift-flatlay.jpg" alt="Pastel gift flatlay" className="h-full w-full object-cover" />
      </figure>
      <figure className="rounded-lg overflow-hidden bg-card ring-1 ring-border">
        <img src="/soft-pink-packaging.jpg" alt="Soft pink packaging" className="h-full w-full object-cover" />
      </figure>
      <figure className="rounded-lg overflow-hidden bg-card ring-1 ring-border">
        <img src="/neutral-minimal-product.jpg" alt="Neutral minimal product" className="h-full w-full object-cover" />
      </figure>
      <figure className="rounded-lg overflow-hidden bg-card ring-1 ring-border">
        <img src="/pastel-lifestyle-setup.jpg" alt="Pastel lifestyle setup" className="h-full w-full object-cover" />
      </figure>
      <figure className="rounded-lg overflow-hidden bg-card ring-1 ring-border">
        <img src="/branding-mood-board-pastel.jpg" alt="Branding mood board pastel" className="h-full w-full object-cover" />
      </figure>
      <figure className="rounded-lg overflow-hidden bg-card ring-1 ring-border">
        <img src="/soft-pastel-ribbon-details.jpg" alt="Soft pastel ribbon details" className="h-full w-full object-cover" />
      </figure>
    </div>
  )
}
