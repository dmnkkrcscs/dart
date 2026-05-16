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

  return (
    <>
      <Header title="Spieler"/>
      <div className="card p-4 mb-4">
        <div className="flex gap-2">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Name"
            className="flex-1 rounded-xl bg-panel2 px-3 py-2 outline-none focus:ring-2 ring-accent"
            onKeyDown={e => { if (e.key === "Enter" && name.trim()) { addPlayer(name); setName(""); } }}/>
          <button onClick={() => { if (name.trim()) { addPlayer(name); setName(""); } }} className="btn-primary">+ Anlegen</button>
        </div>
      </div>
      <div className="space-y-2">
        {players.length === 0 && <div className="card p-6 text-center text-muted">Noch keine Spieler. Leg deinen ersten oben an.</div>}
        {players.map(p => (
          <div key={p.id} className="card flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full font-black" style={{background: p.color}}>{p.avatar}</span>
              <input defaultValue={p.name} onBlur={e => rename(p.id, e.target.value || p.name)}
                className="bg-transparent font-bold outline-none focus:ring-1 ring-accent rounded px-1"/>
            </div>
            <button onClick={() => confirm(`${p.name} löschen?`) && del(p.id)} className="btn-ghost !px-3 !py-2 text-bad">✕</button>
          </div>
        ))}
      </div>
    </>
  );
}
