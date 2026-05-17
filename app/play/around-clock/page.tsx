"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import GameSetup from "@/components/GameSetup";
import { useDB, newMatchId } from "@/lib/store";
import { Match, Player } from "@/lib/types";
import { beep } from "@/lib/voice";

export default function AroundPage() {
  const players = useDB(s => s.players);
  const saveMatch = useDB(s => s.saveMatch);
  const settings = useDB(s => s.settings);
  const router = useRouter();
  const [match, setMatch] = useState<Match | null>(null);
  const [history, setHistory] = useState<Match[]>([]);
  const playerMap = useMemo(() => Object.fromEntries(players.map(p => [p.id, p])), [players]);
  const [includeBull, setIncludeBull] = useState(true);

  function start(ids: string[]) {
    const target: Record<string, number> = {};
    for (const id of ids) target[id] = 1;
    const m: Match = {
      id: newMatchId(),
      mode: "around",
      config: { includeBull },
      players: ids,
      visits: [],
      legsWon: Object.fromEntries(ids.map(id => [id, 0])),
      setsWon: Object.fromEntries(ids.map(id => [id, 0])),
      currentPlayerIdx: 0, startingPlayerIdx: 0,
      scores: Object.fromEntries(ids.map(id => [id, 1])),
      around: { target },
      startedAt: Date.now(),
    };
    setMatch(m);
  }

  function dart(hit: number) {
    if (!match || !match.around || match.winnerId) return;
    setHistory(h => [...h, JSON.parse(JSON.stringify(match))]);
    const pid = match.players[match.currentPlayerIdx];
    const tgt = match.around.target[pid];
    const target = { ...match.around.target };
    let winnerId: string | undefined;
    if (hit === tgt) {
      target[pid] = tgt === 20 ? (includeBull ? 25 : 21) : tgt + 1;
      if (target[pid] === 21 || target[pid] === 26) {
        winnerId = pid;
      }
      if (settings.sound) beep(880, 60);
    } else {
      if (settings.sound) beep(220, 60);
    }
    setMatch({
      ...match,
      around: { target },
      scores: { ...match.scores, [pid]: target[pid] },
      winnerId,
      endedAt: winnerId ? Date.now() : undefined,
    });
    if (winnerId) saveMatch({ ...match, around: { target }, scores: { ...match.scores, [pid]: target[pid] }, winnerId, endedAt: Date.now() });
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

  if (!match) return (
    <GameSetup title="Around the Clock" description={"Reihum 1, 2, 3 … bis 20 treffen (optional danach Bull). Jeder Spieler hat ein eigenes Ziel; bei Treffer rückt nur dieser Spieler eine Zahl weiter. Eingabe pro Dart — nach 3 Darts mit „Nächster Spieler“ weitergeben. Erster durch gewinnt."}
      min={1} max={8} onStart={start}
      extra={
        <div className="card p-4 flex items-center justify-between">
          <span>Mit Bull am Ende</span>
          <button onClick={() => setIncludeBull(v => !v)} className={`chip ${includeBull ? "bg-accent text-white" : ""}`}>{includeBull ? "An" : "Aus"}</button>
        </div>
      }/>);

  const currentId = match.players[match.currentPlayerIdx];
  const current = playerMap[currentId];
  const activePlayers = match.players.map(id => playerMap[id]).filter(Boolean) as Player[];
  const currentTargetLabel = match.around!.target[currentId] === 25 ? "Bull" : String(match.around!.target[currentId]);

  return (
    <>
      <Header title="Around the Clock"
        right={<button onClick={() => confirm("Beenden?") && router.push("/")} className="btn-ghost !px-3 !py-2">✕</button>}/>
      {match.winnerId && <div className="card mb-4 p-6 text-center animate-pop"><div className="text-5xl">🏆</div><div className="mt-2 text-2xl font-black">{playerMap[match.winnerId]?.name} gewinnt!</div></div>}
      <section className="card mb-4 divide-y divide-line">
        {activePlayers.map(p => {
          const isCur = p.id === currentId;
          return (
            <div key={p.id} className={`relative flex items-center justify-between p-4 ${isCur ? "bg-accent/[0.08]" : ""}`}>
              {isCur && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-grad-accent"/>}
              <div className="flex items-center gap-3">
                <span className={`grid h-9 w-9 place-items-center rounded-full font-black ${isCur ? "ring-2 ring-accent ring-offset-2 ring-offset-panel" : ""}`} style={{ background: p.color }}>{p.avatar}</span>
                <div className={`font-bold ${isCur ? "text-ink" : "text-muted"}`}>{p.name}{isCur && <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-accent">am Wurf</span>}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted">Nächste</div>
                <div className={`score-big text-3xl font-black ${isCur ? "text-accent" : "text-muted"}`}>{match.around!.target[p.id] === 25 ? "BULL" : match.around!.target[p.id] > 20 ? "✔" : match.around!.target[p.id]}</div>
              </div>
            </div>
          );
        })}
      </section>
      {!match.winnerId && (
        <>
          <div className="mb-3 flex items-center justify-between">
            <div className="chip">Eingabe für: <b className="ml-1 text-ink">{current?.name}</b></div>
            <div className="chip">Ziel <b className="ml-1 text-ink">{currentTargetLabel}</b></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => dart(match.around!.target[currentId])} className="btn-primary h-16 text-lg">✓ Treffer</button>
            <button onClick={() => dart(-1)} className="btn-ghost h-16 text-lg">✗ Daneben</button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button onClick={nextPlayer} className="btn-outline">Nächster Spieler →</button>
            <button onClick={undo} className="btn-ghost">↶ Undo</button>
          </div>
          <div className="mt-3 text-center text-xs text-muted">Ein Klick = ein Dart. Nach 3 Darts weitergeben.</div>
        </>
      )}
    </>
  );
}
