"use client";

import { buildBackup, BackupPayload } from "./backup";

export const CODE_REGEX = /^[A-Z2-9]{3}-[A-Z2-9]{3}$/;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789"; // 32 chars, no 0/O/1/I

export function generateBackupCode(): string {
  const buf = new Uint8Array(6);
  crypto.getRandomValues(buf);
  const chars = Array.from(buf, b => ALPHABET[b % ALPHABET.length]);
  return `${chars.slice(0, 3).join("")}-${chars.slice(3).join("")}`;
}

export function isValidCode(code: string): boolean {
  return CODE_REGEX.test(code.toUpperCase());
}

function url(code: string) {
  return `/api/sync/${encodeURIComponent(code.toUpperCase())}`;
}

export async function pushBackup(code: string): Promise<void> {
  const payload = buildBackup();
  const res = await fetch(url(code), {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `push failed (${res.status})`);
  }
}

export async function fetchBackup(code: string): Promise<BackupPayload> {
  const res = await fetch(url(code), { cache: "no-store" });
  if (res.status === 404) throw new Error("Kein Backup unter diesem Code gefunden.");
  if (!res.ok) throw new Error(`fetch failed (${res.status})`);
  return res.json();
}

export async function deleteBackup(code: string): Promise<void> {
  const res = await fetch(url(code), { method: "DELETE" });
  if (!res.ok) throw new Error(`delete failed (${res.status})`);
}

export function restoreUrl(code: string): string {
  if (typeof window === "undefined") return `/?restore=${code}`;
  return `${window.location.origin}/?restore=${code}`;
}
