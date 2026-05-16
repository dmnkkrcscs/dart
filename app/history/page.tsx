"use client";

import Header from "@/components/Header";
import { useDB } from "@/lib/store";

export default function HistoryPage() {
  const history = useDB(s => s.history);
  const players = useDB(s => s.players);
  const del = useDB(s => s.deleteMatch);
  const clear = useDB(s => s.clearHistory);
  const pmap = Object.fromEntries(players.map(p => [p.id, p]));

  return (
    <>
      <Header title="Verlauf" right={history.length > 0 ?
        <button onClick={() => confirm("Wirklich alles löschen?") && clear()} className="btn-ghost !px-3 !py-2 text-bad">Alles löschen</button> : null
      }/>
      {history.length === 0 ? (
        <div className="card p-6 text-center text-muted">Noch keine Matches gespielt.</div>
      ) : (
        <div className="space-y-2">
          {history.map(m => {
            const winner = m.winnerId ? pmap[m.winnerId] : null;
            return (
              <div key={m.id} className="card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase text-muted">{m.mode}</div>
                    <div className="font-bold">{new Date(m.startedAt).toLocaleString()}</div>
                  </div>
                  {winner && (
                    <div className="flex items-center gap-2">
                      <span className="grid h-7 w-7 place-items-center rounded-full text-xs font-black" style={{background: winner.color}}>{winner.avatar}</span>
                      <span className="font-semibold">🏆 {winner.name}</span>
                    </div>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted">
                  {m.players.map(id => pmap[id] && (
                    <span key={id} className="chip">{pmap[id].name}{m.legsWon[id] ? `: ${m.legsWon[id]} Legs` : ""}</span>
                  ))}
                </div>
                <div className="mt-2 flex justify-end">
                  <button onClick={() => del(m.id)} className="text-xs text-bad">Löschen</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
