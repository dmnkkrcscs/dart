"use client";

import Header from "@/components/Header";
import { useDB } from "@/lib/store";
import { speak } from "@/lib/voice";

export default function SettingsPage() {
  const s = useDB(st => st.settings);
  const update = useDB(st => st.updateSettings);

  function Toggle({ on, onChange, label, hint }: { on: boolean; onChange: (v:boolean)=>void; label: string; hint?: string }) {
    return (
      <div className="card flex items-center justify-between p-4">
        <div>
          <div className="font-bold">{label}</div>
          {hint && <div className="text-xs text-muted">{hint}</div>}
        </div>
        <button onClick={() => onChange(!on)} className={`relative h-7 w-12 rounded-full transition ${on ? "bg-accent" : "bg-panel2"}`}>
          <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition ${on ? "left-5" : "left-0.5"}`}/>
        </button>
      </div>
    );
  }

  return (
    <>
      <Header title="Einstellungen"/>
      <div className="space-y-3">
        <Toggle on={s.voice} onChange={v => update({voice: v})} label="Voice-Calling" hint="Punkte und Spiel-Ansagen werden gesprochen"/>
        <div className="card p-4">
          <div className="font-bold mb-2">Voice-Sprache</div>
          <div className="grid grid-cols-2 gap-2">
            {(["de","en"] as const).map(l => (
              <button key={l} onClick={() => { update({voiceLang: l}); speak(l === "de" ? "Einhundertachtzig" : "One hundred and eighty", l); }}
                className={`btn ${s.voiceLang === l ? "bg-accent text-white" : "bg-panel2"}`}>{l === "de" ? "Deutsch" : "English"}</button>
            ))}
          </div>
        </div>
        <Toggle on={s.sound} onChange={v => update({sound: v})} label="Sound-Feedback" hint="Beep bei Wurf / Bust"/>
        <Toggle on={s.haptic} onChange={v => update({haptic: v})} label="Haptik" hint="Vibration (mobil)"/>
        <Toggle on={s.showCheckout} onChange={v => update({showCheckout: v})} label="Checkout-Vorschlag" hint="Zeigt empfohlene Finish-Route"/>

        <div className="card p-4">
          <div className="font-bold mb-2">Eingabemodus (Default)</div>
          <div className="grid grid-cols-2 gap-2">
            {(["total","darts"] as const).map(m => (
              <button key={m} onClick={() => update({inputMode: m})}
                className={`btn ${s.inputMode === m ? "bg-accent text-white" : "bg-panel2"}`}>
                {m === "total" ? "3-Wurf gesamt" : "Einzelwurf"}
              </button>
            ))}
          </div>
        </div>

        <div className="card p-4">
          <div className="font-bold mb-1">Über Bullseye</div>
          <div className="text-sm text-muted">v0.1 · alle Daten leben lokal in deinem Browser (LocalStorage).</div>
        </div>
      </div>
    </>
  );
}
