"use client";

import { useEffect, useState } from "react";
import { applyBackup } from "@/lib/backup";
import { fetchBackup, isValidCode } from "@/lib/sync";

type Stage = "idle" | "loading" | "confirm" | "applying" | "error";

export default function RestoreFromUrl() {
  const [stage, setStage] = useState<Stage>("idle");
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [info, setInfo] = useState<{ players: number; matches: number; exportedAt: number } | null>(null);
  const [payloadText, setPayloadText] = useState<string>("");

  useEffect(() => {
    const url = new URL(window.location.href);
    const raw = url.searchParams.get("restore");
    if (!raw) return;
    const c = raw.toUpperCase().trim();
    if (!isValidCode(c)) {
      setStage("error");
      setError("Backup-Code ist ungültig.");
      setCode(c);
      return;
    }
    setCode(c);
    setStage("loading");
    (async () => {
      try {
        const data = await fetchBackup(c);
        setInfo({
          players: data.data.players?.length ?? 0,
          matches: data.data.history?.length ?? 0,
          exportedAt: data.exportedAt,
        });
        setPayloadText(JSON.stringify(data));
        setStage("confirm");
      } catch (e: any) {
        setError(e?.message || "Konnte Backup nicht laden.");
        setStage("error");
      }
    })();
  }, []);

  function clearParam() {
    const url = new URL(window.location.href);
    url.searchParams.delete("restore");
    window.history.replaceState({}, "", url.toString());
  }

  function cancel() {
    clearParam();
    setStage("idle");
  }

  function apply() {
    if (!code || !payloadText) return;
    setStage("applying");
    try {
      const payload = JSON.parse(payloadText);
      const res = applyBackup(payload);
      if (!res.ok) {
        setError(res.error);
        setStage("error");
        return;
      }
      // remember the code on this device so auto-sync continues
      const raw = JSON.parse(localStorage.getItem("bullseye-v1") || "{}");
      const state = raw.state || {};
      state.backupCode = code;
      localStorage.setItem("bullseye-v1", JSON.stringify({ ...raw, state }));
      clearParam();
      window.location.replace("/");
    } catch (e: any) {
      setError(e?.message || "Konnte Backup nicht anwenden.");
      setStage("error");
    }
  }

  if (stage === "idle") return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="card w-full max-w-md p-5 shadow-soft animate-slideUp">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulseGlow"/>
          Cloud-Backup
        </div>

        {stage === "loading" && (
          <>
            <h2 className="text-lg font-black">Backup wird geladen …</h2>
            <p className="mt-1 text-sm text-muted">Code <span className="font-mono text-ink">{code}</span></p>
          </>
        )}

        {stage === "confirm" && info && (
          <>
            <h2 className="text-lg font-black">Backup einspielen?</h2>
            <p className="mt-1 text-sm text-muted">
              Code <span className="font-mono text-ink">{code}</span>
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-line bg-panel2 p-3">
                <div className="text-[11px] uppercase tracking-wider text-muted">Spieler:innen</div>
                <div className="mt-1 text-xl font-black num-tnum">{info.players}</div>
              </div>
              <div className="rounded-xl border border-line bg-panel2 p-3">
                <div className="text-[11px] uppercase tracking-wider text-muted">Matches</div>
                <div className="mt-1 text-xl font-black num-tnum">{info.matches}</div>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted">
              Stand: {new Date(info.exportedAt).toLocaleString()}
            </p>
            <p className="mt-3 rounded-lg border border-warn/30 bg-warn/10 px-3 py-2 text-xs text-warn">
              Achtung: Deine aktuellen lokalen Daten werden überschrieben.
            </p>
            <div className="mt-4 flex gap-2">
              <button onClick={apply} className="btn-primary flex-1">Einspielen</button>
              <button onClick={cancel} className="btn-ghost">Abbrechen</button>
            </div>
          </>
        )}

        {stage === "applying" && (
          <>
            <h2 className="text-lg font-black">Wird angewendet …</h2>
          </>
        )}

        {stage === "error" && (
          <>
            <h2 className="text-lg font-black">Konnte Backup nicht laden</h2>
            <p className="mt-1 text-sm text-muted">
              Code <span className="font-mono text-ink">{code || "?"}</span>
            </p>
            <p className="mt-3 rounded-lg border border-bad/30 bg-bad/10 px-3 py-2 text-xs text-bad">
              {error}
            </p>
            <button onClick={cancel} className="btn-ghost mt-4 w-full">Schließen</button>
          </>
        )}
      </div>
    </div>
  );
}
