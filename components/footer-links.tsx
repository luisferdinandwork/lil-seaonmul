import Link from "next/link"
import { SiShopee, SiInstagram, SiTiktok } from "react-icons/si"

export function FooterLinks() {
  return (
    <footer className="mt-8 border-t border-border bg-secondary">
      <div className="container mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="text-lg font-semibold text-foreground">Lil.Seonmul</p>
            <p className="text-sm text-muted-foreground">
              Soft pastel gifts & services • Feminine-neutral design
            </p>
          </div>
          
          <nav aria-label="Business links" className="flex items-center gap-6">
            <Link
              href="https://shopee.co.id/litty.kitty10"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Shopee"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <SiShopee className="h-5 w-5" />
              <span className="hidden sm:inline">Shopee</span>
            </Link>
            
            <Link
              href="https://www.instagram.com/lil.seonmul"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <SiInstagram className="h-5 w-5" />
              <span className="hidden sm:inline">Instagram</span>
            </Link>
            
            <Link
              href="https://www.tiktok.com/@miaumiaullydcvx"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <SiTiktok className="h-5 w-5" />
              <span className="hidden sm:inline">TikTok</span>
            </Link>
          </nav>
        </div>
        
        <div className="mt-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Lil.Seonmul — Brand by Lily Octavia. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}