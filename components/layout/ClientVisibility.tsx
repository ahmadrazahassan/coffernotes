"use client";

import { usePathname } from "next/navigation";

export function ClientVisibility({ 
  children, 
  hideOnPaths = ["/admin"] 
}: { 
  children: React.ReactNode;
  hideOnPaths?: string[];
}) {
  const pathname = usePathname();
  
  // Check if current path starts with any of the hideOnPaths
  const isHidden = hideOnPaths.some(path => pathname?.startsWith(path));
  
  if (isHidden) return null;
  
  return <>{children}</>;
}
