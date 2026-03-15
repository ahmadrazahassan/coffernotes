"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { CATEGORIES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  const linkClass = (href: string) =>
    `text-[15px] transition-colors ${
      isActive(href)
        ? "text-brand-accent font-semibold"
        : "text-text-secondary hover:text-text-primary font-medium"
    }`;

  const searchArticles = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const supabase = createClient();
    const { data } = await supabase
      .from("articles")
      .select("title, slug, article_categories(category:categories(slug, name))")
      .eq("status", "published")
      .ilike("title", `%${query}%`)
      .limit(10);
    setSearchResults(data || []);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchArticles(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchArticles]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border h-16">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-full">
          <Logo />

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className={linkClass(`/${cat.slug}`)}
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl hidden md:flex"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search articles</span>
            </Button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger className="md:hidden inline-flex shrink-0 items-center justify-center rounded-xl border border-border bg-background hover:bg-muted size-8 transition-all outline-none">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col gap-6 mt-8">
                  <div>
                    <p className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
                      Categories
                    </p>
                    <div className="flex flex-col gap-4 pl-2">
                      {CATEGORIES.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/${cat.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className={linkClass(`/${cat.slug}`)}
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-xl mt-2"
                    onClick={() => {
                      setMobileOpen(false);
                      setSearchOpen(true);
                    }}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search articles
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput
          placeholder="Search articles..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>No articles found.</CommandEmpty>
          {searchResults.length > 0 && (
            <CommandGroup heading="Articles">
              {searchResults.map((article) => (
                <CommandItem
                  key={article.slug}
                  onSelect={() => {
                    const acArgs = article.article_categories as any;
                    const cat = acArgs && acArgs.length > 0 ? acArgs[0].category : null;
                    router.push(`/${cat?.slug || "uncategorized"}/${article.slug}`);
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="cursor-pointer"
                >
                  <div>
                    <p className="font-medium">{article.title}</p>
                    <p className="text-xs text-text-secondary">
                      {(() => {
                        const acArgs = article.article_categories as any;
                        const cat = acArgs && acArgs.length > 0 ? acArgs[0].category : null;
                        return cat ? cat.name : "Uncategorized";
                      })()}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
