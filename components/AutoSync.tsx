"use client";

import { useEffect, useRef } from "react";
import { useDB } from "@/lib/store";
import { pushBackup } from "@/lib/sync";

const DEBOUNCE_MS = 4000;

export default function AutoSync() {
  const code = useDB(s => s.backupCode);
  const players = useDB(s => s.players);
  const history = useDB(s => s.history);
  const settings = useDB(s => s.settings);
  const lastConfig = useDB(s => s.lastConfig);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (!code) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      pushBackup(code).catch(err => console.warn("[autosync] push failed:", err));
    }, DEBOUNCE_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [code, players, history, settings, lastConfig]);

  return null;
}
