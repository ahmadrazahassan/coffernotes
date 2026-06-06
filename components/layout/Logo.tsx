import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 shrink-0 ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <path d="M15 35 Q 25 80 50 85 Q 40 50 30 35 Z" fill="#cce0ff"/>
        <path d="M85 35 Q 75 80 50 85 Q 60 50 70 35 Z" fill="#cce0ff"/>
        <path d="M50 25 Q 65 50 50 85 Q 35 50 50 25 Z" fill="#cce0ff"/>
        <path d="M50 40 C 70 65 65 90 50 90 C 35 90 30 65 50 40 Z" fill="#0055ff"/>
      </svg>
      <span className="text-[14px] font-bold tracking-[0.04em] whitespace-nowrap">Accounting software Pilot</span>
    </Link>
  );
}
