// components/dashboard-sidebar.tsx
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Home, 
  FileText, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useState, useCallback, useMemo, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  bio: string | null;
  avatar: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DashboardSidebarProps {
  className?: string;
  user: User;
  onLogout?: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Posts', href: '/dashboard/posts', icon: FileText },
  { name: 'Authors', href: '/dashboard/authors', icon: Users },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
] as const;

export default function DashboardSidebar({ 
  className, 
  user,
  onLogout 
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const userInitials = useMemo(() => {
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [user.name]);

  // Notify layout about collapse state changes
  useEffect(() => {
    const event = new CustomEvent('sidebar-collapse', {
      detail: { collapsed: isCollapsed }
    });
    window.dispatchEvent(event);
  }, [isCollapsed]);

  const handleLogout = useCallback(() => {
    if (onLogout) {
      onLogout();
    } else {
      const logoutEvent = new CustomEvent('logout');
      window.dispatchEvent(logoutEvent);
    }
  }, [onLogout]);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // Navigation Items Component
  const NavigationItems = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-1 overflow-y-auto">
      {navigation.map((item) => {
        const isActive = pathname === item.href || 
          (item.href !== '/dashboard' && pathname.startsWith(item.href));
        
        const NavLink = (
          <Link
            href={item.href}
            className={cn(
              "flex items-center px-3 py-2.5 sm:py-2 text-sm font-medium rounded-lg transition-all duration-200",
              "hover:scale-[1.02] active:scale-[0.98]",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              isCollapsed && !mobile && "justify-center px-2"
            )}
            onClick={() => mobile && closeMobileSidebar()}
          >
            <item.icon className={cn(
              "h-5 w-5 flex-shrink-0",
              !isCollapsed && !mobile && "mr-3"
            )} />
            {(!isCollapsed || mobile) && <span className="truncate">{item.name}</span>}
          </Link>
        );

        if (isCollapsed && !mobile) {
          return (
            <TooltipProvider key={item.name} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  {NavLink}
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10}>
                  <p>{item.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }

        return <div key={item.name}>{NavLink}</div>;
      })}
    </nav>
  );

  // User Profile Section Component
  const UserProfile = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="p-3 sm:p-4 border-t bg-muted/30">
      <div className={cn(
        "flex items-center gap-3 mb-3 p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer",
        isCollapsed && !mobile && "justify-center p-2"
      )}>
        <Avatar className={cn(
          "border-2 border-background shadow-sm flex-shrink-0",
          isCollapsed && !mobile ? "h-8 w-8" : "h-10 w-10"
        )}>
          <AvatarImage src={user.avatar || undefined} alt={user.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs sm:text-sm">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        {(!isCollapsed || mobile) && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        )}
      </div>

      <div className={cn(
        "flex gap-2",
        isCollapsed && !mobile && "flex-col"
      )}>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size={isCollapsed && !mobile ? "icon" : "sm"}
                className={cn(
                  "flex-1 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
                  "focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  isCollapsed && !mobile ? "w-full" : "justify-start"
                )}
                asChild
              >
                <Link href="/" onClick={() => mobile && closeMobileSidebar()}>
                  <Globe className={cn(
                    "h-4 w-4 flex-shrink-0",
                    !isCollapsed && !mobile && "mr-2"
                  )} />
                  {(!isCollapsed || mobile) && <span className="truncate">View Site</span>}
                </Link>
              </Button>
            </TooltipTrigger>
            {isCollapsed && !mobile && (
              <TooltipContent side="right" sideOffset={10}>
                <p>View Site</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size={isCollapsed && !mobile ? "icon" : "sm"}
                className={cn(
                  "flex-1 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
                  "focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  isCollapsed && !mobile ? "w-full" : "justify-start"
                )}
                onClick={() => {
                  handleLogout();
                  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                  mobile && closeMobileSidebar();
                }}
              >
                <LogOut className={cn(
                  "h-4 w-4 flex-shrink-0",
                  !isCollapsed && !mobile && "mr-2"
                )} />
                {(!isCollapsed || mobile) && <span className="truncate">Logout</span>}
              </Button>
            </TooltipTrigger>
            {isCollapsed && !mobile && (
              <TooltipContent side="right" sideOffset={10}>
                <p>Logout</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header with Menu Toggle */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-sm border-b z-50 flex items-center px-4 shadow-sm">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2 hover:bg-accent"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
            <SheetHeader className="p-4 sm:p-6 border-b bg-muted/30">
              <SheetTitle className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-md flex-shrink-0">
                  <FileText className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-base sm:text-lg font-bold">Blog Admin</span>
              </SheetTitle>
              <SheetDescription className="text-left text-xs sm:text-sm">
                Manage your blog content and settings
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col h-[calc(100%-140px)]">
              <NavigationItems mobile />
              <UserProfile mobile />
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-base sm:text-lg">Blog Admin</span>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex md:flex-col md:fixed md:inset-y-0 md:bg-background md:border-r transition-all duration-300 ease-in-out z-40",
        isCollapsed ? "md:w-20" : "md:w-64 lg:w-72",
        className
      )}>
        <div className="flex flex-col h-full">
          {/* Logo/Brand Header */}
          <div className={cn(
            "flex items-center h-16 border-b transition-all duration-300",
            isCollapsed ? "justify-center px-2" : "px-4 lg:px-6"
          )}>
            <Link 
              href="/dashboard" 
              className={cn(
                "flex items-center gap-3 hover:opacity-80 transition-opacity",
                isCollapsed && "gap-0"
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-md flex-shrink-0">
                <FileText className="h-6 w-6 text-primary-foreground" />
              </div>
              {!isCollapsed && (
                <span className="font-bold text-base lg:text-lg whitespace-nowrap">
                  Blog Admin
                </span>
              )}
            </Link>
          </div>

          {/* Collapse Toggle Button */}
          <div className={cn(
            "flex p-2 border-b",
            isCollapsed ? "justify-center" : "justify-end"
          )}>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleCollapse}
                    className="h-8 w-8 hover:bg-accent focus:ring-2 focus:ring-primary"
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                  >
                    {isCollapsed ? (
                      <ChevronRight className="h-4 w-4" />
                    ) : (
                      <ChevronLeft className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10}>
                  <p>{isCollapsed ? "Expand sidebar" : "Collapse sidebar"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <NavigationItems />
          <UserProfile />
        </div>
      </aside>
    </>
  );
}