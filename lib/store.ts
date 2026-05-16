"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_SETTINGS, Match, Player, Settings } from "./types";

const COLORS = [
  "#ff3b3b", "#22c55e", "#3b82f6", "#f59e0b", "#a855f7",
  "#06b6d4", "#ec4899", "#84cc16", "#f97316", "#14b8a6",
];

function rid() {
  return Math.random().toString(36).slice(2, 10);
}

type DB = {
  players: Player[];
  history: Match[];
  settings: Settings;
  lastConfig: any;
  backupCode: string | null;

  addPlayer: (name: string) => Player;
  renamePlayer: (id: string, name: string) => void;
  deletePlayer: (id: string) => void;

  saveMatch: (m: Match) => void;
  deleteMatch: (id: string) => void;
  clearHistory: () => void;

  updateSettings: (patch: Partial<Settings>) => void;
  setLastConfig: (cfg: any) => void;
  setBackupCode: (code: string | null) => void;
};

export const useDB = create<DB>()(
  persist(
    (set, get) => ({
      players: [],
      history: [],
      settings: DEFAULT_SETTINGS,
      lastConfig: null,
      backupCode: null,

      addPlayer: (name) => {
        const p: Player = {
          id: rid(),
          name: name.trim() || "Spieler",
          color: COLORS[get().players.length % COLORS.length],
          avatar: (name.trim()[0] || "?").toUpperCase(),
          createdAt: Date.now(),
        };
        set({ players: [...get().players, p] });
        return p;
      },
      renamePlayer: (id, name) =>
        set({ players: get().players.map(p => p.id === id ? { ...p, name, avatar: name[0]?.toUpperCase() || p.avatar } : p) }),
      deletePlayer: (id) =>
        set({ players: get().players.filter(p => p.id !== id) }),

      saveMatch: (m) => {
        const exists = get().history.find(h => h.id === m.id);
        if (exists) {
          set({ history: get().history.map(h => h.id === m.id ? m : h) });
        } else {
          set({ history: [m, ...get().history].slice(0, 200) });
        }
      },
      deleteMatch: (id) => set({ history: get().history.filter(h => h.id !== id) }),
      clearHistory: () => set({ history: [] }),

      updateSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),
      setLastConfig: (cfg) => set({ lastConfig: cfg }),
      setBackupCode: (code) => set({ backupCode: code }),
    }),
    { name: "bullseye-v1" }
  )
);

export function newMatchId() { return rid(); }
