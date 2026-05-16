"use client";

import { useState } from "react";
import { Dart, Multiplier } from "@/lib/types";

/** Per-dart input: tap multiplier then segment. Up to 3 darts, then auto-submit. */
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
    const m: Multiplier = seg === 25 ? (mult === 3 ? 2 : mult) : mult; // can't triple bull
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
        <div className="text-xs uppercase tracking-wider text-muted">Einzelwürfe</div>
        <div className="flex items-center gap-2">
          {darts.map((d,i) => (
            <span key={i} className="rounded-md bg-panel2 px-2 py-1 text-sm font-mono">
              {d.multiplier === 3 ? "T" : d.multiplier === 2 ? "D" : "S"}{d.segment === 25 ? "B" : d.segment}
            </span>
          ))}
          {Array.from({length: 3 - darts.length}).map((_,i) => (
            <span key={i} className="rounded-md bg-panel2 px-2 py-1 text-sm font-mono text-muted">–</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {(["1","2","3"] as const).map(m => (
          <button key={m} onClick={() => setMult(parseInt(m) as Multiplier)}
            className={`btn h-12 font-bold ${mult === parseInt(m) ? "bg-accent text-white" : "bg-panel2"}`}>
            {m === "1" ? "Single" : m === "2" ? "Double" : "Triple"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-2">
        {nums.map(n => (
          <button key={n} onClick={() => tap(n)} className="btn-ghost h-12 font-bold">{n}</button>
        ))}
        <button onClick={() => tap(25)} className="btn h-12 col-span-2 bg-accent2 text-black font-black">BULL (25 / 50)</button>
        <button onClick={() => tap(0)} className="btn-ghost h-12 col-span-2">Miss (0)</button>
        <button onClick={popDart} className="btn-ghost h-12">⌫</button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={submitPartial} className="btn-primary">Aufnahme bestätigen</button>
        <button onClick={onUndo} className="btn-outline">↶ Undo</button>
      </div>
    </div>
  );
}
