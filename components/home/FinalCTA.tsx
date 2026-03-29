import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
              Find the guide you need
            </h2>
            <p className="text-text-secondary mt-3 text-base leading-relaxed">
              Every article is organised by topic. Pick a category below to browse HMRC guidance, step-by-step processes, and software comparisons.
            </p>
            <Link
              href="/accounting"
              className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-brand-accent hover:text-accent-hover transition-colors"
            >
              Browse all articles <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className="group rounded-xl border border-border p-5 hover:border-brand-accent/30 hover:bg-tag-bg/30 transition-all"
                >
                  <h3 className="text-sm font-bold group-hover:text-brand-accent transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-text-secondary mt-1 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
