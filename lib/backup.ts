"use client";

import { DEFAULT_SETTINGS, Match, Player, Settings } from "./types";

export const BACKUP_VERSION = 1;
export const STORE_KEY = "bullseye-v1";

export type BackupPayload = {
  app: "bullseye";
  version: number;
  exportedAt: number;
  data: {
    players: Player[];
    history: Match[];
    settings: Settings;
    lastConfig: unknown;
  };
};

function readPersistedState(): BackupPayload["data"] {
  if (typeof window === "undefined") {
    return { players: [], history: [], settings: DEFAULT_SETTINGS, lastConfig: null };
  }
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) {
      return { players: [], history: [], settings: DEFAULT_SETTINGS, lastConfig: null };
    }
    const parsed = JSON.parse(raw);
    const state = parsed?.state ?? {};
    return {
      players: Array.isArray(state.players) ? state.players : [],
      history: Array.isArray(state.history) ? state.history : [],
      settings: { ...DEFAULT_SETTINGS, ...(state.settings || {}) },
      lastConfig: state.lastConfig ?? null,
    };
  } catch {
    return { players: [], history: [], settings: DEFAULT_SETTINGS, lastConfig: null };
  }
}

export function buildBackup(): BackupPayload {
  return {
    app: "bullseye",
    version: BACKUP_VERSION,
    exportedAt: Date.now(),
    data: readPersistedState(),
  };
}

export function downloadBackup() {
  const payload = buildBackup();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date(payload.exportedAt)
    .toISOString()
    .replace(/[:.]/g, "-")
    .replace("T", "_")
    .slice(0, 19);
  a.href = url;
  a.download = `bullseye-backup_${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export type RestoreResult =
  | { ok: true; players: number; matches: number }
  | { ok: false; error: string };

function applyParsed(parsed: Partial<BackupPayload>): RestoreResult {
  if (parsed?.app !== "bullseye") {
    return { ok: false, error: "Datei ist kein Bullseye-Backup." };
  }
  if (typeof parsed.version !== "number" || parsed.version > BACKUP_VERSION) {
    return { ok: false, error: "Backup-Version wird nicht unterstützt." };
  }
  const d = parsed.data;
  if (!d || !Array.isArray(d.players) || !Array.isArray(d.history)) {
    return { ok: false, error: "Backup ist beschädigt oder unvollständig." };
  }
  let existingCode: string | null = null;
  try {
    const cur = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
    existingCode = cur?.state?.backupCode ?? null;
  } catch {}
  const state = {
    players: d.players,
    history: d.history,
    settings: { ...DEFAULT_SETTINGS, ...(d.settings || {}) },
    lastConfig: d.lastConfig ?? null,
    backupCode: existingCode,
  };
  localStorage.setItem(STORE_KEY, JSON.stringify({ state, version: 0 }));
  return { ok: true, players: state.players.length, matches: state.history.length };
}

export function applyBackup(payload: BackupPayload): RestoreResult {
  return applyParsed(payload);
}

export async function restoreBackup(file: File): Promise<RestoreResult> {
  try {
    const text = await file.text();
    const parsed = JSON.parse(text) as Partial<BackupPayload>;
    return applyParsed(parsed);
  } catch (e: any) {
    return { ok: false, error: e?.message || "Konnte Datei nicht lesen." };
  }
}

export function wipeAllData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORE_KEY);
}
