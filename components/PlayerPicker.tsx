"use client";

import { useState } from "react";
import { useDB } from "@/lib/store";
import { Player } from "@/lib/types";

export default function PlayerPicker({
  selected,
  onChange,
  min = 1,
  max = 8,
}: {
  selected: string[];
  onChange: (ids: string[]) => void;
  min?: number;
  max?: number;
}) {
  const players = useDB(s => s.players);
  const addPlayer = useDB(s => s.addPlayer);
  const [name, setName] = useState("");

  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter(s => s !== id));
    } else if (selected.length < max) {
      onChange([...selected, id]);
    }
  }
  function quickAdd() {
    if (!name.trim()) return;
    const p = addPlayer(name);
    setName("");
    if (selected.length < max) onChange([...selected, p.id]);
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="chip">Spieler</span>
        <span className="text-[11px] font-bold text-muted num-tnum">{selected.length}/{max} · min {min}</span>
      </div>
      {players.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {players.map((p: Player) => {
            const idx = selected.indexOf(p.id);
            const active = idx >= 0;
            return (
              <button
                key={p.id}
                onClick={() => toggle(p.id)}
                className={`group flex items-center gap-2 rounded-full border px-2.5 py-1.5 transition ${active ? "border-accent bg-accent/15" : "border-line bg-panel2 hover:border-line2"}`}
              >
                <span className="grid h-6 w-6 place-items-center rounded-full text-[11px] font-black text-black/85"
                      style={{ background: p.color }}>
                  {p.avatar || p.name[0]}
                </span>
                <span className="text-sm font-semibold">{p.name}</span>
                {active && <span className="num-tnum rounded-full bg-accent px-1.5 text-[10px] font-black text-white">{idx + 1}</span>}
              </button>
            );
          })}
        </div>
      )}
      <div className="flex gap-2">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && quickAdd()}
          placeholder="Neuer Spieler…"
          className="flex-1 rounded-xl border border-line bg-panel2 px-3 py-2.5 text-sm outline-none focus:border-accent"
        />
        <button onClick={quickAdd} className="btn-outline shrink-0 text-sm">+ Hinzufügen</button>
      </div>
    </div>
  );
}
