"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import GameSetup from "@/components/GameSetup";
import { useDB, newMatchId } from "@/lib/store";
import { Match, Player } from "@/lib/types";
import { beep } from "@/lib/voice";

/** Shanghai: 20 rounds (1..20). Each round, three darts at the round number. Score = sum of values. Shanghai (S+D+T in one round) = instant win. */
export default function ShanghaiPage() {
  const players = useDB(s => s.players);
  const saveMatch = useDB(s => s.saveMatch);
  const settings = useDB(s => s.settings);
  const router = useRouter();
  const [match, setMatch] = useState<Match | null>(null);
  const [history, setHistory] = useState<Match[]>([]);
  const playerMap = useMemo(() => Object.fromEntries(players.map(p => [p.id, p])), [players]);

  function start(ids: string[]) {
    setMatch({
      id: newMatchId(), mode: "shanghai", config: {},
      players: ids, visits: [],
      legsWon: Object.fromEntries(ids.map(id => [id, 0])),
      setsWon: Object.fromEntries(ids.map(id => [id, 0])),
      currentPlayerIdx: 0, startingPlayerIdx: 0,
      scores: Object.fromEntries(ids.map(id => [id, 0])),
      shanghai: { round: 1 },
      startedAt: Date.now(),
    });
  }

  function submit(s: number, d: number, t: number) {
    if (!match || !match.shanghai) return;
    setHistory(h => [...h, JSON.parse(JSON.stringify(match))]);
    const pid = match.players[match.currentPlayerIdx];
    const r = match.shanghai.round;
    const points = s * r + d * 2 * r + t * 3 * r;
    const scores = { ...match.scores, [pid]: match.scores[pid] + points };
    const shanghai = s > 0 && d > 0 && t > 0;
    if (settings.sound) beep(shanghai ? 1320 : 660, 80);
    let winnerId: string | undefined = shanghai ? pid : undefined;
    let nextIdx = (match.currentPlayerIdx + 1) % match.players.length;
    let nextRound = match.shanghai.round;
    if (nextIdx === match.startingPlayerIdx) nextRound++;
    if (nextRound > 20 && !winnerId) {
      winnerId = match.players.reduce((a,b) => scores[a] >= scores[b] ? a : b);
    }
    const updated: Match = {
      ...match,
      scores,
      shanghai: { round: nextRound },
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

  if (!match) return <GameSetup title="Shanghai" description="20 Runden. Pro Runde drei Würfe auf die Rundenzahl (1, dann 2 …). Single = 1×, Double = 2×, Triple = 3×. S + D + T in einer Runde = Shanghai, sofortiger Sieg." min={1} max={6} onStart={start}/>;

  const currentId = match.players[match.currentPlayerIdx];
  const r = match.shanghai!.round;
  const activePlayers = match.players.map(id => playerMap[id]).filter(Boolean) as Player[];

  return (
    <>
      <Header title={`Shanghai · Runde ${r}`}
        right={<button onClick={() => confirm("Beenden?") && router.push("/")} className="btn-ghost !px-3 !py-2">✕</button>}/>
      {match.winnerId && <div className="card mb-4 p-6 text-center animate-pop"><div className="text-5xl">🏆</div><div className="mt-2 text-2xl font-black">{playerMap[match.winnerId]?.name}</div></div>}
      <section className="card mb-4 divide-y divide-line">
        {activePlayers.map(p => (
          <div key={p.id} className={`flex items-center justify-between p-4 ${p.id === currentId ? "bg-accent/5" : ""}`}>
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full font-black" style={{ background: p.color }}>{p.avatar}</span>
              <div className="font-bold">{p.name}</div>
            </div>
            <div className="score-big text-2xl font-black">{match.scores[p.id]}</div>
          </div>
        ))}
      </section>
      {!match.winnerId && (
        <ShanghaiInput round={r} name={playerMap[currentId]?.name || ""} onSubmit={submit} onUndo={undo}/>
      )}
    </>
  );
}

function ShanghaiInput({ round, name, onSubmit, onUndo }: { round: number; name: string; onSubmit: (s:number,d:number,t:number)=>void; onUndo: ()=>void }) {
  const [s, setS] = useState(0);
  const [d, setD] = useState(0);
  const [t, setT] = useState(0);
  return (
    <>
      <div className="mb-2 text-xs uppercase tracking-wider text-muted">Treffer auf {round} für <b className="text-ink">{name}</b></div>
      <div className="grid grid-cols-3 gap-3">
        {[
          ["Single", s, setS],
          ["Double", d, setD],
          ["Triple", t, setT],
        ].map(([label, val, set]: any) => (
          <div key={label} className="card p-3 text-center">
            <div className="text-xs uppercase text-muted">{label}</div>
            <div className="my-1 text-3xl font-black">{val}</div>
            <div className="grid grid-cols-2 gap-1">
              <button onClick={() => set(Math.max(0, val - 1))} className="btn-ghost !py-1">−</button>
              <button onClick={() => set(Math.min(3, val + 1))} className="btn-ghost !py-1">+</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button onClick={() => { onSubmit(s,d,t); setS(0); setD(0); setT(0); }} className="btn-primary">Aufnahme bestätigen</button>
        <button onClick={onUndo} className="btn-ghost">↶ Undo</button>
      </div>
    </>
  );
}
