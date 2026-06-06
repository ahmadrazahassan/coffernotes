"use client";

import { useEffect } from "react";

// In development, Next.js intercepts console.error to show the error overlay.
// If an adblocker blocks the Cloudinary widget script, next-cloudinary calls console.error.
// This intercepts that specific error BEFORE Next.js shows the overlay, silencing it.
if (typeof window !== "undefined") {
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Failed to load Cloudinary Upload Widget")
    ) {
      return; // Ignore this specific error so Next.js doesn't show the error overlay
    }
    originalConsoleError.apply(console, args);
  };
}

export function CloudinaryErrorBoundaryFix() {
  // We use useEffect to ensure this component is recognized as a client component
  // but the actual override runs during initial execution to catch early errors.
  useEffect(() => {}, []);
  return null;
}
