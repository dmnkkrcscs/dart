"use client";

import { useState } from "react";
import { Dart, Multiplier } from "@/lib/types";

export default function DartPad({
  onVisit,
  onUndo,
}: {
  onVisit: (darts: Dart[]) => void;
  onUndo: () => void;
}) {
  const [mult, setMult] = useState<Multiplier>(1);
  const [darts, setDarts] = useState<Dart[]>([]);

  function tap(seg: number) {
    const m: Multiplier = seg === 25 ? (mult === 3 ? 2 : mult) : mult;
    const next = [...darts, { segment: seg as Dart["segment"], multiplier: m }];
    setMult(1);
    if (next.length >= 3) {
      onVisit(next);
      setDarts([]);
    } else {
      setDarts(next);
    }
  }
  function submitPartial() {
    if (darts.length === 0) return;
    onVisit(darts);
    setDarts([]);
  }
  function popDart() {
    setDarts(darts.slice(0, -1));
  }

  const nums = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
  return (
    <div className="space-y-3">
      <div className="card flex items-center justify-between p-4">
        <div className="chip">Einzelwürfe</div>
        <div className="flex items-center gap-1.5">
          {[0,1,2].map(i => {
            const d = darts[i];
            return (
              <span key={i} className={`min-w-[44px] rounded-lg px-2 py-1 text-center text-sm font-mono font-bold ${d ? "bg-accent text-white" : "bg-panel2 text-dim"}`}>
                {d ? `${d.multiplier === 3 ? "T" : d.multiplier === 2 ? "D" : "S"}${d.segment === 25 ? "B" : d.segment}` : "–"}
              </span>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {([1,2,3] as const).map(m => (
          <button key={m} onClick={() => setMult(m as Multiplier)}
            className={`btn h-11 font-bold text-sm ${mult === m ? "btn-primary" : "btn-ghost"}`}>
            {m === 1 ? "Single" : m === 2 ? "Double" : "Triple"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {nums.map(n => (
          <button key={n} onClick={() => tap(n)} className="btn-ghost h-12 font-bold num-tnum">{n}</button>
        ))}
        <button onClick={() => tap(25)} className="btn col-span-2 h-12 font-black text-black"
          style={{backgroundImage: "linear-gradient(135deg,#ffb02e 0%,#ff7a18 100%)"}}>BULL</button>
        <button onClick={() => tap(0)} className="btn-ghost col-span-2 h-12">Miss</button>
        <button onClick={popDart} className="btn-ghost h-12">⌫</button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={submitPartial} className="btn-primary">Aufnahme bestätigen</button>
        <button onClick={onUndo} className="btn-outline">↶ Undo</button>
      </div>
    </div>
  );
}
