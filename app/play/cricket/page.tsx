"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import GameSetup from "@/components/GameSetup";
import { useDB, newMatchId } from "@/lib/store";
import { Match, Player } from "@/lib/types";
import { beep, vibrate } from "@/lib/voice";

const NUMBERS = [20, 19, 18, 17, 16, 15, 25];

type Marks = Record<string, Record<number, number>>;

export default function CricketPage() {
  const players = useDB(s => s.players);
  const saveMatch = useDB(s => s.saveMatch);
  const settings = useDB(s => s.settings);
  const router = useRouter();
  const [match, setMatch] = useState<Match | null>(null);
  const [history, setHistory] = useState<Match[]>([]); // local undo stack

  const playerMap = useMemo(() => Object.fromEntries(players.map(p => [p.id, p])), [players]);

  function start(ids: string[]) {
    const scores: Record<string, number> = {};
    const marks: Marks = {};
    for (const id of ids) {
      scores[id] = 0;
      marks[id] = {};
      for (const n of NUMBERS) marks[id][n] = 0;
    }
    const m: Match = {
      id: newMatchId(),
      mode: "cricket",
      config: { scoring: "standard" },
      players: ids,
      visits: [],
      legsWon: Object.fromEntries(ids.map(id => [id, 0])),
      setsWon: Object.fromEntries(ids.map(id => [id, 0])),
      currentPlayerIdx: 0,
      startingPlayerIdx: 0,
      scores,
      cricket: { marks, closed: Object.fromEntries(NUMBERS.map(n => [n, null])), scoring: "standard" },
      startedAt: Date.now(),
    };
    setMatch(m);
  }

  function isClosedForAll(num: number, marks: Marks, ids: string[]): boolean {
    return ids.every(id => marks[id][num] >= 3);
  }

  function hit(num: number, mult: 1 | 2 | 3) {
    if (!match || !match.cricket || match.winnerId) return;
    setHistory(h => [...h, JSON.parse(JSON.stringify(match))]);
    const pid = match.players[match.currentPlayerIdx];
    const marks = JSON.parse(JSON.stringify(match.cricket.marks)) as Marks;
    const scores = { ...match.scores };
    let m = mult;
    if (num === 25 && m === 3) m = 2;
    let remaining = m;
    while (remaining > 0) {
      const current = marks[pid][num];
      if (current < 3) {
        marks[pid][num]++;
      } else {
        // already closed by player → if open elsewhere, score points
        const closedByAll = isClosedForAll(num, marks, match.players);
        if (!closedByAll) scores[pid] += (num === 25 ? 25 : num);
      }
      remaining--;
    }
    const closed: Record<number, string | null> = { ...match.cricket.closed };
    if (isClosedForAll(num, marks, match.players)) closed[num] = pid;

    // Win check: all numbers closed AND highest score
    const allClosed = NUMBERS.every(n => isClosedForAll(n, marks, match.players));
    let winnerId: string | undefined;
    if (allClosed) {
      const top = match.players.reduce((a, b) => (scores[a] >= scores[b] ? a : b));
      winnerId = top;
    }
    // own-numbers-closed completion (alt): when one player closes ALL their numbers AND is leading
    const playerClosedAll = NUMBERS.every(n => marks[pid][n] >= 3);
    if (playerClosedAll) {
      const leading = match.players.every(id => scores[pid] >= scores[id]);
      if (leading) winnerId = pid;
    }

    if (settings.sound) beep(660, 50);
    if (settings.haptic) vibrate(10);
    const updated: Match = {
      ...match,
      scores,
      cricket: { ...match.cricket, marks, closed },
      currentPlayerIdx: winnerId ? match.currentPlayerIdx : (match.currentPlayerIdx + 1 + Math.floor(0/3)) % match.players.length,
      winnerId,
      endedAt: winnerId ? Date.now() : undefined,
    };
    setMatch(updated);
    if (winnerId) saveMatch(updated);
  }

  function nextPlayer() {
    if (!match || match.winnerId) return;
    setHistory(h => [...h, JSON.parse(JSON.stringify(match))]);
    setMatch({ ...match, currentPlayerIdx: (match.currentPlayerIdx + 1) % match.players.length });
  }

  function undo() {
    const last = history[history.length - 1];
    if (!last) return;
    setHistory(history.slice(0, -1));
    setMatch(last);
  }

  if (!match) return <GameSetup title="Cricket" description="Schließe 20, 19, 18, 17, 16, 15 und Bull mit je 3 Treffern. Single/Double/Triple zählen." min={1} max={6} onStart={start}/>;

  const activePlayers = match.players.map(id => playerMap[id]).filter(Boolean) as Player[];
  const currentId = match.players[match.currentPlayerIdx];
  const cricket = match.cricket!;

  function markSym(c: number, closedByAll: boolean) {
    if (c >= 3) return closedByAll ? "■" : "✕";
    if (c === 2) return "✕";
    if (c === 1) return "/";
    return "·";
  }

  return (
    <>
      <Header title="Cricket"
        right={<button onClick={() => confirm("Beenden?") && router.push("/")} className="btn-ghost !px-3 !py-2">✕</button>}/>

      {match.winnerId && (
        <div className="card mb-4 p-6 text-center animate-pop">
          <div className="text-5xl">🏆</div>
          <div className="mt-2 text-2xl font-black">{playerMap[match.winnerId]?.name} gewinnt!</div>
        </div>
      )}

      <section className="card mb-4 overflow-x-auto no-scrollbar">
        <div className="grid min-w-[480px]" style={{ gridTemplateColumns: `minmax(120px,1.6fr) repeat(${NUMBERS.length}, minmax(36px,1fr)) minmax(48px,0.9fr)` }}>
          <div className="sticky left-0 z-10 border-b border-line bg-panel2 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted">Spieler</div>
          {NUMBERS.map(n => (
            <div key={n} className="border-b border-line bg-panel2 py-2 text-center text-[11px] font-black num-tnum">{n === 25 ? "B" : n}</div>
          ))}
          <div className="border-b border-line bg-panel2 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-muted">Pkt</div>
          {activePlayers.map(p => {
            const isCur = p.id === currentId;
            return (
              <div key={p.id} className="contents">
                <div className={`sticky left-0 z-10 flex items-center gap-2 px-3 py-2.5 ${isCur ? "bg-accent/[0.08]" : "bg-panel"}`}>
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-[11px] font-black text-black/85" style={{background: p.color}}>{p.avatar}</span>
                  <span className="truncate text-sm font-semibold">{p.name}</span>
                </div>
                {NUMBERS.map(n => {
                  const c = cricket.marks[p.id][n];
                  const closedByAll = cricket.closed[n] !== null;
                  const sym = markSym(c, closedByAll);
                  return (
                    <div key={n} className={`grid place-items-center py-2 font-mono text-lg leading-none ${isCur ? "bg-accent/[0.08]" : ""} ${closedByAll ? "text-dim" : c >= 3 ? "text-good" : c > 0 ? "text-ink" : "text-dim"}`}>
                      {sym}
                    </div>
                  );
                })}
                <div className={`grid place-items-center py-2 text-sm font-black num-tnum ${isCur ? "bg-accent/[0.08]" : ""}`}>{match.scores[p.id]}</div>
              </div>
            );
          })}
        </div>
      </section>

      {!match.winnerId && (
        <>
          <div className="mb-2 flex items-center justify-between">
            <span className="chip">Wurf von</span>
            <span className="text-sm font-bold">{playerMap[currentId]?.name}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {NUMBERS.map(n => (
              <div key={n} className="card p-2.5">
                <div className="mb-1.5 text-center text-sm font-black num-tnum">{n === 25 ? "Bull" : n}</div>
                <div className="grid grid-cols-3 gap-1">
                  <button onClick={() => hit(n, 1)} className="btn-ghost !py-2 !px-0 text-sm font-bold">S</button>
                  <button onClick={() => hit(n, 2)} className="btn-ghost !py-2 !px-0 text-sm font-bold">D</button>
                  <button onClick={() => hit(n, 3)} disabled={n===25} className="btn-ghost !py-2 !px-0 text-sm font-bold disabled:opacity-25">T</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button onClick={nextPlayer} className="btn-outline">Nächster Spieler →</button>
            <button onClick={undo} className="btn-ghost">↶ Undo</button>
          </div>
        </>
      )}
    </>
  );
}
