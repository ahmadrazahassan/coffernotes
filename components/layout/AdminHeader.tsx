"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, LayoutDashboard, Folder, Mail, LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Logo } from "./Logo";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Articles", href: "/admin/articles" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Links", href: "/admin/links" },
  { label: "Subscribers", href: "/admin/subscribers" },
];

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide header if scrolling down and past 80px
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <>
      {/* Desktop Floating Header */}
      <div 
        className={`hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isVisible ? "translate-y-0" : "-translate-y-[150%]"
        }`}
      >
        <div className="flex items-center gap-2 p-1.5 bg-white/80 backdrop-blur-xl border border-neutral-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-2xl">
          {/* Logo container */}
          <div className="pl-4 pr-3 py-1 flex items-center border-r border-neutral-200/50">
            <Logo className="transition-opacity hover:opacity-80 scale-75 origin-left" />
          </div>

          {/* Nav Links */}
          <nav className="flex items-center gap-1 px-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive(item.href)
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Action container */}
          <div className="pl-2 flex items-center">
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl text-sm font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-all flex items-center gap-2"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Floating Header (Bottom or Top, let's keep it top for mobile) */}
      <div 
        className={`md:hidden fixed top-4 left-4 right-4 z-50 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isVisible ? "translate-y-0" : "-translate-y-[150%]"
        }`}
      >
        <div className="flex items-center justify-between p-2 bg-white/80 backdrop-blur-xl border border-neutral-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-2xl px-4">
          <Logo className="transition-opacity hover:opacity-80 scale-75 origin-left" />

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger className="p-2 rounded-xl hover:bg-neutral-100 transition-colors">
              <Menu className="w-5 h-5 text-neutral-700" />
            </SheetTrigger>
            <SheetContent side="top" className="rounded-b-3xl border-b-neutral-100 p-6 pt-12">
              <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
              <nav className="flex flex-col gap-2">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-2xl text-base font-medium transition-all ${
                      isActive(item.href)
                        ? "bg-neutral-100 text-neutral-900"
                        : "text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="h-px bg-neutral-100 my-2" />
                <button
                  onClick={handleLogout}
                  className="px-4 py-3 rounded-2xl text-base font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-all flex items-center gap-3 text-left w-full"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}
