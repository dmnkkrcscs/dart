"use client";

import { useState } from "react";
import Header from "./Header";
import PlayerPicker from "./PlayerPicker";

export default function GameSetup({
  title,
  description,
  min = 1,
  max = 8,
  onStart,
  extra,
}: {
  title: string;
  description?: string;
  min?: number;
  max?: number;
  onStart: (playerIds: string[]) => void;
  extra?: React.ReactNode;
}) {
  const [ids, setIds] = useState<string[]>([]);
  return (
    <>
      <Header title={`${title} · Setup`} />
      <div className="space-y-4">
        {description && <p className="text-muted">{description}</p>}
        {extra}
        <div className="card p-4">
          <PlayerPicker selected={ids} onChange={setIds} min={min} max={max}/>
        </div>
        <button onClick={() => onStart(ids)} disabled={ids.length < min} className="btn-primary w-full text-lg">
          Starten →
        </button>
      </div>
    </>
  );
}
