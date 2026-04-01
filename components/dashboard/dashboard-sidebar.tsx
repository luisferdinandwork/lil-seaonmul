// components/dashboard/dashboard-sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  Globe,
  X,
  Image,
  LayoutDashboard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useMemo } from "react"
import { type User } from "@/app/auth-context" // <-- PINDAHKAN IMPORT KE SINI

interface DashboardSidebarProps {
  className?: string
  user: User // <-- Sekarang aman, mengikuti tipe dari auth-context
  isCollapsed: boolean
  isMobileOpen: boolean
  onMobileOpenChange: (open: boolean) => void
  onLogout: () => void
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Posts", href: "/dashboard/posts", icon: FileText },
  { name: "Home CMS", href: "/dashboard/home-cms", icon: Image }, // <-- DITAMBAHKAN
  { name: "Authors", href: "/dashboard/authors", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
] as const

export default function DashboardSidebar({
  className,
  user,
  isCollapsed,
  isMobileOpen,
  onMobileOpenChange,
  onLogout,
}: DashboardSidebarProps) {
  const pathname = usePathname()

  // Defensive coding jika user.name ternyata undefined
  const userInitials = useMemo(() => {
    return (user?.name || "")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }, [user?.name])

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href))

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {navigation.map((item) => {
        const active = isActive(item.href)

        const link = (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => mobile && onMobileOpenChange(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              isCollapsed && !mobile && "justify-center px-2 gap-0"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {(!isCollapsed || mobile) && <span className="truncate">{item.name}</span>}
          </Link>
        )

        if (isCollapsed && !mobile) {
          return (
            <TooltipProvider key={item.name} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  {item.name}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        }

        return <div key={item.name}>{link}</div>
      })}
    </nav>
  )

  const UserSection = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="border-t p-3 space-y-2">
      <div className={cn("flex items-center gap-3 px-2 py-1.5 rounded-lg", isCollapsed && !mobile && "justify-center px-0")}>
        <Avatar className={cn("shrink-0", isCollapsed && !mobile ? "h-7 w-7" : "h-8 w-8")}>
          <AvatarImage src={user?.avatar || undefined} alt={user?.name} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        {(!isCollapsed || mobile) && (
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        )}
      </div>

      <div className={cn("flex gap-1.5", isCollapsed && !mobile && "flex-col items-center")}>
        {isCollapsed && !mobile ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                  <Link href="/"><Globe className="h-4 w-4" /></Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>View Site</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button variant="ghost" size="sm" className="flex-1 justify-start gap-2 text-muted-foreground" asChild>
            <Link href="/" onClick={() => mobile && onMobileOpenChange(false)}>
              <Globe className="h-4 w-4" /> View Site
            </Link>
          </Button>
        )}

        {isCollapsed && !mobile ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={onLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>Logout</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button variant="ghost" size="sm" className="flex-1 justify-start gap-2 text-muted-foreground hover:text-destructive" onClick={() => { onLogout(); if (mobile) onMobileOpenChange(false) }}>
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden" onClick={() => onMobileOpenChange(false)} />
      )}

      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-background/95 backdrop-blur-sm border-b z-50 flex items-center px-4 gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onMobileOpenChange(!isMobileOpen)} aria-label="Toggle menu">
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm">Blog Admin</span>
        </Link>
      </header>

      <aside className={cn("fixed inset-y-0 left-0 z-50 w-64 bg-background border-r flex flex-col transition-transform duration-200 ease-in-out md:hidden", isMobileOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex items-center gap-3 h-14 px-4 border-b">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm">Blog Admin</span>
        </div>
        <NavItems mobile />
        <UserSection mobile />
      </aside>

      <aside className={cn("hidden md:flex md:flex-col md:fixed md:inset-y-0 bg-background border-r z-40 transition-[width] duration-200 ease-in-out", isCollapsed ? "w-16" : "w-60", className)}>
        <div className={cn("flex items-center h-14 border-b transition-all duration-200", isCollapsed ? "justify-center px-2" : "px-4")}>
          <Link href="/dashboard" className={cn("flex items-center gap-2.5", isCollapsed && "gap-0")}>
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            {!isCollapsed && <span className="font-semibold text-sm whitespace-nowrap">Blog Admin</span>}
          </Link>
        </div>
        <NavItems />
        <UserSection />
      </aside>
    </>
  )
}