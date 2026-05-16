"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="hb" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ff7a5a"/>
          <stop offset="60%" stopColor="#ff2d55"/>
          <stop offset="100%" stopColor="#c0143a"/>
        </radialGradient>
        <linearGradient id="hf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff5e3a"/>
          <stop offset="100%" stopColor="#c0143a"/>
        </linearGradient>
      </defs>
      {/* target rings — bull positioned lower-left */}
      <circle cx="12" cy="20" r="11" fill="none" stroke="#262b38" strokeWidth="1"/>
      <circle cx="12" cy="20" r="7" fill="none" stroke="#262b38" strokeWidth="1"/>
      <circle cx="12" cy="20" r="4.5" fill="none" stroke="#ff2d55" strokeWidth="0.8" opacity="0.45"/>
      {/* bull */}
      <circle cx="12" cy="20" r="3.2" fill="url(#hb)"/>
      <circle cx="12" cy="20" r="1.2" fill="#ffb02e"/>
      {/* dart at 45° — total length ~16, fits viewBox */}
      <g transform="translate(12 20) rotate(45)">
        <rect x="-0.7" y="-9" width="1.4" height="3" fill="#d0d5e0"/>
        <rect x="-1.5" y="-15" width="3" height="6" rx="0.5" fill="#3a4154"/>
        <rect x="-0.5" y="-17" width="1" height="2" fill="#d0d5e0"/>
        <g transform="translate(0 -17)">
          <path d="M0 0 L-3.8 -1.6 L-3.8 -6.4 L0 -3.6 Z" fill="url(#hf)"/>
          <path d="M0 0 L3.8 -1.6 L3.8 -6.4 L0 -3.6 Z" fill="#ff2d55"/>
        </g>
      </g>
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
