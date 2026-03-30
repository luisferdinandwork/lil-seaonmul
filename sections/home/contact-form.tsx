// sections/home/contact-form.tsx
"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import Link from "next/link"
import { Mail, Phone, ShoppingBag, MessageCircle, Clock } from "lucide-react"

const quickLinks = [
  {
    icon: ShoppingBag,
    emoji: "🛍️",
    label: "Shopee Store",
    desc: "Browse & buy our full collection",
    href: "https://shopee.co.id/litty.kitty10",
    cta: "Visit Store",
    highlight: true,
  },
  {
    icon: MessageCircle,
    emoji: "💬",
    label: "WhatsApp",
    desc: "Chat for quick replies & custom orders",
    href: "https://wa.me/6282154359140?text=Hi%20Lil.Seonmul%21%20I%27d%20like%20to%20learn%20more.",
    cta: "Chat Now",
    highlight: false,
  },
]

export function ContactForm() {
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      message: String(formData.get("message") || ""),
    }
    try {
      setLoading(true)
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Failed to submit")
      toast.success("Message sent! 🎀", {
        description: "Thanks for reaching out. We'll respond shortly.",
        duration: 5000,
      })
      ;(e.target as HTMLFormElement).reset()
    } catch {
      toast.error("Something went wrong", {
        description: "Please try WhatsApp for quicker replies!",
        duration: 7000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section aria-labelledby="contact-heading" className="w-full">
      {/* Section header */}
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-2">Get in touch</p>
        <h2 id="contact-heading" className="text-3xl font-bold text-foreground sm:text-4xl">
          Let&apos;s Connect! 🌷
        </h2>
        <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
          Questions, custom orders, or just want to say hi? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Quick Links */}
        <div className="flex flex-col gap-4">
          {quickLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center gap-4 rounded-2xl border p-5 transition-all duration-300 hover:scale-[1.01] hover:shadow-md ${
                item.highlight
                  ? "border-primary/40 bg-primary/5 hover:bg-primary/10 hover:shadow-primary/15"
                  : "border-border bg-card hover:border-border/80"
              }`}
            >
              <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                item.highlight ? "bg-primary/15" : "bg-secondary"
              }`}>
                {item.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{item.label}</p>
                <p className="text-muted-foreground text-xs mt-0.5 truncate">{item.desc}</p>
              </div>
              <span className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                item.highlight
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground group-hover:bg-primary/10 group-hover:text-primary"
              }`}>
                {item.cta}
              </span>
            </Link>
          ))}

          {/* Contact details */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <h3 className="font-semibold text-sm text-foreground">Other ways to reach us</h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <span>hello@lilseonmul.com</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Phone className="w-4 h-4 text-primary shrink-0" />
              <span>+62 821 5435 9140</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 text-primary shrink-0" />
              <span>Mon–Sat, 9AM – 6PM WIB</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-5 text-foreground">Send us a message</h3>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-1.5">
              <label htmlFor="name" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Your Name
              </label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Budi Santoso"
                required
                className="rounded-xl border-border bg-background focus:border-primary/40 focus:ring-primary/20"
              />
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="rounded-xl border-border bg-background focus:border-primary/40 focus:ring-primary/20"
              />
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="message" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                placeholder="Ask about products, custom orders, or anything else 🌸"
                required
                rows={4}
                className="rounded-xl border-border bg-background focus:border-primary/40 focus:ring-primary/20 resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-5 text-sm font-semibold shadow-md shadow-primary/20 hover:scale-[1.01] transition-all"
            >
              {loading ? "Sending… 🌸" : "Send Message 💌"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Prefer instant replies?{" "}
              <Link
                href="https://wa.me/6282154359140?text=Hi%20Lil.Seonmul%21"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:text-primary/80"
              >
                Message us on WhatsApp
              </Link>
            </p>
          </form>
        </div>

      </div>
    </section>
  )
}