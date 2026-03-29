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
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-6">
        <Logo />

        <nav className="hidden xl:flex items-center gap-3">

          <div className="inline-flex items-center rounded-md bg-neutral-950 p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.28)] ring-1 ring-neutral-900 shrink-0">
            {CATEGORIES.map((cat) => {
              const href = `/${cat.slug}`;
              const active = isActive(href);
              return (
                <Link
                  key={cat.slug}
                  href={href}
                  className={`rounded-[3px] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.06em] transition-colors ${
                    active
                      ? "bg-white text-neutral-950"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
            <Link
              href="/#newsletter"
              className="ml-1 rounded-[3px] bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.06em] text-neutral-950 transition-colors hover:bg-neutral-200"
            >
              Subscribe
            </Link>
          </div>
        </nav>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-neutral-950 text-white transition-colors hover:bg-neutral-800 xl:hidden">
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
