import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <svg
        width="28"
        height="24"
        viewBox="0 0 28 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* Left page */}
        <path d="M14 4L3 6v14l11-2" />
        {/* Right page */}
        <path d="M14 4l11 2v14l-11-2" />
        {/* Spine */}
        <path d="M14 4v16" />
      </svg>
      <span className="text-lg tracking-tight">
        <span className="font-extrabold">Coffer</span>
        <span className="font-normal">Notes</span>
      </span>
    </Link>
  );
}
