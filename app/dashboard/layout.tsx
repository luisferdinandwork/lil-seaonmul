// app/dashboard/layout.tsx
"use client"

import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import DashboardNavbar from "@/components/dashboard/dashboard-navbar"
import { useAuth } from "@/app/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  const handleLogout = useCallback(() => {
    logout()
    router.push("/login")
  }, [logout, router])

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev)
  }, [])

  // Loading state
  if (loading || !isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        user={user}
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        onMobileOpenChange={setIsMobileSidebarOpen}
        onLogout={handleLogout}
      />

      {/* Main content area */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-[margin] duration-200 ease-in-out",
          // Desktop: offset by sidebar width
          isSidebarCollapsed ? "md:ml-16" : "md:ml-60",
          // Mobile: offset by mobile header
          "pt-14 md:pt-0"
        )}
      >
        {/* Dashboard top navbar (desktop only — mobile uses the sidebar header) */}
        <div className="sticky top-0 z-20">
          <DashboardNavbar
            onToggleSidebar={toggleSidebar}
            isSidebarCollapsed={isSidebarCollapsed}
          />
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          <div
            className={cn(
              "mx-auto w-full max-w-7xl",
              "px-4 sm:px-6 lg:px-8",
              "py-6 sm:py-8"
            )}
          >
            {children}
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t bg-muted/30 mt-auto">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-xs text-muted-foreground text-center">
              © {new Date().getFullYear()} Blog Admin. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}