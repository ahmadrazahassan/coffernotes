"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Logo } from "./Logo";
import { CATEGORIES } from "@/lib/constants";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 bg-transparent">
      <div className="mx-auto flex h-20 max-w-[90rem] items-center justify-between gap-4 px-6 md:px-8">
        <Logo />

        <nav className="hidden xl:flex items-center gap-3">

          <div className="inline-flex items-center rounded-full bg-primary/85 backdrop-blur-md p-1.5 shadow-[0_8px_32px_rgba(0,85,255,0.3)] ring-1 ring-white/20 shrink-0 transition-all duration-300">
            {CATEGORIES.map((cat) => {
              const href = `/${cat.slug}`;
              const active = isActive(href);
              return (
                <Link
                  key={cat.slug}
                  href={href}
                  className={`rounded-full px-4 py-2 text-[12px] font-bold uppercase tracking-[0.06em] transition-all duration-300 ${
                    active
                      ? "bg-white text-primary shadow-sm"
                      : "text-white/90 hover:bg-white/20 hover:text-white hover:shadow-sm"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
            <Link
              href="/#newsletter"
              className="ml-2 rounded-full bg-white px-5 py-2 text-[12px] font-bold uppercase tracking-[0.06em] text-primary transition-all duration-300 hover:bg-neutral-50 hover:scale-105 hover:shadow-md active:scale-95"
            >
              Subscribe
            </Link>
          </div>
        </nav>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/90 text-white backdrop-blur-md transition-all duration-300 hover:bg-primary xl:hidden">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Open navigation menu</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 border-l-neutral-200">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="mt-8 flex flex-col gap-3">

              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-md border px-4 py-3 text-sm font-semibold uppercase tracking-[0.04em] transition-colors ${
                    isActive(`/${cat.slug}`)
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 text-neutral-900 hover:border-neutral-900 hover:bg-neutral-50"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                href="/#newsletter"
                onClick={() => setMobileOpen(false)}
                className="mt-2 rounded-md bg-neutral-950 px-4 py-3 text-center text-sm font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-neutral-800"
              >
                Subscribe
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
