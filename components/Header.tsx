"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header({ title, back = true, right }: { title?: string; back?: boolean; right?: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  return (
    <header className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {back && !isHome && (
          <button onClick={() => router.back()} className="btn-ghost !px-3 !py-2" aria-label="Zurück">
            ←
          </button>
        )}
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-white font-black">B</span>
          <span className="font-black tracking-tight">{title || "Bullseye"}</span>
        </Link>
      </div>
      <div className="flex items-center gap-2">{right}</div>
    </header>
  );
}
