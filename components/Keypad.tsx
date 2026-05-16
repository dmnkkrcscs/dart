"use client";

import { useEffect, useState } from "react";

/** Total-input keypad: enter the 3-dart total (0..180) and submit. */
export default function Keypad({
  onSubmit,
  onUndo,
  hint,
  max = 180,
}: {
  onSubmit: (total: number) => void;
  onUndo: () => void;
  hint?: string;
  max?: number;
}) {
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) press(e.key);
      else if (e.key === "Backspace") backspace();
      else if (e.key === "Enter") submit();
      else if (e.key.toLowerCase() === "u") onUndo();
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  function press(d: string) {
    const next = (value + d).replace(/^0+(?=\d)/, "");
    if (parseInt(next || "0", 10) > max) return;
    setValue(next);
  }
  function backspace() { setValue(value.slice(0, -1)); }
  function clear() { setValue(""); }
  function submit() {
    const n = parseInt(value || "0", 10);
    if (n < 0 || n > max) return;
    onSubmit(n);
    setValue("");
  }
  function quick(n: number) { onSubmit(n); setValue(""); }

  const keys = ["1","2","3","4","5","6","7","8","9"];
  return (
    <div className="space-y-3">
      <div className="card flex items-center justify-between p-4">
        <div className="text-xs uppercase tracking-wider text-muted">Wurf-Gesamt</div>
        <div className="score-big text-4xl font-black">{value || "0"}</div>
      </div>
      {hint && <div className="text-center text-sm text-accent2 font-semibold">{hint}</div>}
      <div className="grid grid-cols-3 gap-2">
        {keys.map(k => (
          <button key={k} onClick={() => press(k)} className="btn-ghost h-14 text-2xl font-bold">{k}</button>
        ))}
        <button onClick={backspace} className="btn-ghost h-14 text-xl">⌫</button>
        <button onClick={() => press("0")} className="btn-ghost h-14 text-2xl font-bold">0</button>
        <button onClick={submit} className="btn-primary h-14 text-xl">OK</button>
      </div>
      <div className="grid grid-cols-4 gap-2 text-sm">
        {[26, 41, 45, 60, 81, 100, 121, 140, 180].map(n => (
          <button key={n} onClick={() => quick(n)} className="rounded-lg bg-panel2 py-2 font-semibold hover:bg-line">
            {n}
          </button>
        ))}
        <button onClick={clear} className="rounded-lg bg-panel2 py-2 font-semibold hover:bg-line">CLR</button>
        <button onClick={onUndo} className="rounded-lg bg-panel2 py-2 font-semibold hover:bg-line">↶ Undo</button>
      </div>
    </div>
  );
}
