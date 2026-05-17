"use client";

import { useRef, useState } from "react";
import Header from "@/components/Header";
import { useDB } from "@/lib/store";
import { announceScore, speak } from "@/lib/voice";
import { downloadBackup, restoreBackup, wipeAllData } from "@/lib/backup";
import CloudBackupCard from "@/components/CloudBackupCard";

export default function SettingsPage() {
  const s = useDB(st => st.settings);
  const update = useDB(st => st.updateSettings);
  const players = useDB(st => st.players);
  const history = useDB(st => st.history);

  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [confirmWipe, setConfirmWipe] = useState(false);

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

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const replace = window.confirm(
      "Backup einspielen?\n\nDeine aktuellen Spieler:innen, Matches und Einstellungen werden überschrieben."
    );
    if (!replace) return;
    const res = await restoreBackup(file);
    if (res.ok) {
      setMsg({ kind: "ok", text: `Backup wiederhergestellt: ${res.players} Spieler:innen, ${res.matches} Matches.` });
      setTimeout(() => window.location.reload(), 900);
    } else {
      setMsg({ kind: "err", text: res.error });
    }
  }

  function onWipe() {
    if (!confirmWipe) {
      setConfirmWipe(true);
      setTimeout(() => setConfirmWipe(false), 4000);
      return;
    }
    wipeAllData();
    setMsg({ kind: "ok", text: "Alle Daten gelöscht." });
    setTimeout(() => window.location.reload(), 700);
  }

  return (
    <>
      <Header title="Einstellungen"/>
      <div className="space-y-3">

        <div className="card p-4">
          <div className="mb-2 font-bold">Theme</div>
          <div className="mb-3 text-xs text-muted">Helles oder dunkles Erscheinungsbild — oder automatisch nach Betriebssystem.</div>
          <div className="grid grid-cols-3 gap-2">
            {([
              {k: "dark",   label: "Dark",   hint: "Standard"},
              {k: "light",  label: "Light",  hint: "hell"},
              {k: "system", label: "System", hint: "OS"},
            ] as const).map(o => (
              <button key={o.k}
                onClick={() => update({theme: o.k})}
                className={`btn flex-col h-auto py-2.5 ${s.theme === o.k ? "btn-primary" : "btn-ghost"}`}>
                <span className="text-sm font-bold">{o.label}</span>
                <span className={`text-[10px] ${s.theme === o.k ? "opacity-80" : "text-muted"}`}>{o.hint}</span>
              </button>
            ))}
          </div>
        </div>

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

        <CloudBackupCard/>

        <div className="card p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-bold">Lokales Backup</div>
              <div className="mt-0.5 text-xs text-muted">
                {players.length} Spieler:innen · {history.length} Matches im lokalen Speicher
              </div>
            </div>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0 text-muted">
              <path d="M21 12v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => { downloadBackup(); setMsg({ kind: "ok", text: "Backup heruntergeladen." }); }}
              className="btn-primary"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="mr-1.5"><path d="M8 1v9m0 0L4.5 6.5M8 10l3.5-3.5M2 13h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Export
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="btn-ghost"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="mr-1.5"><path d="M8 14V5m0 0L4.5 8.5M8 5l3.5 3.5M2 2h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Import
            </button>
          </div>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onPickFile}/>

          <button
            onClick={onWipe}
            className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              confirmWipe
                ? "border-bad/60 bg-bad/15 text-bad"
                : "border-line bg-panel2 text-muted hover:border-bad/40 hover:text-bad"
            }`}
          >
            {confirmWipe ? "Wirklich? Erneut tippen zum Bestätigen" : "Alle lokalen Daten löschen"}
          </button>

          {msg && (
            <div className={`mt-3 rounded-lg border px-3 py-2 text-xs ${
              msg.kind === "ok" ? "border-good/40 bg-good/10 text-good" : "border-bad/40 bg-bad/10 text-bad"
            }`}>
              {msg.text}
            </div>
          )}

          <p className="mt-3 text-[11px] leading-relaxed text-dim">
            Backups enthalten Spieler:innen, Match-Historie und App-Einstellungen. Sie verlassen dein Gerät nicht – außer du teilst die Datei selbst.
          </p>
        </div>

        <div className="card p-4">
          <div className="font-bold mb-1">Über Bullseye</div>
          <div className="text-sm text-muted">v0.2 · alle Daten leben lokal im Browser. Voice-Pakete: ElevenLabs.</div>
        </div>
      </div>
    </>
  );
}
