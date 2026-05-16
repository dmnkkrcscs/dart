import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mx-auto max-w-3xl px-4 pb-10 pt-6 text-center">
      <div className="hairline mb-4"/>
      <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-dim">
        <Link href="/" className="hover:text-ink">Start</Link>
        <span className="text-line">·</span>
        <Link href="/settings" className="hover:text-ink">Einstellungen</Link>
        <span className="text-line">·</span>
        <Link href="/datenschutz" className="hover:text-ink">Datenschutz</Link>
        <span className="text-line">·</span>
        <Link href="/impressum" className="hover:text-ink">Impressum</Link>
      </nav>
      <div className="mt-3 text-[10px] font-medium uppercase tracking-[0.18em] text-dim">
        gebaut mit <span className="text-accent">●</span> Coolify
      </div>
    </footer>
  );
}
