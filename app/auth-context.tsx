// app/auth-context.tsx
"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

export type User = {
  id: string
  name: string
  email: string
  role: string
  bio?: string | null
  avatar?: string | null
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const PUBLIC_PATHS = ["/login", "/"]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token")
    setUser(null)
    document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
    if (pathname.startsWith("/dashboard")) {
      router.push("/login")
    }
  }, [pathname, router])

  // Fungsi login yang menangani fetch API dan setState sekaligus
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        return false
      }

      // Simpan token & user ke state dan localStorage secara sinkron
      localStorage.setItem("auth_token", data.token)
      setUser(data.user)
      return true
    } catch (error) {
      console.error("Login fetch error:", error)
      return false
    }
  }, [])

  // Efek untuk mengecek sesi saat pertama kali mount / refresh / pindah halaman
  useEffect(() => {
    const isPublicPath = PUBLIC_PATHS.includes(pathname)
    const hasToken = typeof window !== "undefined" && localStorage.getItem("auth_token")

    if (isPublicPath && !hasToken) {
      setLoading(false)
      return
    }

    const fetchMe = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/me`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          cache: "no-store"
        })

        if (res.ok) {
          const userData = await res.json()
          setUser(userData)
        } else {
          localStorage.removeItem("auth_token")
          setUser(null)
          if (pathname.startsWith("/dashboard")) {
            router.push("/login")
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        localStorage.removeItem("auth_token")
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchMe()
  }, [pathname, router])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}