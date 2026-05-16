"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import PlayerPicker from "@/components/PlayerPicker";
import Keypad from "@/components/Keypad";
import DartPad from "@/components/DartPad";
import { useDB, newMatchId } from "@/lib/store";
import { Dart, Match, Player, Visit, X01Config, dartValue, isDouble } from "@/lib/types";
import { getCheckout, hasCheckout } from "@/lib/checkouts";
import { announceCheckout, announceScore, beep, vibrate } from "@/lib/voice";

function Inner() {
  const search = useSearchParams();
  const router = useRouter();
  const players = useDB(s => s.players);
  const settings = useDB(s => s.settings);
  const saveMatch = useDB(s => s.saveMatch);
  const setLastConfig = useDB(s => s.setLastConfig);

  const startScore = parseInt(search.get("start") || "501", 10) as X01Config["startScore"];
  const legsParam = parseInt(search.get("legs") || "3", 10);

  const [config, setConfig] = useState<X01Config>({
    startScore: ([101,170,301,501,701,1001].includes(startScore) ? startScore : 501) as X01Config["startScore"],
    outMode: "double",
    inMode: "straight",
    legs: legsParam || 3,
    sets: 1,
  });
  const [selectedIds, setSelectedIds] = useState<string[]>(players[0] ? [players[0].id] : []);
  const [match, setMatch] = useState<Match | null>(null);
  const [inputMode, setInputMode] = useState<"total" | "darts">(settings.inputMode);
  const [confetti, setConfetti] = useState(false);

  const playerMap = useMemo(() => Object.fromEntries(players.map(p => [p.id, p])), [players]);
  const activePlayers: Player[] = match ? match.players.map(id => playerMap[id]).filter(Boolean) : [];

  function start() {
    if (selectedIds.length === 0) return;
    const scores: Record<string, number> = {};
    const legsWon: Record<string, number> = {};
    const setsWon: Record<string, number> = {};
    for (const id of selectedIds) { scores[id] = config.startScore; legsWon[id] = 0; setsWon[id] = 0; }
    const m: Match = {
      id: newMatchId(),
      mode: "x01",
      config,
      players: selectedIds,
      visits: [],
      legsWon, setsWon,
      currentPlayerIdx: 0,
      startingPlayerIdx: 0,
      scores,
      startedAt: Date.now(),
    };
    setLastConfig({ mode: "x01", config, players: selectedIds });
    setMatch(m);
  }

  function nextStartingPlayer(m: Match) {
    return (m.startingPlayerIdx + 1) % m.players.length;
  }

  function applyVisit(darts: Dart[]) {
    if (!match || match.winnerId) return;
    const playerId = match.players[match.currentPlayerIdx];
    const remaining = match.scores[playerId];
    let runningRemaining = remaining;
    let bust = false;
    let visitTotal = 0;
    let dartsUsed: Dart[] = [];

    for (const d of darts) {
      const v = dartValue(d);
      const after = runningRemaining - v;
      dartsUsed.push(d);
      visitTotal += v;
      if (after < 0) { bust = true; break; }
      if (after === 1 && config.outMode !== "single") { bust = true; break; }
      if (after === 0) {
        if (config.outMode === "double" && !isDouble(d)) { bust = true; break; }
        if (config.outMode === "master" && d.multiplier === 1) { bust = true; break; }
        runningRemaining = 0;
        break;
      }
      runningRemaining = after;
    }

    const visit: Visit = {
      playerId,
      darts: dartsUsed,
      bust,
      total: bust ? 0 : visitTotal,
      remainingAfter: bust ? remaining : runningRemaining,
      ts: Date.now(),
    };

    if (settings.sound) beep(bust ? 220 : visit.total === 180 ? 1320 : 660, bust ? 200 : 80);
    if (settings.haptic) vibrate(bust ? [40, 40, 40] : [20]);
    if (settings.voice) {
      if (visit.remainingAfter === 0) announceCheckout(playerMap[playerId]?.name || "", settings.voiceLang);
      else if (!bust) announceScore(visit.total, settings.voiceLang);
    }
    if (visit.total === 180) { setConfetti(true); setTimeout(() => setConfetti(false), 1500); }

    const newScores = { ...match.scores, [playerId]: visit.remainingAfter };
    let newLegsWon = { ...match.legsWon };
    let newSetsWon = { ...match.setsWon };
    let newPlayers = match.players;
    let nextIdx = (match.currentPlayerIdx + 1) % newPlayers.length;
    let legWinnerId: string | undefined;
    let setWinnerId: string | undefined;
    let winnerId: string | undefined;

    if (visit.remainingAfter === 0) {
      legWinnerId = playerId;
      newLegsWon[playerId] = (newLegsWon[playerId] || 0) + 1;
      if (newLegsWon[playerId] >= config.legs) {
        setWinnerId = playerId;
        newSetsWon[playerId] = (newSetsWon[playerId] || 0) + 1;
        if (newSetsWon[playerId] >= config.sets) winnerId = playerId;
        for (const id of newPlayers) newLegsWon[id] = 0;
      }
      // reset scores for next leg/set
      const resetScores: Record<string, number> = {};
      for (const id of newPlayers) resetScores[id] = config.startScore;
      const updated: Match = {
        ...match,
        visits: [...match.visits, visit],
        scores: winnerId ? newScores : resetScores,
        legsWon: newLegsWon,
        setsWon: newSetsWon,
        legWinnerId,
        setWinnerId,
        winnerId,
        currentPlayerIdx: winnerId ? match.currentPlayerIdx : nextStartingPlayer(match),
        startingPlayerIdx: nextStartingPlayer(match),
        endedAt: winnerId ? Date.now() : undefined,
      };
      setMatch(updated);
      if (winnerId) saveMatch(updated);
      return;
    }

    setMatch({
      ...match,
      visits: [...match.visits, visit],
      scores: newScores,
      currentPlayerIdx: nextIdx,
    });
  }

  function undo() {
    if (!match || match.visits.length === 0 || match.winnerId) return;
    const last = match.visits[match.visits.length - 1];
    const newVisits = match.visits.slice(0, -1);
    const newScores = { ...match.scores };
    // Recompute prevRemaining for the player who threw last
    const playerVisits = newVisits.filter(v => v.playerId === last.playerId);
    const startScore = config.startScore;
    let prev = startScore;
    // figure out their remaining respecting leg boundaries
    // Simple approach: replay all visits to reconstruct scores
    const replayScores: Record<string, number> = {};
    for (const id of match.players) replayScores[id] = startScore;
    let legActive = true;
    for (const v of newVisits) {
      if (!legActive) {
        for (const id of match.players) replayScores[id] = startScore;
        legActive = true;
      }
      if (!v.bust && v.remainingAfter === 0) { legActive = false; continue; }
      if (!v.bust) replayScores[v.playerId] = v.remainingAfter;
    }
    setMatch({
      ...match,
      visits: newVisits,
      scores: replayScores,
      currentPlayerIdx: (match.currentPlayerIdx - 1 + match.players.length) % match.players.length,
      legWinnerId: undefined,
      setWinnerId: undefined,
      winnerId: undefined,
      endedAt: undefined,
    });
  }

  function quit() {
    if (!match) return;
    if (confirm("Match wirklich beenden? Wird nicht gespeichert.")) router.push("/");
  }

  if (!match) {
    return (
      <>
        <Header title="X01 Setup" />
        <div className="space-y-4">
          <div className="card p-5">
            <div className="mb-3 chip">Startpunkte</div>
            <div className="grid grid-cols-3 gap-2">
              {[101,170,301,501,701,1001].map(n => (
                <button key={n}
                  onClick={() => setConfig(c => ({...c, startScore: n as X01Config["startScore"]}))}
                  className={`btn h-12 font-black num-tnum ${config.startScore === n ? "btn-primary" : "btn-ghost"}`}>{n}</button>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <div className="mb-3 chip">Out-Mode</div>
            <div className="grid grid-cols-3 gap-2">
              {([
                {k:"single", label:"Single"},
                {k:"double", label:"Double"},
                {k:"master", label:"Master"},
              ] as const).map(m => (
                <button key={m.k}
                  onClick={() => setConfig(c => ({...c, outMode: m.k}))}
                  className={`btn ${config.outMode === m.k ? "btn-primary" : "btn-ghost"} text-sm`}>{m.label}</button>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <div className="mb-3 chip">First to…</div>
            <div className="grid grid-cols-2 gap-3">
              <Stepper label="Legs" value={config.legs} min={1} max={9} onChange={v => setConfig(c => ({...c, legs: v}))}/>
              <Stepper label="Sets" value={config.sets} min={1} max={5} onChange={v => setConfig(c => ({...c, sets: v}))}/>
            </div>
          </div>

          <div className="card p-5">
            <PlayerPicker selected={selectedIds} onChange={setSelectedIds} min={1} max={8}/>
          </div>

          <button onClick={start} disabled={!selectedIds.length} className="btn-primary w-full h-14 text-base">
            Match starten →
          </button>
        </div>
      </>
    );
  }

  const currentId = match.players[match.currentPlayerIdx];
  const current = playerMap[currentId];
  const remaining = match.scores[currentId];
  const checkoutHint = settings.showCheckout && hasCheckout(remaining) ? getCheckout(remaining, 3)?.join(" · ") : null;

  // Stats for current visit player
  const playerVisits = match.visits.filter(v => v.playerId === currentId);
  let totalScored = 0, dartsTaken = 0;
  for (const v of playerVisits) { totalScored += v.total; dartsTaken += v.darts.length; }
  const avg = dartsTaken > 0 ? ((totalScored / dartsTaken) * 3).toFixed(1) : "0.0";

  return (
    <>
      <Header title={`${config.startScore}`}
        right={
          <div className="flex items-center gap-2">
            <span className="chip">Bo{config.legs * 2 - 1}</span>
            <button onClick={quit} className="btn-ghost !px-3 !py-2" aria-label="Beenden">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
        }/>

      {/* Scoreboard */}
      <section className="card mb-4 divide-y divide-line">
        {activePlayers.map((p, i) => {
          const isCur = i === match.currentPlayerIdx;
          const rem = match.scores[p.id];
          const co = hasCheckout(rem) ? getCheckout(rem, 3)?.join(" · ") : null;
          const v = match.visits.filter(x => x.playerId === p.id);
          let t = 0, d = 0; v.forEach(x => { t += x.total; d += x.darts.length; });
          const avgVal = d > 0 ? ((t / d) * 3).toFixed(1) : "—";
          const remStr = String(rem);
          const remSize = isCur
            ? remStr.length >= 4 ? "text-[40px]" : remStr.length === 3 ? "text-[52px]" : "text-[60px]"
            : remStr.length >= 4 ? "text-2xl" : "text-3xl";
          return (
            <div key={p.id} className={`relative flex items-center gap-3 px-4 py-3 ${isCur ? "bg-accent/[0.06]" : ""}`}>
              {isCur && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-grad-accent"/>}
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl font-black text-[15px] text-black/85 ${isCur ? "ring-2 ring-accent ring-offset-2 ring-offset-panel" : ""}`}
                    style={{ background: p.color }}>{p.avatar}</span>
              <div className="min-w-0 flex-1">
                <div className="font-bold truncate text-[15px]">{p.name}</div>
                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted">
                  <span className="num-tnum">Legs {match.legsWon[p.id] || 0}/{config.legs}</span>
                  <span className="text-dim">·</span>
                  <span className="num-tnum">Avg {avgVal}</span>
                </div>
              </div>
              <div className="text-right min-w-0">
                <div className={`score-big font-black leading-none ${remSize} ${isCur ? "text-ink" : "text-muted"}`}>{rem}</div>
                {isCur && co && (
                  <div className="mt-1 inline-flex items-center gap-1 rounded-md bg-accent2/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent2">
                    <span className="opacity-70">CO</span>{co}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Win banner */}
      {match.winnerId && (
        <section className="card mb-4 p-6 text-center animate-pop">
          <div className="text-5xl">🏆</div>
          <div className="mt-2 text-2xl font-black">{playerMap[match.winnerId]?.name} gewinnt!</div>
          <div className="mt-1 text-muted">Saved to history.</div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button onClick={() => router.push("/stats")} className="btn-outline">Statistik</button>
            <button onClick={() => router.push("/")} className="btn-primary">Fertig</button>
          </div>
        </section>
      )}

      {/* Input */}
      {!match.winnerId && (
        <>
          <div className="mb-3 flex items-center justify-between">
            <div className="chip">Du: <b className="ml-1 text-ink">{current?.name}</b></div>
            <div className="flex gap-2">
              <button onClick={() => setInputMode("total")}
                className={`chip ${inputMode === "total" ? "bg-accent text-white" : ""}`}>3-Wurf</button>
              <button onClick={() => setInputMode("darts")}
                className={`chip ${inputMode === "darts" ? "bg-accent text-white" : ""}`}>Einzel</button>
            </div>
          </div>

          {inputMode === "total" ? (
            <Keypad
              hint={checkoutHint ? `Checkout: ${checkoutHint}` : undefined}
              max={Math.min(180, remaining)}
              onSubmit={(total) => {
                // simulate a 3-dart visit as a synthetic dart of single-N or T20 chain.
                // For X01 input-by-total we just store the total but need at least one dart with valid checkout.
                if (total < 0 || total > 180) return;
                let darts: Dart[];
                if (total === 0) {
                  darts = [{segment: 0, multiplier: 1}, {segment: 0, multiplier: 1}, {segment: 0, multiplier: 1}];
                } else if (total === remaining && config.outMode === "double") {
                  // approximate as missing-darts + finishing-double. We use 2 placeholder S0 and 1 double = total/2 if even.
                  if (total === 50) darts = [{segment: 25, multiplier: 2}];
                  else if (total % 2 === 0 && total / 2 <= 20) darts = [{segment: total/2 as Dart["segment"], multiplier: 2}];
                  else if (total <= 60) darts = [{segment: (total-2)/1 as any, multiplier: 1}]; // fallback
                  else darts = [{segment: 20, multiplier: 3}, {segment: 20, multiplier: 3}, {segment: ((total-120)/2) as any, multiplier: 2}];
                } else {
                  // generic: encode as a single composite "dart" with multiplier 1 and segment 0 doesn't work; we fake 3 singles
                  // store one synthetic dart with segment-as-total isn't valid → store three darts approximating
                  const t = total;
                  if (t <= 60) darts = [{segment: t as Dart["segment"], multiplier: 1}];
                  else if (t <= 120) darts = [{segment: (t/2|0) as any, multiplier: 2}];
                  else darts = [{segment: 20, multiplier: 3}, {segment: 20, multiplier: 3}, {segment: (t-120) as any, multiplier: 1}];
                }
                // Use the recorded total directly via a custom path:
                applyVisitFromTotal(total);
              }}
              onUndo={undo}
            />
          ) : (
            <DartPad onVisit={applyVisit} onUndo={undo}/>
          )}

          <div className="mt-4 text-center text-xs text-muted">
            Wurf {match.visits.length + 1} · Avg {avg} · ⌨ Zahlen + Enter, U = Undo
          </div>
        </>
      )}

      {confetti && (
        <div className="pointer-events-none fixed inset-0 z-50 grid place-items-center">
          <div className="animate-pop rounded-3xl bg-accent px-10 py-8 text-center text-white shadow-glow">
            <div className="text-6xl font-black">180!</div>
            <div className="text-sm opacity-80">One Hundred and Eighty!</div>
          </div>
        </div>
      )}
    </>
  );

  function applyVisitFromTotal(total: number) {
    if (!match || match.winnerId) return;
    const playerId = match.players[match.currentPlayerIdx];
    const remaining = match.scores[playerId];
    let bust = false;
    let after = remaining - total;
    if (after < 0) bust = true;
    else if (after === 1 && config.outMode !== "single") bust = true;
    // We can't verify finishing-double from total alone — if user finishes, trust it.
    const visit: Visit = {
      playerId,
      darts: [{segment: 0, multiplier: 1}, {segment: 0, multiplier: 1}, {segment: 0, multiplier: 1}], // 3 darts placeholder
      bust,
      total: bust ? 0 : total,
      remainingAfter: bust ? remaining : after,
      ts: Date.now(),
    };
    if (settings.sound) beep(bust ? 220 : total === 180 ? 1320 : 660, bust ? 200 : 80);
    if (settings.haptic) vibrate(bust ? [40,40,40] : [20]);
    if (settings.voice) {
      if (visit.remainingAfter === 0) announceCheckout(playerMap[playerId]?.name || "", settings.voiceLang);
      else if (!bust) announceScore(visit.total, settings.voiceLang);
    }
    if (visit.total === 180) { setConfetti(true); setTimeout(() => setConfetti(false), 1500); }

    const newScores = { ...match.scores, [playerId]: visit.remainingAfter };
    let newLegsWon = { ...match.legsWon };
    let newSetsWon = { ...match.setsWon };
    let nextIdx = (match.currentPlayerIdx + 1) % match.players.length;
    let legWinnerId: string | undefined;
    let setWinnerId: string | undefined;
    let winnerId: string | undefined;

    if (visit.remainingAfter === 0) {
      legWinnerId = playerId;
      newLegsWon[playerId] = (newLegsWon[playerId] || 0) + 1;
      if (newLegsWon[playerId] >= config.legs) {
        setWinnerId = playerId;
        newSetsWon[playerId] = (newSetsWon[playerId] || 0) + 1;
        if (newSetsWon[playerId] >= config.sets) winnerId = playerId;
        for (const id of match.players) newLegsWon[id] = 0;
      }
      const resetScores: Record<string, number> = {};
      for (const id of match.players) resetScores[id] = config.startScore;
      const updated: Match = {
        ...match,
        visits: [...match.visits, visit],
        scores: winnerId ? newScores : resetScores,
        legsWon: newLegsWon,
        setsWon: newSetsWon,
        legWinnerId, setWinnerId, winnerId,
        currentPlayerIdx: winnerId ? match.currentPlayerIdx : nextStartingPlayer(match),
        startingPlayerIdx: nextStartingPlayer(match),
        endedAt: winnerId ? Date.now() : undefined,
      };
      setMatch(updated);
      if (winnerId) saveMatch(updated);
      return;
    }
    setMatch({
      ...match,
      visits: [...match.visits, visit],
      scores: newScores,
      currentPlayerIdx: nextIdx,
    });
  }
}

function Stepper({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v:number)=>void }) {
  return (
    <div className="rounded-xl bg-panel2 border border-line p-2">
      <div className="px-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted">{label}</div>
      <div className="flex items-center justify-between gap-1">
        <button onClick={() => onChange(Math.max(min, value - 1))} className="btn-ghost !px-3 !py-1.5 !rounded-lg text-base">−</button>
        <span className="num-tnum text-xl font-black w-8 text-center">{value}</span>
        <button onClick={() => onChange(Math.min(max, value + 1))} className="btn-ghost !px-3 !py-1.5 !rounded-lg text-base">+</button>
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<div className="p-4 text-muted">Lade…</div>}><Inner/></Suspense>;
}
