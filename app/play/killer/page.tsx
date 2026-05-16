"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import GameSetup from "@/components/GameSetup";
import { useDB, newMatchId } from "@/lib/store";
import { Match, Player } from "@/lib/types";

/** Killer: jeder Spieler hat eine eigene Nummer. Erst eigene Doppel treffen, dann Killer-Status. Killer treffen Doppel anderer → minus 1 Leben. 0 = raus. */
export default function KillerPage() {
  const players = useDB(s => s.players);
  const saveMatch = useDB(s => s.saveMatch);
  const router = useRouter();
  const [match, setMatch] = useState<Match | null>(null);
  const [history, setHistory] = useState<Match[]>([]);
  const playerMap = useMemo(() => Object.fromEntries(players.map(p => [p.id, p])), [players]);
  const [lives, setLives] = useState(3);

  function start(ids: string[]) {
    // assign random numbers 1..20, no duplicates
    const pool = [...Array(20)].map((_,i)=>i+1).sort(() => Math.random() - 0.5);
    const numbers: Record<string, number> = {};
    const livesMap: Record<string, number> = {};
    const killers: Record<string, boolean> = {};
    ids.forEach((id, i) => { numbers[id] = pool[i]; livesMap[id] = lives; killers[id] = false; });
    setMatch({
      id: newMatchId(), mode: "killer", config: { lives },
      players: ids, visits: [],
      legsWon: Object.fromEntries(ids.map(id => [id, 0])),
      setsWon: Object.fromEntries(ids.map(id => [id, 0])),
      currentPlayerIdx: 0, startingPlayerIdx: 0,
      scores: livesMap,
      killer: { numbers, lives: livesMap, killers },
      startedAt: Date.now(),
    });
  }

  function becomeKiller() {
    if (!match || !match.killer) return;
    setHistory(h => [...h, JSON.parse(JSON.stringify(match))]);
    const pid = match.players[match.currentPlayerIdx];
    setMatch({ ...match, killer: { ...match.killer, killers: { ...match.killer.killers, [pid]: true } }});
  }

  function hitDoubleOf(targetId: string) {
    if (!match || !match.killer) return;
    setHistory(h => [...h, JSON.parse(JSON.stringify(match))]);
    const pid = match.players[match.currentPlayerIdx];
    const killer = match.killer;
    const isOwn = targetId === pid;
    let livesMap = { ...killer.lives };
    let killers = { ...killer.killers };
    if (isOwn && !killers[pid]) {
      killers[pid] = true; // promote to killer
    } else if (killers[pid] && !isOwn) {
      livesMap[targetId] = Math.max(0, livesMap[targetId] - 1);
    }
    const alive = match.players.filter(id => livesMap[id] > 0);
    let winnerId: string | undefined;
    if (alive.length <= 1) winnerId = alive[0] || match.players[0];
    const updated: Match = {
      ...match,
      killer: { ...killer, lives: livesMap, killers },
      scores: livesMap,
      currentPlayerIdx: (match.currentPlayerIdx + 1) % match.players.length,
      winnerId,
      endedAt: winnerId ? Date.now() : undefined,
    };
    setMatch(updated);
    if (winnerId) saveMatch(updated);
  }
  function nextPlayer() {
    if (!match) return;
    setHistory(h => [...h, JSON.parse(JSON.stringify(match))]);
    setMatch({ ...match, currentPlayerIdx: (match.currentPlayerIdx + 1) % match.players.length });
  }
  function undo() {
    const last = history[history.length - 1];
    if (!last) return;
    setHistory(history.slice(0, -1));
    setMatch(last);
  }

  if (!match) return <GameSetup title="Killer" description="Party-Modus. Jeder bekommt eine Zufallsnummer. Erst eigenes Doppel → Killer. Dann Doppel der anderen treffen, um Leben abzuziehen. Letzter Überlebender gewinnt."
    min={2} max={8} onStart={start}
    extra={
      <div className="card p-4 flex items-center justify-between">
        <span>Leben pro Spieler</span>
        <div className="flex gap-1">{[3,5,7].map(n => <button key={n} onClick={() => setLives(n)} className={`chip ${lives===n ? "bg-accent text-white":""}`}>{n}</button>)}</div>
      </div>
    }/>;

  const currentId = match.players[match.currentPlayerIdx];
  const me = playerMap[currentId];
  const myKiller = match.killer!.killers[currentId];
  const myNum = match.killer!.numbers[currentId];
  const activePlayers = match.players.map(id => playerMap[id]).filter(Boolean) as Player[];

  return (
    <>
      <Header title="Killer"
        right={<button onClick={() => confirm("Beenden?") && router.push("/")} className="btn-ghost !px-3 !py-2">✕</button>}/>
      {match.winnerId && <div className="card mb-4 p-6 text-center animate-pop"><div className="text-5xl">🏆</div><div className="mt-2 text-2xl font-black">{playerMap[match.winnerId]?.name} überlebt!</div></div>}
      <section className="card mb-4 divide-y divide-line">
        {activePlayers.map(p => {
          const alive = match.killer!.lives[p.id] > 0;
          return (
            <div key={p.id} className={`flex items-center justify-between p-4 ${p.id === currentId ? "bg-accent/5" : ""} ${!alive ? "opacity-40" : ""}`}>
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full font-black" style={{ background: p.color }}>{p.avatar}</span>
                <div>
                  <div className="font-bold">{p.name} <span className="text-muted text-xs">· D{match.killer!.numbers[p.id]}</span></div>
                  <div className="text-xs text-muted">{match.killer!.killers[p.id] ? "🗡 Killer" : "noch kein Killer"}</div>
                </div>
              </div>
              <div className="text-2xl">{"❤️".repeat(match.killer!.lives[p.id]) || "💀"}</div>
            </div>
          );
        })}
      </section>

      {!match.winnerId && (
        <>
          <div className="mb-2 text-xs uppercase tracking-wider text-muted">
            {me?.name} ({myKiller ? "Killer" : `→ erst D${myNum} treffen`})
          </div>
          <div className="grid grid-cols-2 gap-2">
            {!myKiller ? (
              <button onClick={() => hitDoubleOf(currentId)} className="btn-primary col-span-2 h-14">D{myNum} getroffen → Killer-Status</button>
            ) : (
              activePlayers.filter(p => p.id !== currentId && match.killer!.lives[p.id] > 0).map(p => (
                <button key={p.id} onClick={() => hitDoubleOf(p.id)} className="btn h-14"
                  style={{background: p.color, color: "#000"}}>−1 ❤ {p.name} (D{match.killer!.numbers[p.id]})</button>
              ))
            )}
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
