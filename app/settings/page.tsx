"use client";

import Header from "@/components/Header";
import { useDB } from "@/lib/store";
import { announceScore, speak } from "@/lib/voice";

export default function SettingsPage() {
  const s = useDB(st => st.settings);
  const update = useDB(st => st.updateSettings);

  function Toggle({ on, onChange, label, hint }: { on: boolean; onChange: (v:boolean)=>void; label: string; hint?: string }) {
    return (
      <div className="card flex items-center justify-between p-4">
        <div className="min-w-0 pr-3">
          <div className="font-bold">{label}</div>
          {hint && <div className="mt-0.5 text-xs text-muted">{hint}</div>}
        </div>
        <button onClick={() => onChange(!on)} className={`relative h-7 w-12 shrink-0 rounded-full transition ${on ? "bg-grad-accent" : "bg-panel2 border border-line"}`}>
          <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`}/>
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
          <div className="mb-2 font-bold">Voice-Pack</div>
          <div className="mb-3 text-xs text-muted">ElevenLabs-Stimmen klingen wie ein echter Caller. Browser-TTS ist die Fallback-Option.</div>
          <div className="grid grid-cols-2 gap-2">
            {([
              {k: "auto",    label: "Auto",        hint: "passt sich der Sprache an"},
              {k: "pdc",     label: "PDC English", hint: "\"One hundred and eighty!\""},
              {k: "de",      label: "Deutsch",     hint: "\"Einhundertachtzig!\" (falls generiert)"},
              {k: "browser", label: "Browser-TTS", hint: "kein ElevenLabs"},
            ] as const).map(o => (
              <button key={o.k}
                onClick={async () => {
                  update({voicePack: o.k});
                  // preview
                  await announceScore(180, s.voiceLang, o.k);
                }}
                className={`rounded-xl border p-3 text-left transition ${s.voicePack === o.k ? "border-accent bg-accent/15" : "border-line bg-panel2 hover:border-line2"}`}>
                <div className="font-bold text-sm">{o.label}</div>
                <div className="mt-0.5 text-[11px] text-muted">{o.hint}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="card p-4">
          <div className="mb-2 font-bold">Voice-Sprache</div>
          <div className="mb-3 text-xs text-muted">Steuert Fallback-TTS und „Auto"-Pack.</div>
          <div className="grid grid-cols-2 gap-2">
            {(["de","en"] as const).map(l => (
              <button key={l} onClick={() => { update({voiceLang: l}); speak(l === "de" ? "Einhundertachtzig" : "One hundred and eighty", l); }}
                className={`btn ${s.voiceLang === l ? "btn-primary" : "btn-ghost"}`}>{l === "de" ? "Deutsch" : "English"}</button>
            ))}
          </div>
        </div>

        <Toggle on={s.sound} onChange={v => update({sound: v})} label="Sound-Feedback" hint="Beep bei Wurf / Bust"/>
        <Toggle on={s.haptic} onChange={v => update({haptic: v})} label="Haptik" hint="Vibration (mobil)"/>
        <Toggle on={s.showCheckout} onChange={v => update({showCheckout: v})} label="Checkout-Vorschlag" hint="Zeigt empfohlene Finish-Route"/>

        <div className="card p-4">
          <div className="mb-2 font-bold">Eingabemodus (Default)</div>
          <div className="grid grid-cols-2 gap-2">
            {(["total","darts"] as const).map(m => (
              <button key={m} onClick={() => update({inputMode: m})}
                className={`btn ${s.inputMode === m ? "btn-primary" : "btn-ghost"}`}>
                {m === "total" ? "3-Wurf gesamt" : "Einzelwurf"}
              </button>
            ))}
          </div>
        </div>

        <div className="card p-4">
          <div className="font-bold mb-1">Über Bullseye</div>
          <div className="text-sm text-muted">v0.2 · alle Daten leben lokal im Browser. Voice-Pakete: ElevenLabs.</div>
        </div>
      </div>
    </>
  );
}
