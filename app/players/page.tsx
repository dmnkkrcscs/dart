"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { useDB } from "@/lib/store";

export default function PlayersPage() {
  const players = useDB(s => s.players);
  const addPlayer = useDB(s => s.addPlayer);
  const rename = useDB(s => s.renamePlayer);
  const del = useDB(s => s.deletePlayer);
  const [name, setName] = useState("");

  function add() {
    if (!name.trim()) return;
    addPlayer(name);
    setName("");
  }

  return (
    <>
      <Header title="Spieler"/>
      <div className="card p-4 mb-4">
        <div className="flex gap-2">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Name eingeben…"
            className="flex-1 rounded-xl border border-line bg-panel2 px-3 py-2.5 text-sm outline-none focus:border-accent"
            onKeyDown={e => { if (e.key === "Enter") add(); }}/>
          <button onClick={add} className="btn-primary !px-4 text-sm">+ Anlegen</button>
        </div>
      </div>
      <div className="space-y-2">
        {players.length === 0 && (
          <div className="card p-8 text-center">
            <div className="mb-2 text-4xl">👥</div>
            <div className="font-bold">Noch keine Spieler</div>
            <div className="mt-1 text-sm text-muted">Leg deinen ersten oben an.</div>
          </div>
        )}
        {players.map(p => (
          <div key={p.id} className="card flex items-center gap-3 p-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-base font-black text-black/85" style={{background: p.color}}>{p.avatar}</span>
            <input defaultValue={p.name} onBlur={e => rename(p.id, e.target.value || p.name)}
              className="flex-1 bg-transparent text-base font-bold outline-none focus:bg-panel2 rounded-md px-2 py-1"/>
            <button onClick={() => confirm(`${p.name} löschen?`) && del(p.id)} className="btn-ghost !px-3 !py-2 text-bad" aria-label="Löschen">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
