export type Multiplier = 1 | 2 | 3;

export type Dart = {
  /** 1..20, or 25 for bull. 0 = miss. */
  segment: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 25;
  multiplier: Multiplier;
};

export type GameMode =
  | "x01"
  | "cricket"
  | "around"
  | "bobs27"
  | "shanghai"
  | "highscore"
  | "killer";

export type OutMode = "single" | "double" | "master";

export type Player = {
  id: string;
  name: string;
  color: string; // hex
  avatar?: string; // emoji or initials
  createdAt: number;
};

export type X01Config = {
  startScore: 101 | 170 | 301 | 501 | 701 | 1001;
  outMode: OutMode;
  inMode: "straight" | "double";
  legs: number; // first to N legs wins a set
  sets: number; // first to N sets wins the match
};

export type Visit = {
  playerId: string;
  darts: Dart[]; // 1..3 darts in this visit
  bust?: boolean;
  total: number; // sum of points scored in this visit (0 if bust)
  remainingAfter: number; // remaining x01 score after this visit
  ts: number;
};

export type Match = {
  id: string;
  mode: GameMode;
  config: any;
  players: string[]; // player ids
  visits: Visit[];
  legsWon: Record<string, number>;
  setsWon: Record<string, number>;
  currentPlayerIdx: number;
  startingPlayerIdx: number; // rotates each leg
  scores: Record<string, number>; // current remaining (X01) or score (highscore)
  cricket?: CricketState;
  around?: AroundState;
  bobs?: BobsState;
  shanghai?: ShanghaiState;
  killer?: KillerState;
  winnerId?: string;
  legWinnerId?: string;
  setWinnerId?: string;
  startedAt: number;
  endedAt?: number;
};

export type CricketState = {
  // marks per player per number (20,19,18,17,16,15,25). 0..3
  marks: Record<string, Record<number, number>>;
  closed: Record<number, string | null>; // null = open, otherwise player id who fully closed
  scoring: "standard" | "noscore"; // points or cutthroat-light
};

export type AroundState = {
  target: Record<string, number>; // next number to hit, 1..20 then 25
  requireDouble?: boolean;
};

export type BobsState = {
  /** Bob's 27: target double n, n=1..20. Start with 27 points. */
  target: Record<string, number>;
  points: Record<string, number>;
  finished: Record<string, boolean>;
};

export type ShanghaiState = {
  round: number; // 1..20 (or 21 = bull)
};

export type KillerState = {
  numbers: Record<string, number>; // each player gets a number 1..20
  lives: Record<string, number>;
  killers: Record<string, boolean>; // reached killer status (hit own double 1x)
};

export type Settings = {
  voice: boolean;
  voiceLang: "de" | "en";
  voicePack: "auto" | "pdc" | "de" | "browser";
  sound: boolean;
  haptic: boolean;
  bigDisplay: boolean;
  showCheckout: boolean;
  inputMode: "total" | "darts"; // total = 3-dart total, darts = each dart
  language: "de" | "en";
};

export const DEFAULT_SETTINGS: Settings = {
  voice: true,
  voiceLang: "en",
  voicePack: "auto",
  sound: true,
  haptic: true,
  bigDisplay: true,
  showCheckout: true,
  inputMode: "total",
  language: "de",
};

export function dartValue(d: Dart): number {
  if (d.segment === 0) return 0;
  if (d.segment === 25) return d.multiplier === 2 ? 50 : 25;
  return d.segment * d.multiplier;
}

export function isDouble(d: Dart): boolean {
  return d.multiplier === 2;
}
export function isTriple(d: Dart): boolean {
  return d.multiplier === 3 && d.segment !== 25;
}
