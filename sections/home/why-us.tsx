// sections/home/why-us.tsx
"use client"

import { Gift, Star, Truck, Heart, Smile, Package } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const perks = [
  {
    icon: Star,
    emoji: "⭐",
    title: "4.9 Shopee Rating",
    desc: "Hundreds of happy buyers with glowing reviews. Quality you can trust.",
  },
  {
    icon: Gift,
    emoji: "🎀",
    title: "Free Gift Wrapping",
    desc: "Every order comes beautifully wrapped in our signature pastel packaging.",
  },
  {
    icon: Truck,
    emoji: "🚚",
    title: "Fast Shipping",
    desc: "Orders processed same day. Straight to your door, safe and secure.",
  },
  {
    icon: Heart,
    emoji: "💖",
    title: "Made with Love",
    desc: "Curated with care by Lily — each piece chosen for its cuteness & charm.",
  },
  {
    icon: Smile,
    emoji: "🐾",
    title: "Labubu & Friends",
    desc: "Keychains, plushies, blind boxes & more kawaii collectibles.",
  },
  {
    icon: Package,
    emoji: "📦",
    title: "Ready Stock",
    desc: "Most items are in stock & ready to ship. No long waits!",
  },
]

export function WhyUs() {
  const shopeeLink = "https://shopee.co.id/litty.kitty10"

  return (
    <section aria-labelledby="why-us-heading" className="w-full">
      {/* Section header */}
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-2">Why choose us</p>
        <h2 id="why-us-heading" className="text-3xl font-bold text-foreground sm:text-4xl">
          Why You&apos;ll Love Lil.Seonmul 🌸
        </h2>
        <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
          More than just cute — we deliver joy, quality, and a little bit of magic in every order.
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {perks.map((perk) => (
          <div
            key={perk.title}
            className="group rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-md hover:shadow-primary/10 transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg group-hover:bg-primary/20 transition-colors">
                {perk.emoji}
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{perk.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{perk.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-muted-foreground">Ready to find your new favorite cute thing?</p>
        <Link href={shopeeLink} target="_blank" rel="noopener noreferrer">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-8 py-5 rounded-xl text-sm font-semibold shadow-md shadow-primary/20 hover:scale-105 transition-all">
            🛍️ Browse Our Shopee Store
          </Button>
        </Link>
      </div>
    </section>
  )
}