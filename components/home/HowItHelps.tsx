export function HowItHelps() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary">
              Editorial standards
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight mt-3 leading-tight">
              How we research and write every article
            </h2>
            <p className="text-sm text-text-secondary mt-3 leading-relaxed">
              Crestwell exists to give UK business owners finance guidance they can act on. Every article follows the same editorial process.
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden border border-border">
              <div className="bg-white p-7">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-accent">01</p>
                <h3 className="text-base font-bold mt-3">HMRC-referenced</h3>
                <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                  Rates, thresholds, and rules are sourced from HMRC, GOV.UK, and current legislation. We cite our sources.
                </p>
              </div>
              <div className="bg-white p-7">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-accent">02</p>
                <h3 className="text-base font-bold mt-3">Decision-focused</h3>
                <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                  Every article answers a real question. We include worked examples, comparison tables, and step-by-step processes.
                </p>
              </div>
              <div className="bg-white p-7">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-accent">03</p>
                <h3 className="text-base font-bold mt-3">Kept current</h3>
                <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                  When tax years change or legislation updates, we revise affected articles. Dates and thresholds are never stale.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
