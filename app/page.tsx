"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { useDB } from "@/lib/store";

const MODES = [
  { href: "/play/x01?start=501", label: "501", sub: "Klassik · Double-Out", color: "bg-accent" },
  { href: "/play/x01?start=301", label: "301", sub: "Schneller Klassiker", color: "bg-accent2 text-black" },
  { href: "/play/cricket",        label: "Cricket", sub: "20er bis 15er + Bull", color: "bg-good" },
  { href: "/play/around-clock",   label: "Around the Clock", sub: "1 → 20 → Bull", color: "bg-warn text-black" },
  { href: "/play/bobs27",         label: "Bob's 27", sub: "Doppel-Training", color: "bg-blue-500" },
  { href: "/play/shanghai",       label: "Shanghai", sub: "Runde 1–20", color: "bg-purple-500" },
  { href: "/play/highscore",      label: "High Score", sub: "9 Darts maximal", color: "bg-pink-500" },
  { href: "/play/killer",         label: "Killer", sub: "Party · Eliminierung", color: "bg-bad" },
];

export default function Home() {
  const players = useDB(s => s.players);
  const history = useDB(s => s.history);
  const last = history[0];
  return (
    <>
      <Header back={false} right={
        <Link href="/settings" className="btn-ghost !px-3 !py-2" aria-label="Einstellungen">⚙️</Link>
      }/>
      <section className="mb-6 animate-slideUp">
        <h1 className="text-3xl font-black tracking-tight">Bullseye</h1>
        <p className="text-muted">Die App fürs nächste Match — ohne Schnickschnack.</p>
      </section>

      <section className="card mb-5 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted">Schnellstart</div>
            <div className="mt-1 text-xl font-bold">501 · First to 3 Legs</div>
          </div>
          <Link href="/play/x01?start=501&legs=3" className="btn-primary">Los geht's →</Link>
        </div>
      </section>

      <section className="mb-2 text-xs uppercase tracking-wider text-muted">Spielmodi</section>
      <section className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {MODES.map(m => (
          <Link key={m.href} href={m.href} className="card p-4 active:scale-[0.98] transition">
            <div className={`mb-3 grid h-10 w-10 place-items-center rounded-xl font-black ${m.color}`}>
              {m.label.split(" ").map(w => w[0]).join("").slice(0,2)}
            </div>
            <div className="font-bold">{m.label}</div>
            <div className="text-xs text-muted">{m.sub}</div>
          </Link>
        ))}
      </section>

      <section className="mt-6 grid grid-cols-3 gap-3">
        <Link href="/players" className="card p-4 text-center">
          <div className="text-2xl font-black">{players.length}</div>
          <div className="text-xs text-muted">Spieler</div>
        </Link>
        <Link href="/history" className="card p-4 text-center">
          <div className="text-2xl font-black">{history.length}</div>
          <div className="text-xs text-muted">Matches</div>
        </Link>
        <Link href="/stats" className="card p-4 text-center">
          <div className="text-2xl font-black">📊</div>
          <div className="text-xs text-muted">Statistik</div>
        </Link>
      </section>

      {last && (
        <section className="mt-6 card p-4">
          <div className="text-xs uppercase tracking-wider text-muted">Letztes Match</div>
          <div className="mt-1 flex items-center justify-between">
            <div className="font-semibold">{last.mode.toUpperCase()} · {new Date(last.startedAt).toLocaleString()}</div>
            <Link href="/history" className="text-accent text-sm font-semibold">Verlauf →</Link>
          </div>
        </section>
      )}

      <footer className="mt-10 text-center text-xs text-muted">
        gebaut mit 🎯 — selfhosted via Coolify
      </footer>
    </>
  );
}
