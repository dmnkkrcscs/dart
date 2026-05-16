"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import GameSetup from "@/components/GameSetup";
import { useDB, newMatchId } from "@/lib/store";
import { Match, Player } from "@/lib/types";
import { beep } from "@/lib/voice";

/** Bob's 27 — each player starts at 27 points. Round n: aim for D(n). +2n per hit, -2n if 0 hits in round. */
export default function BobsPage() {
  const players = useDB(s => s.players);
  const saveMatch = useDB(s => s.saveMatch);
  const settings = useDB(s => s.settings);
  const router = useRouter();
  const [match, setMatch] = useState<Match | null>(null);
  const [history, setHistory] = useState<Match[]>([]);
  const playerMap = useMemo(() => Object.fromEntries(players.map(p => [p.id, p])), [players]);

  function start(ids: string[]) {
    const points: Record<string, number> = {};
    const target: Record<string, number> = {};
    const finished: Record<string, boolean> = {};
    for (const id of ids) { points[id] = 27; target[id] = 1; finished[id] = false; }
    setMatch({
      id: newMatchId(), mode: "bobs27", config: {},
      players: ids, visits: [],
      legsWon: Object.fromEntries(ids.map(id => [id, 0])),
      setsWon: Object.fromEntries(ids.map(id => [id, 0])),
      currentPlayerIdx: 0, startingPlayerIdx: 0,
      scores: points, bobs: { target, points, finished },
      startedAt: Date.now(),
    });
  }

  function round(hits: number) {
    if (!match || !match.bobs) return;
    setHistory(h => [...h, JSON.parse(JSON.stringify(match))]);
    const pid = match.players[match.currentPlayerIdx];
    const tgt = match.bobs.target[pid];
    const delta = hits > 0 ? hits * 2 * tgt : -2 * tgt;
    const points = { ...match.bobs.points, [pid]: match.bobs.points[pid] + delta };
    const target = { ...match.bobs.target, [pid]: tgt + 1 };
    const finished = { ...match.bobs.finished };
    let alive = points[pid] > 0 && target[pid] <= 20;
    if (target[pid] > 20 || points[pid] <= 0) finished[pid] = true;
    if (settings.sound) beep(hits > 0 ? 880 : 220, 60);

    // advance player
    let nextIdx = match.currentPlayerIdx;
    const allDone = match.players.every(id => finished[id] || (id === pid && !alive));
    if (!allDone) {
      do { nextIdx = (nextIdx + 1) % match.players.length; }
      while (finished[match.players[nextIdx]] && nextIdx !== match.currentPlayerIdx);
    }
    let winnerId: string | undefined;
    if (allDone || match.players.every(id => finished[id])) {
      // top score wins
      winnerId = match.players.reduce((a,b) => points[a] >= points[b] ? a : b);
    }
    const updated: Match = {
      ...match,
      bobs: { target, points, finished },
      scores: points,
      currentPlayerIdx: nextIdx,
      winnerId,
      endedAt: winnerId ? Date.now() : undefined,
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

  if (!match) return <GameSetup title="Bob's 27" description="Solo & Crew-Trainer für Doppel. Start mit 27 Punkten. Runde n → 3 Würfe auf D(n). Treffer = +2n, kein Treffer = −2n. Bei 0 oder weniger Punkten ist aus." min={1} max={6} onStart={start}/>;

  const currentId = match.players[match.currentPlayerIdx];
  const tgt = match.bobs!.target[currentId];
  const finished = match.bobs!.finished[currentId];
  const activePlayers = match.players.map(id => playerMap[id]).filter(Boolean) as Player[];

  return (
    <>
      <Header title="Bob's 27"
        right={<button onClick={() => confirm("Beenden?") && router.push("/")} className="btn-ghost !px-3 !py-2">✕</button>}/>
      {match.winnerId && <div className="card mb-4 p-6 text-center animate-pop"><div className="text-5xl">🏆</div><div className="mt-2 text-2xl font-black">{playerMap[match.winnerId]?.name} mit {match.bobs!.points[match.winnerId]} Punkten</div></div>}
      <section className="card mb-4 divide-y divide-line">
        {activePlayers.map(p => (
          <div key={p.id} className={`flex items-center justify-between p-4 ${p.id === currentId ? "bg-accent/5" : ""}`}>
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full font-black" style={{ background: p.color }}>{p.avatar}</span>
              <div>
                <div className="font-bold">{p.name}</div>
                <div className="text-xs text-muted">Ziel: D{match.bobs!.target[p.id] > 20 ? "—" : match.bobs!.target[p.id]} {match.bobs!.finished[p.id] && "· Fertig"}</div>
              </div>
            </div>
            <div className={`score-big text-3xl font-black ${match.bobs!.points[p.id] <= 10 ? "text-bad" : "text-good"}`}>{match.bobs!.points[p.id]}</div>
          </div>
        ))}
      </section>
      {!match.winnerId && !finished && (
        <>
          <div className="mb-2 text-xs uppercase tracking-wider text-muted">Wie viele D{tgt} hat <b className="text-ink">{playerMap[currentId]?.name}</b> getroffen?</div>
          <div className="grid grid-cols-4 gap-2">
            {[0,1,2,3].map(n => (
              <button key={n} onClick={() => round(n)} className={`btn h-16 text-xl font-black ${n===0 ? "bg-bad" : n===3 ? "bg-good" : "bg-panel2"}`}>{n}</button>
            ))}
          </div>
          <div className="mt-3"><button onClick={undo} className="btn-ghost w-full">↶ Undo</button></div>
        </>
      )}
    </>
  );
}
