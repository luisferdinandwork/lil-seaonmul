"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, BookOpen, ShoppingBag, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "@/app/auth-context";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const navItems = [
    { href: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
    { href: "/blog", label: "Blog", icon: <BookOpen className="h-4 w-4" /> },
    { 
      href: "https://shopee.co.id/litty.kitty10", 
      label: "Shop", 
      icon: <ShoppingBag className="h-4 w-4" />,
      external: true 
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">LS</span>
              </div>
              <span className="font-bold text-lg">Lil.Seonmul</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="flex items-center space-x-1 text-foreground/80 hover:text-primary transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
            
            {/* Auth Buttons */}
            {user ? (
              <>
                <Button asChild size="sm" className="ml-2">
                  <Link href="/dashboard" className="flex items-center space-x-1">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout}
                  className="ml-2"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button asChild size="sm" className="ml-2">
                <Link href="/login" className="flex items-center space-x-1">
                  <span>Login</span>
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {/* Mobile Auth Buttons */}
              {user ? (
                <>
                  <Button asChild className="justify-start" onClick={() => setIsMenuOpen(false)}>
                    <Link href="/dashboard" className="flex items-center space-x-2">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </Button>
                </>
              ) : (
                <Button asChild className="justify-start" onClick={() => setIsMenuOpen(false)}>
                  <Link href="/login" className="flex items-center space-x-2">
                    <span>Login</span>
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}