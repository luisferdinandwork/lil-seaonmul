// app/dashboard/layout.tsx
"use client"

import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import { useAuth } from "@/app/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle mounting state for hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Handle logout with callback
  const handleLogout = useCallback(() => {
    logout();
    router.push('/login');
  }, [logout, router]);

  // Listen for logout event from sidebar
  useEffect(() => {
    const handleLogoutEvent = () => {
      handleLogout();
    };

    window.addEventListener('logout', handleLogoutEvent);
    return () => {
      window.removeEventListener('logout', handleLogoutEvent);
    };
  }, [handleLogout]);

  // Listen for sidebar collapse state changes
  useEffect(() => {
    const handleSidebarCollapse = (e: CustomEvent) => {
      setIsSidebarCollapsed(e.detail.collapsed);
    };

    window.addEventListener('sidebar-collapse', handleSidebarCollapse as EventListener);
    return () => {
      window.removeEventListener('sidebar-collapse', handleSidebarCollapse as EventListener);
    };
  }, []);

  // Loading state
  if (loading || !isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar user={user} onLogout={handleLogout} />
      
      {/* Main Content Area */}
      <main className={cn(
        "flex-1 flex flex-col transition-all duration-300 ease-in-out",
        "w-full",
        // Desktop margins based on sidebar state
        isSidebarCollapsed ? "md:ml-20" : "md:ml-64",
        // Mobile padding for fixed header
        "pt-16 md:pt-0"
      )}>
        {/* Content Container */}
        <div className="flex-1 overflow-y-auto">
          <div className={cn(
            "container mx-auto",
            // Responsive padding
            "px-4 sm:px-6 lg:px-8",
            "py-6 sm:py-8 lg:py-10",
            // Max width for better readability on large screens
            "max-w-7xl"
          )}>
            {children}
          </div>
        </div>

        {/* Optional Footer */}
        <footer className="border-t bg-muted/30 mt-auto">
          <div className={cn(
            "container mx-auto",
            "px-4 sm:px-6 lg:px-8",
            "py-4"
          )}>
            <p className="text-xs sm:text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} Blog Admin. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}