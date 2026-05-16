"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import GameSetup from "@/components/GameSetup";
import Keypad from "@/components/Keypad";
import { useDB, newMatchId } from "@/lib/store";
import { Match, Player } from "@/lib/types";

/** High Score: jeder Spieler hat 3 Aufnahmen (9 Darts). Höchste Summe gewinnt. */
export default function HighScorePage() {
  const players = useDB(s => s.players);
  const saveMatch = useDB(s => s.saveMatch);
  const router = useRouter();
  const [match, setMatch] = useState<Match | null>(null);
  const [history, setHistory] = useState<Match[]>([]);
  const playerMap = useMemo(() => Object.fromEntries(players.map(p => [p.id, p])), [players]);
  const [rounds, setRounds] = useState(3);

  function start(ids: string[]) {
    setMatch({
      id: newMatchId(), mode: "highscore", config: { rounds },
      players: ids, visits: [],
      legsWon: Object.fromEntries(ids.map(id => [id, 0])),
      setsWon: Object.fromEntries(ids.map(id => [id, 0])),
      currentPlayerIdx: 0, startingPlayerIdx: 0,
      scores: Object.fromEntries(ids.map(id => [id, 0])),
      startedAt: Date.now(),
    });
  }

  function submit(total: number) {
    if (!match) return;
    setHistory(h => [...h, JSON.parse(JSON.stringify(match))]);
    const pid = match.players[match.currentPlayerIdx];
    const visit = { playerId: pid, darts: [], total, remainingAfter: 0, ts: Date.now() } as any;
    const scores = { ...match.scores, [pid]: match.scores[pid] + total };
    const visits = [...match.visits, visit];
    const visitsByPlayer: Record<string, number> = {};
    for (const v of visits) visitsByPlayer[v.playerId] = (visitsByPlayer[v.playerId] || 0) + 1;
    const allDone = match.players.every(id => (visitsByPlayer[id] || 0) >= rounds);
    let winnerId: string | undefined;
    if (allDone) winnerId = match.players.reduce((a,b) => scores[a] >= scores[b] ? a : b);
    const updated: Match = {
      ...match, visits, scores,
      currentPlayerIdx: (match.currentPlayerIdx + 1) % match.players.length,
      winnerId, endedAt: winnerId ? Date.now() : undefined,
    };
    setMatch(updated);
    if (winnerId) saveMatch(updated);
  }
  function undo() {
    const last = history[history.length - 1];
    if (!last) return;
    setHistory(history.slice(0, -1));
    setMatch(last);
  }

  if (!match) return <GameSetup title="High Score" description="So viele Punkte wie möglich in N Aufnahmen. Höchste Summe gewinnt."
    min={1} max={6} onStart={start}
    extra={
      <div className="card p-4 flex items-center justify-between">
        <span>Aufnahmen pro Spieler</span>
        <div className="flex gap-1">
          {[3,5,8,10].map(n => (
            <button key={n} onClick={() => setRounds(n)} className={`chip ${rounds === n ? "bg-accent text-white" : ""}`}>{n}</button>
          ))}
        </div>
      </div>
    }/>;

  const currentId = match.players[match.currentPlayerIdx];
  const activePlayers = match.players.map(id => playerMap[id]).filter(Boolean) as Player[];

  return (
    <>
      <Header title="High Score"
        right={<button onClick={() => confirm("Beenden?") && router.push("/")} className="btn-ghost !px-3 !py-2">✕</button>}/>
      {match.winnerId && <div className="card mb-4 p-6 text-center animate-pop"><div className="text-5xl">🏆</div><div className="mt-2 text-2xl font-black">{playerMap[match.winnerId]?.name} mit {match.scores[match.winnerId]} Punkten</div></div>}
      <section className="card mb-4 divide-y divide-line">
        {activePlayers.map(p => {
          const taken = match.visits.filter(v => v.playerId === p.id).length;
          return (
            <div key={p.id} className={`flex items-center justify-between p-4 ${p.id === currentId ? "bg-accent/5" : ""}`}>
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full font-black" style={{ background: p.color }}>{p.avatar}</span>
                <div>
                  <div className="font-bold">{p.name}</div>
                  <div className="text-xs text-muted">{taken}/{rounds} Aufnahmen</div>
                </div>
              </div>
              <div className="score-big text-3xl font-black">{match.scores[p.id]}</div>
            </div>
          );
        })}
      </section>
      {!match.winnerId && (
        <Keypad onSubmit={submit} onUndo={undo}/>
      )}
    </>
  );
}
