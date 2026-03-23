import { SubscribeForm } from "@/components/shared/SubscribeForm";

export function NewsletterSection() {
  return (
    <section className="py-16 bg-surface border-y border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary">
              Newsletter
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight mt-3">
              New articles, straight to your inbox
            </h2>
            <p className="text-sm text-text-secondary mt-2 leading-relaxed">
              We publish weekly. One email per article. Unsubscribe anytime.
            </p>
          </div>
          <div className="lg:col-span-7 lg:pl-8 lg:border-l lg:border-border">
            <SubscribeForm />
            <p className="text-[11px] text-text-secondary mt-3">
              Join business owners across the UK who use Crestwell to stay on top of finance compliance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
