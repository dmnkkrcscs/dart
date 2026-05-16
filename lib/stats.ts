import { hasCheckout } from "./checkouts";
import { Match, Visit } from "./types";

export type PlayerStats = {
  matches: number;
  legs: number;
  visits: number;
  darts: number;
  totalScored: number;
  threeDartAvg: number;
  first9Avg: number;
  highestVisit: number;
  count180: number;
  count140: number;
  count100: number;
  count60: number;
  checkoutAttempts: number;
  checkoutsHit: number;
  checkoutPct: number;
  highestCheckout: number;
  segmentHits: Record<string, number>;
};

export function emptyStats(): PlayerStats {
  return {
    matches: 0, legs: 0, visits: 0, darts: 0, totalScored: 0,
    threeDartAvg: 0, first9Avg: 0, highestVisit: 0,
    count180: 0, count140: 0, count100: 0, count60: 0,
    checkoutAttempts: 0, checkoutsHit: 0, checkoutPct: 0, highestCheckout: 0,
    segmentHits: {},
  };
}

function dartKey(seg: number, mult: number): string {
  if (seg === 0) return "MISS";
  if (seg === 25) return mult === 2 ? "BULL" : "25";
  const p = mult === 3 ? "T" : mult === 2 ? "D" : "S";
  return `${p}${seg}`;
}

export function computeStats(matches: Match[], playerId: string): PlayerStats {
  const s = emptyStats();
  let f9scored = 0;
  let f9darts = 0;
  for (const m of matches) {
    if (!m.players.includes(playerId)) continue;
    s.matches++;
    s.legs += m.legsWon[playerId] || 0;
    const startScore = m.mode === "x01" ? (m.config?.startScore ?? 0) : 0;
    let visitsThisLeg = 0;
    let remainingBefore = startScore;
    for (const v of m.visits) {
      if (v.playerId !== playerId) {
        if (m.mode === "x01" && v.remainingAfter === 0 && !v.bust) {
          remainingBefore = startScore; visitsThisLeg = 0;
        }
        continue;
      }
      s.visits++;
      s.darts += v.darts.length;
      s.totalScored += v.total;
      if (v.total > s.highestVisit) s.highestVisit = v.total;
      if (v.total === 180) s.count180++;
      else if (v.total >= 140) s.count140++;
      else if (v.total >= 100) s.count100++;
      else if (v.total >= 60) s.count60++;
      for (const d of v.darts) {
        const k = dartKey(d.segment, d.multiplier);
        s.segmentHits[k] = (s.segmentHits[k] || 0) + 1;
      }
      if (m.mode === "x01" && visitsThisLeg < 3) {
        f9scored += v.total;
        f9darts += v.darts.length;
      }
      if (m.mode === "x01" && hasCheckout(remainingBefore)) {
        s.checkoutAttempts++;
      }
      if (m.mode === "x01" && v.remainingAfter === 0 && !v.bust) {
        s.checkoutsHit++;
        if (v.total > s.highestCheckout) s.highestCheckout = v.total;
      }
      visitsThisLeg++;
      remainingBefore = v.remainingAfter;
      if (v.remainingAfter === 0) {
        remainingBefore = startScore; visitsThisLeg = 0;
      }
    }
  }
  s.threeDartAvg = s.darts > 0 ? (s.totalScored / s.darts) * 3 : 0;
  s.first9Avg = f9darts > 0 ? (f9scored / f9darts) * 3 : 0;
  s.checkoutPct = s.checkoutAttempts > 0 ? (s.checkoutsHit / s.checkoutAttempts) * 100 : 0;
  return s;
}

export function avgOfVisits(visits: Visit[]): number {
  let total = 0, darts = 0;
  for (const v of visits) { total += v.total; darts += v.darts.length; }
  return darts > 0 ? (total / darts) * 3 : 0;
}
