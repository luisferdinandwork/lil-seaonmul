import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Suspense } from "react"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { AuthProvider } from "@/app/auth-context"

export const metadata: Metadata = {
  title: {
    default: "Lil.Seonmul — Soft Pastel Gifts & Services",
    template: "%s | Lil.Seonmul",
  },
  description:
    "Lil.Seonmul by Lily Octavia — soft pastel gifts and services. Feminine-neutral design, product sales, and lead generation. Shop, connect on WhatsApp, and explore our gallery.",
  keywords: ["Lil.Seonmul", "Lily Octavia", "Seonmul", "pastel gifts", "soft pink", "branding", "women neutral"],
  icons: {
    icon: "/assets/logo.png",
  },
  openGraph: {
    title: "Lil.Seonmul — Soft Pastel Gifts & Services",
    description:
      "Attractive feminine-neutral design with soft pink pastels. Explore products, testimonials, and contact us via WhatsApp.",
    url: "https://example.com",
    siteName: "Lil.Seonmul",
    images: [
      {
        url: "/soft-pastel-banner-for-lil-seonmul.jpg",
        width: 1200,
        height: 630,
        alt: "Lil.Seonmul soft pastel banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lil.Seonmul — Soft Pastel Gifts & Services",
    description: "Pastel-forward gifts & branding with a feminine-neutral aesthetic. Shop, explore, and get in touch.",
    images: ["/soft-pastel-banner-for-lil-seonmul.jpg"],
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">
            <Suspense fallback={null}>{children}</Suspense>
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}