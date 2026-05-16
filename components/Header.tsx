"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff2d55"/>
          <stop offset="100%" stopColor="#ff5e3a"/>
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="#101218" stroke="#262b38" strokeWidth="1.5"/>
      <circle cx="16" cy="16" r="9" fill="#171a22"/>
      <circle cx="16" cy="16" r="5" fill="url(#lg)"/>
      <circle cx="16" cy="16" r="2" fill="#ffb02e"/>
    </svg>
  );
}

export default function Header({ title, back = true, right }: { title?: string; back?: boolean; right?: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  return (
    <header className="mb-5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {back && !isHome && (
          <button onClick={() => router.back()} className="btn-ghost !px-3 !py-2 !rounded-xl" aria-label="Zurück">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3l-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        )}
        <Link href="/" className="flex items-center gap-2.5">
          <Logo/>
          <span className="font-black tracking-tight text-[15px]">{title || "Bullseye"}</span>
        </Link>
      </div>
      <div className="flex items-center gap-2">{right}</div>
    </header>
  );
}
