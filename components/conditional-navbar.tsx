// components/conditional-navbar.tsx
"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"

export function ConditionalNavbar() {
  const pathname = usePathname()

  // Hide the navbar on all dashboard routes
  if (pathname?.startsWith("/dashboard")) {
    return null
  }

  return <Navbar />
}