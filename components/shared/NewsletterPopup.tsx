"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { SubscribeForm } from "@/components/shared/SubscribeForm";
import { Logo } from "@/components/layout/Logo";

export function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if the user has already seen the popup
    const hasSeenPopup = localStorage.getItem("newsletter_popup_seen");
    
    if (!hasSeenPopup) {
      // Show the popup after a short delay
      const timer = setTimeout(() => {
        setOpen(true);
        // Save immediately so it won't show again on refresh
        localStorage.setItem("newsletter_popup_seen", "true");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      localStorage.setItem("newsletter_popup_seen", "true");
    }
  };

  if (!mounted) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* 
        Increased width to md:max-w-[850px], added unique large rounding (rounded-[36px]), 
        and removed default background/shadow to let the inner container style it. 
      */}
      <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden border-0 bg-transparent shadow-none" showCloseButton={false}>
        <div className="sr-only">
          <DialogTitle>Subscribe to our newsletter</DialogTitle>
          <DialogDescription>
            Get honest Sage, Xero and QuickBooks comparisons, and practical small business finance guides.
          </DialogDescription>
        </div>

        <div className="relative flex flex-col md:flex-row w-full bg-white rounded-[36px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-neutral-200/50">
          
          {/* Close button manually placed since we hid the default one to fit the custom design */}
          <button 
            onClick={() => handleOpenChange(false)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-neutral-100/50 hover:bg-neutral-200 text-neutral-500 transition-colors"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4L4 12M4 4l8 8"/>
            </svg>
          </button>

          {/* Left Side - Modern Visual Accent */}
          <div className="hidden md:flex flex-col justify-between w-[40%] bg-gradient-to-br from-[#0055ff] via-[#407BFF] to-[#0A2540] p-10 relative overflow-hidden">
            {/* Decorative shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/30 to-transparent"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-[10px] font-extrabold text-white uppercase tracking-[0.15em] shadow-sm cursor-default">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                Weekly Briefing
              </div>
            </div>

            <div className="relative z-10 mt-20">
              <h3 className="text-3xl font-extrabold tracking-tight mb-4 text-white leading-[1.15]">
                Stay ahead of the curve.
              </h3>
              <p className="text-white/80 text-sm font-medium leading-relaxed">
                Join thousands of UK sole traders and SMEs getting the best independent finance insights.
              </p>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="flex-1 px-8 py-12 md:px-12 md:py-14 relative bg-white flex flex-col justify-center">
            {/* subtle background accent */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#F2F4F7]/60 to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <div className="mb-8 scale-110 origin-left">
                <Logo />
              </div>

              <h2 className="text-[28px] md:text-3xl font-extrabold tracking-tight text-neutral-900 mb-4 leading-tight">
                Independent accounting software insights, <br className="hidden md:block" />delivered weekly.
              </h2>

              <p className="text-sm text-neutral-600 mb-8 max-w-[400px] font-medium leading-[1.6]">
                Get honest Sage, Xero and QuickBooks comparisons, Making Tax Digital compliance updates, UK payroll news, and practical small business finance guides — straight to your inbox. Zero fluff.
              </p>

              <div className="w-full">
                <SubscribeForm 
                  onSuccess={() => {
                    setTimeout(() => handleOpenChange(false), 1200);
                  }}
                />
                <p className="text-[10px] text-neutral-400 mt-4 font-bold uppercase tracking-widest">
                  ZERO SPAM. UNSUBSCRIBE AT ANY TIME.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </DialogContent>
    </Dialog>
  );
}
