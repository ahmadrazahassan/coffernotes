import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { ArrowRight } from "lucide-react";

export function CategoryGrid() {
  return (
    <section id="topics" className="py-16 bg-surface border-y border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Explore by topic
          </h2>
          <p className="text-text-secondary mt-3 text-base leading-relaxed">
            Six core areas of UK small business finance. Every article is
            researched against current HMRC guidance and written for owners, not
            accountants.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border mt-10 rounded-2xl overflow-hidden border border-border">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="bg-white p-8 hover:bg-tag-bg/50 transition-colors group flex flex-col"
            >
              <h3 className="text-lg font-bold group-hover:text-brand-accent transition-colors">
                {cat.name}
              </h3>
              <p className="text-sm text-text-secondary mt-2 leading-relaxed flex-1">
                {cat.description}
              </p>
              <span className="flex items-center gap-1.5 text-brand-accent text-sm font-medium mt-5">
                Browse articles
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
