"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import Link from "next/link"
import { MapPin, Clock, Mail, Phone } from "lucide-react"

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
      
      toast.success("Message sent!", {
        description: "Thanks for reaching out. We will respond shortly.",
        duration: 5000,
      })
      
      e.currentTarget.reset()
    } catch (err) {
      toast.error("Something went wrong", {
        description: "Please try again or use WhatsApp for quicker replies.",
        duration: 7000,
      })
    } finally {
      setLoading(false)
    }
  }

  const waLink = "https://wa.me/6282154359140?text=Hi%20Lil.Seonmul%21%20I%27d%20like%20to%20learn%20more."

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Contact Form */}
      <div className="rounded-xl border bg-card p-6 ring-1 ring-border">
        <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input id="name" name="name" placeholder="Your name" required />
          </div>

          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>

          <div className="grid gap-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <Textarea id="message" name="message" placeholder="Tell us what you need" required />
          </div>

          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {loading ? "Sending…" : "Send message"}
            </Button>
            <Link
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center text-sm underline underline-offset-4 text-foreground/80 hover:text-foreground"
              aria-label="Contact on WhatsApp"
            >
              Prefer WhatsApp? Tap here.
            </Link>
          </div>
        </form>
      </div>

      {/* Map and Contact Info */}
      <div className="space-y-6">
        {/* Google Maps Embed */}
        <div className="rounded-xl overflow-hidden border border-border h-80">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260318288!2d106.81603531531584!3d-6.194741395496371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d2e764b11d%3A0x3d2ad6e79e0bef9e!2sJakarta%2C%20Indonesia!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps location of Lil.Seonmul"
          ></iframe>
        </div>

        {/* Contact Information */}
        <div className="rounded-xl border bg-card p-6 ring-1 ring-border">
          <h2 className="text-2xl font-bold mb-4">Visit our store</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Address</h3>
                <p className="text-muted-foreground">123 Soft Pastel Street, Jakarta, Indonesia 12345</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Opening Hours</h3>
                <p className="text-muted-foreground">Monday - Saturday: 9AM - 6PM</p>
                <p className="text-muted-foreground">Sunday: Closed</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-muted-foreground">hello@lilseonmul.com</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Phone</h3>
                <p className="text-muted-foreground">+62 821 5435 9140</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}