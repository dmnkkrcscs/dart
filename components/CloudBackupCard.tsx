"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useDB } from "@/lib/store";
import { applyBackup } from "@/lib/backup";
import {
  deleteBackup,
  fetchBackup,
  generateBackupCode,
  isValidCode,
  pushBackup,
  restoreUrl,
} from "@/lib/sync";

type Msg = { kind: "ok" | "err"; text: string } | null;

export default function CloudBackupCard() {
  const code = useDB(s => s.backupCode);
  const setCode = useDB(s => s.setBackupCode);

  const [msg, setMsg] = useState<Msg>(null);
  const [busy, setBusy] = useState<"create" | "push" | "fetch" | "remove" | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [restoreInput, setRestoreInput] = useState("");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 4000);
    return () => clearTimeout(t);
  }, [msg]);

  async function onCreate() {
    setBusy("create");
    setMsg(null);
    try {
      const c = generateBackupCode();
      await pushBackup(c);
      setCode(c);
      setShowCode(true);
      setMsg({ kind: "ok", text: `Backup-Code erstellt: ${c}` });
    } catch (e: any) {
      setMsg({ kind: "err", text: e?.message || "Konnte Backup nicht erstellen." });
    } finally {
      setBusy(null);
    }
  }

  async function onPushNow() {
    if (!code) return;
    setBusy("push");
    setMsg(null);
    try {
      await pushBackup(code);
      setMsg({ kind: "ok", text: "Backup auf den Server gepusht." });
    } catch (e: any) {
      setMsg({ kind: "err", text: e?.message || "Push fehlgeschlagen." });
    } finally {
      setBusy(null);
    }
  }

  async function onRestore() {
    const c = restoreInput.trim().toUpperCase();
    if (!isValidCode(c)) {
      setMsg({ kind: "err", text: "Code muss im Format XXX-XXX sein (ohne 0/O/1/I)." });
      return;
    }
    if (!window.confirm(`Backup ${c} einspielen?\n\nDeine aktuellen lokalen Daten werden überschrieben.`)) return;
    setBusy("fetch");
    setMsg(null);
    try {
      const payload = await fetchBackup(c);
      const res = applyBackup(payload);
      if (!res.ok) throw new Error(res.error);
      setCode(c);
      setMsg({ kind: "ok", text: `Backup wiederhergestellt: ${res.players} Spieler:innen, ${res.matches} Matches.` });
      setRestoreInput("");
      setTimeout(() => window.location.reload(), 900);
    } catch (e: any) {
      setMsg({ kind: "err", text: e?.message || "Restore fehlgeschlagen." });
    } finally {
      setBusy(null);
    }
  }

  async function onRemove() {
    if (!code) return;
    const wipeRemote = window.confirm(
      `Code ${code} von diesem Gerät entfernen?\n\nOK = nur lokal entkoppeln (Backup bleibt auf dem Server).\nAbbrechen = nichts tun.`
    );
    if (!wipeRemote) return;
    setBusy("remove");
    setMsg(null);
    try {
      setCode(null);
      setShowCode(false);
      setMsg({ kind: "ok", text: "Backup-Code lokal entfernt. Auto-Sync ist aus." });
    } catch (e: any) {
      setMsg({ kind: "err", text: e?.message || "Konnte Code nicht entfernen." });
    } finally {
      setBusy(null);
    }
  }

  async function onDeleteRemote() {
    if (!code) return;
    if (!window.confirm(`Backup ${code} dauerhaft vom Server löschen?\n\nDas kann nicht rückgängig gemacht werden.`)) return;
    setBusy("remove");
    setMsg(null);
    try {
      await deleteBackup(code);
      setCode(null);
      setShowCode(false);
      setMsg({ kind: "ok", text: "Backup vom Server gelöscht." });
    } catch (e: any) {
      setMsg({ kind: "err", text: e?.message || "Konnte Backup nicht löschen." });
    } finally {
      setBusy(null);
    }
  }

  const url = code && origin ? `${origin}/?restore=${code}` : "";

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-bold">Cloud-Backup</div>
          <div className="mt-0.5 text-xs text-muted">
            Selbst-gehosteter Sync via Code. Mehrere Geräte teilen dieselben Daten.
          </div>
        </div>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0 text-muted">
          <path d="M7 18a5 5 0 0 1-1-9.9A6 6 0 0 1 18 9a4 4 0 0 1 1 7.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 12v8m0 0l-3-3m3 3l3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {code ? (
        <div className="mt-3 space-y-3">
          <div className="rounded-xl border border-line bg-panel2 p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted">Dein Code</div>
                <div className="mt-1 font-mono text-xl font-black tracking-widest">
                  {showCode ? code : "•••-•••"}
                </div>
              </div>
              <button onClick={() => setShowCode(v => !v)} className="btn-ghost !px-3 !py-2 text-xs">
                {showCode ? "Verbergen" : "Anzeigen"}
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-good">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-good animate-pulseGlow"/>
              Auto-Sync aktiv · änderungen werden nach ~4 Sek. gepusht
            </div>
          </div>

          {showCode && url && (
            <div className="rounded-xl border border-line bg-panel2 p-3">
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
                <div className="rounded-lg bg-white p-2 shrink-0">
                  <QRCodeSVG value={url} size={140} level="M" includeMargin={false}/>
                </div>
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <div className="text-[11px] uppercase tracking-wider text-muted">Auf neuem Gerät scannen</div>
                  <div className="mt-1 text-xs text-muted break-all">{url}</div>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(url);
                      setMsg({ kind: "ok", text: "Link kopiert." });
                    }}
                    className="btn-ghost mt-2 !py-1.5 text-xs"
                  >
                    Link kopieren
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button onClick={onPushNow} disabled={busy === "push"} className="btn-ghost">
              {busy === "push" ? "…" : "Jetzt pushen"}
            </button>
            <button onClick={onRemove} disabled={busy === "remove"} className="btn-ghost">
              Code entfernen
            </button>
          </div>
          <button onClick={onDeleteRemote} disabled={busy === "remove"} className="text-xs text-dim hover:text-bad underline-offset-2 hover:underline">
            Backup vom Server dauerhaft löschen
          </button>
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          <button onClick={onCreate} disabled={busy === "create"} className="btn-primary w-full">
            {busy === "create" ? "Erstelle Code …" : "Code erstellen + Daten pushen"}
          </button>

          <div className="rounded-xl border border-line bg-panel2 p-3">
            <div className="text-[11px] uppercase tracking-wider text-muted mb-2">Bestehenden Code eingeben</div>
            <div className="flex gap-2">
              <input
                value={restoreInput}
                onChange={e => setRestoreInput(e.target.value.toUpperCase())}
                placeholder="XXX-XXX"
                maxLength={7}
                className="flex-1 rounded-xl border border-line bg-bg px-3 py-2 font-mono tracking-widest text-ink placeholder:text-dim focus:border-accent focus:outline-none"
              />
              <button onClick={onRestore} disabled={busy === "fetch"} className="btn-primary">
                {busy === "fetch" ? "…" : "Holen"}
              </button>
            </div>
          </div>
        </div>
      )}

      {msg && (
        <div className={`mt-3 rounded-lg border px-3 py-2 text-xs ${
          msg.kind === "ok" ? "border-good/40 bg-good/10 text-good" : "border-bad/40 bg-bad/10 text-bad"
        }`}>
          {msg.text}
        </div>
      )}

      <p className="mt-3 text-[11px] leading-relaxed text-dim">
        Daten liegen auf einem selbst-gehosteten Server (siehe Datenschutz). Backups, die 365 Tage nicht aktualisiert wurden, werden automatisch gelöscht.
      </p>
    </div>
  );
}
