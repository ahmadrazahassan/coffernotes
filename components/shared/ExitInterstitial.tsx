"use client";

import { useEffect, useState } from "react";
import { SITE_NAME } from "@/lib/constants";

interface ExitInterstitialProps {
  slug: string;
  destination: string;
  label: string | null;
  displayDomain: string;
}

export function ExitInterstitial({
  slug,
  destination,
  label,
  displayDomain,
}: ExitInterstitialProps) {
  const [progress, setProgress] = useState(0);
  const [seconds, setSeconds] = useState(3);

  useEffect(() => {
    // Smooth progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 100 / 30; // 30 steps over 3 seconds
      });
    }, 100);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    // Redirect after 3 seconds
    const timeout = setTimeout(() => {
      window.location.href = destination;
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(countdownInterval);
      clearTimeout(timeout);
    };
  }, [destination]);

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        {/* Finlytic brand mark */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="white"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.1 13.2c0-5.3 3.7-8.9 7.2-9.6 2.8-.6 4.6 1.8 5 4.8.3 2.8.4 6.1.8 8.3.3 1.9 1 3.3 2.5 4.3.6.4.7 1.2.2 1.7-2.1 1.9-6 1.8-9 .4-3.7-1.8-6.7-5-6.7-10Zm11 2.2c.6-2.5 2.4-4.6 4.8-5.6 1-.4 2 .5 1.8 1.5-.6 3.4-2.5 6.6-5.4 8.2-1 .6-2.2-.1-2.2-1.2 0-.9.4-1.9 1-2.9Z"
            />
          </svg>
          <span className="text-white text-lg font-bold tracking-[0.04em]">
            {SITE_NAME}
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-6 h-6 text-neutral-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </div>

          <h1 className="text-xl font-semibold text-neutral-900 tracking-tight mb-2">
            You&apos;re leaving {SITE_NAME}
          </h1>
          <p className="text-neutral-500 text-sm mb-1">
            {label
              ? `Redirecting to ${label}`
              : `Redirecting to an external site`}
          </p>
          <p className="text-neutral-400 text-xs font-mono mb-6 truncate px-4">
            {displayDomain}
          </p>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-neutral-900 rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          <p className="text-neutral-400 text-xs mb-8">
            Redirecting in {seconds} second{seconds !== 1 ? "s" : ""}…
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <a
              href={destination}
              className="flex items-center justify-center h-11 px-6 rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 transition-all shadow-sm text-sm font-medium gap-2"
            >
              Continue to site
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </a>
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center h-11 px-6 rounded-xl bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900 transition-all text-sm font-medium"
            >
              ← Go back to article
            </button>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-neutral-500 text-xs mt-8 max-w-sm mx-auto leading-relaxed">
          This link takes you to an external website. {SITE_NAME} may earn a
          commission from qualifying purchases at no extra cost to you.
        </p>
      </div>
    </div>
  );
}
