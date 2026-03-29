import { SubscribeForm } from "@/components/shared/SubscribeForm";
import { SITE_NAME } from "@/lib/constants";

export function NewsletterSection() {
  return (
    <section id="newsletter" className="py-12 md:py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="bg-[#F2F4F7] rounded-[32px] px-6 py-12 md:py-16 lg:px-20 flex flex-col border border-neutral-200/60 items-center text-center mx-auto">

          <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-neutral-300/60 bg-white/80 backdrop-blur-sm text-[10px] font-extrabold text-neutral-700 uppercase tracking-[0.15em] shadow-sm cursor-default">
            Newsletter
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.02em] text-neutral-900 mb-5 leading-[1.1]">
            Independent accounting software insights, <br className="hidden md:block" />delivered every week.
          </h2>

          <p className="text-base md:text-lg text-neutral-600 mb-10 max-w-2xl font-medium leading-[1.6]">
            Get honest Sage, Xero and QuickBooks comparisons, Making Tax Digital compliance updates, UK payroll news, and practical small business finance guides — straight to your inbox. Written for UK sole traders and SMEs. Zero fluff.
          </p>

          <div className="w-full max-w-md">
            <SubscribeForm />
            <p className="text-[11px] text-neutral-500 mt-5 font-bold uppercase tracking-widest">
              ZERO SPAM. UNSUBSCRIBE AT ANY TIME.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
