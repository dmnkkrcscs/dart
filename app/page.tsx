"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { useDB } from "@/lib/store";

type Mode = {
  href: string;
  label: string;
  sub: string;
  grad: string;
  icon: JSX.Element;
};

const MODES: Mode[] = [
  {
    href: "/play/x01?start=501",
    label: "501",
    sub: "Klassik · Double-Out",
    grad: "bg-grad-accent",
    icon: <PathIcon d="M4 12h16M12 4v16"/>,
  },
  {
    href: "/play/x01?start=301",
    label: "301",
    sub: "Schneller Klassiker",
    grad: "bg-grad-amber",
    icon: <PathIcon d="M5 8a4 4 0 1 1 0 8M9 12h6"/>,
  },
  {
    href: "/play/cricket",
    label: "Cricket",
    sub: "20er bis 15er + Bull",
    grad: "bg-grad-emerald",
    icon: <PathIcon d="M4 4l16 16M9 4h11v11"/>,
  },
  {
    href: "/play/around-clock",
    label: "Around the Clock",
    sub: "1 → 20 → Bull",
    grad: "bg-grad-blue",
    icon: <PathIcon d="M12 5v7l4 3M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z"/>,
  },
  {
    href: "/play/bobs27",
    label: "Bob's 27",
    sub: "Doppel-Training",
    grad: "bg-grad-teal",
    icon: <PathIcon d="M3 7h18M3 12h18M3 17h18"/>,
  },
  {
    href: "/play/shanghai",
    label: "Shanghai",
    sub: "Runde 1 – 20",
    grad: "bg-grad-purple",
    icon: <PathIcon d="M12 2L4 7l8 5 8-5-8-5zM4 17l8 5 8-5M4 12l8 5 8-5"/>,
  },
  {
    href: "/play/highscore",
    label: "High Score",
    sub: "9 Darts maximal",
    grad: "bg-grad-pink",
    icon: <PathIcon d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/>,
  },
  {
    href: "/play/killer",
    label: "Killer",
    sub: "Party · Eliminierung",
    grad: "bg-grad-rose",
    icon: <PathIcon d="M12 2c5 0 8 3 8 8 0 7-8 12-8 12S4 17 4 10c0-5 3-8 8-8z"/>,
  },
];

function PathIcon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function Home() {
  const players = useDB(s => s.players);
  const history = useDB(s => s.history);
  const last = history[0];
  return (
    <>
      <Header back={false} right={
        <Link href="/settings" className="btn-ghost !px-3 !py-2" aria-label="Einstellungen">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" strokeWidth="2"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" stroke="currentColor" strokeWidth="2"/></svg>
        </Link>
      }/>

      <section className="mb-7 animate-slideUp">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulseGlow"/>
          Selfhosted · v0.1
        </div>
        <h1 className="mt-3 text-[42px] font-black leading-none tracking-tight text-balance">
          Punkte zählen,<br/>
          <span className="bg-grad-accent bg-clip-text text-transparent">ohne nachzudenken.</span>
        </h1>
        <p className="mt-3 text-muted max-w-md">7 Spielmodi, Checkout-Hilfe, Voice-Ansage, Heatmap-Statistik — direkt im Browser.</p>
      </section>

      <section className="card mb-5 p-5 relative">
        <div className="absolute inset-0 bg-grad-accent opacity-[0.08] pointer-events-none"/>
        <div className="relative flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="chip">Schnellstart</div>
            <div className="mt-2 text-xl font-black truncate">501 · First to 3 Legs</div>
            <div className="text-xs text-muted">Double-Out, Standard PDC-Regelwerk</div>
          </div>
          <Link href="/play/x01?start=501&legs=3" className="btn-primary shrink-0">
            Los geht's
            <svg className="ml-2 h-4 w-4" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </section>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">Spielmodi</h2>
        <span className="text-xs text-dim">{MODES.length} verfügbar</span>
      </div>
      <section className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {MODES.map(m => (
          <Link key={m.href} href={m.href} className="card card-hover p-4 group">
            <div className={`relative mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${m.grad} text-white shadow-md`}>
              {m.icon}
            </div>
            <div className="font-bold leading-tight">{m.label}</div>
            <div className="mt-0.5 text-xs text-muted leading-snug">{m.sub}</div>
          </Link>
        ))}
      </section>

      <section className="mt-5 grid grid-cols-3 gap-3">
        <Link href="/players" className="card card-hover p-4">
          <div className="text-xs uppercase tracking-wider text-muted">Spieler</div>
          <div className="mt-1 text-2xl font-black num-tnum">{players.length}</div>
        </Link>
        <Link href="/history" className="card card-hover p-4">
          <div className="text-xs uppercase tracking-wider text-muted">Matches</div>
          <div className="mt-1 text-2xl font-black num-tnum">{history.length}</div>
        </Link>
        <Link href="/stats" className="card card-hover p-4">
          <div className="text-xs uppercase tracking-wider text-muted">Statistik</div>
          <div className="mt-1 text-2xl font-black">→</div>
        </Link>
      </section>

      {last && (
        <section className="mt-5 card p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="chip">Letztes Match</div>
              <div className="mt-1 font-semibold truncate">{last.mode.toUpperCase()} · {new Date(last.startedAt).toLocaleString()}</div>
            </div>
            <Link href="/history" className="text-accent text-sm font-bold shrink-0">Verlauf →</Link>
          </div>
        </section>
      )}

      <footer className="mt-12 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-dim">
        gebaut mit <span className="text-accent">●</span> Coolify
      </footer>
    </>
  );
}
