// sections/home/contact-form.tsx
"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import Link from "next/link"
import { Mail, Phone, ShoppingBag, MessageCircle, Clock, Send, Loader2, ArrowRight } from "lucide-react"

const quickLinks = [
  {
    Icon: ShoppingBag,
    label: "Toko Shopee",
    desc: "Jelajahi & beli seluruh koleksi kami",
    href: "https://shopee.co.id/litty.kitty10",
    cta: "Kunjungi Toko",
    highlight: true,
  },
  {
    Icon: MessageCircle,
    label: "WhatsApp",
    desc: "Chat untuk balasan cepat & pesanan custom",
    href: "https://wa.me/6282154359140?text=Halo%20Lil.Seonmul%21%20Saya%20ingin%20tahu%20lebih%20lanjut.",
    cta: "Chat Sekarang",
    highlight: false,
  },
]

export function ContactForm() {
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = {
      name:    String(form.get("name")    || ""),
      email:   String(form.get("email")   || ""),
      message: String(form.get("message") || ""),
    }
    try {
      setLoading(true)
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      toast.success("Pesan terkirim!", {
        description: "Terima kasih sudah menghubungi kami. Kami akan segera membalas.",
        duration: 5000,
      })
      ;(e.target as HTMLFormElement).reset()
    } catch {
      toast.error("Terjadi kesalahan", {
        description: "Coba hubungi kami via WhatsApp untuk balasan lebih cepat.",
        duration: 7000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section aria-labelledby="contact-heading" className="w-full">
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-2">Hubungi kami</p>
        <h2 id="contact-heading" className="text-2xl sm:text-3xl font-bold text-foreground">
          Ayo terhubung
        </h2>
        <p className="mt-3 text-muted-foreground text-sm max-w-md mx-auto">
          Pertanyaan, pesanan custom, atau sekadar mau sapa? Kami senang mendengar dari kamu.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Tautan cepat + info kontak */}
        <div className="flex flex-col gap-4">
          {quickLinks.map(({ Icon, label, desc, href, cta, highlight }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center gap-4 rounded-2xl border p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
                highlight
                  ? "border-primary/40 bg-primary/5 hover:shadow-primary/15"
                  : "border-border bg-card hover:border-border/80"
              }`}
            >
              <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${
                highlight ? "bg-primary/15" : "bg-secondary"
              }`}>
                <Icon className={`w-5 h-5 ${highlight ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{label}</p>
                <p className="text-muted-foreground text-xs mt-0.5 truncate">{desc}</p>
              </div>
              <span className={`shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors ${
                highlight
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground group-hover:bg-primary/10 group-hover:text-primary"
              }`}>
                {cta}
                <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}

          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <h3 className="font-semibold text-sm text-foreground">Cara lain menghubungi kami</h3>
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
              <span>Senin–Sabtu, 09.00 – 18.00 WIB</span>
            </div>
          </div>
        </div>

        {/* Formulir kontak */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-base font-semibold mb-5 text-foreground">Kirim pesan</h3>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-1.5">
              <label htmlFor="name" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Nama kamu
              </label>
              <Input id="name" name="name" placeholder="cth. Budi Santoso" required
                className="rounded-xl border-border bg-background focus:border-primary/40 focus:ring-primary/20" />
            </div>
            <div className="grid gap-1.5">
              <label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Alamat email
              </label>
              <Input id="email" name="email" type="email" placeholder="kamu@contoh.com" required
                className="rounded-xl border-border bg-background focus:border-primary/40 focus:ring-primary/20" />
            </div>
            <div className="grid gap-1.5">
              <label htmlFor="message" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Pesan
              </label>
              <Textarea id="message" name="message" rows={4} required
                placeholder="Tanya soal produk, pesanan custom, atau hal lainnya"
                className="rounded-xl border-border bg-background focus:border-primary/40 focus:ring-primary/20 resize-none" />
            </div>
            <Button type="submit" disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-5 text-sm font-semibold shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all gap-2">
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Mengirim…</>
              ) : (
                <><Send className="w-4 h-4" />Kirim Pesan</>
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Mau balasan lebih cepat?{" "}
              <Link href="https://wa.me/6282154359140?text=Halo%20Lil.Seonmul%21"
                target="_blank" rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:text-primary/80">
                Chat kami di WhatsApp
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}