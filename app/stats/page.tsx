"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import DartBoard from "@/components/DartBoard";
import { useDB } from "@/lib/store";
import { computeStats } from "@/lib/stats";

export default function StatsPage() {
  const players = useDB(s => s.players);
  const history = useDB(s => s.history);
  const [pid, setPid] = useState(players[0]?.id || "");

  const stats = useMemo(() => pid ? computeStats(history, pid) : null, [history, pid]);

  function exportCSV() {
    if (!stats || !pid) return;
    const rows = [["metric","value"]];
    for (const [k,v] of Object.entries(stats)) {
      if (typeof v === "object") continue;
      rows.push([k, String(v)]);
    }
    for (const [k,v] of Object.entries(stats.segmentHits)) rows.push([`hit_${k}`, String(v)]);
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `bullseye-stats-${pid}.csv`;
    a.click();
  }

  return (
    <>
      <Header title="Statistik"/>
      {players.length === 0 ? (
        <div className="card p-6 text-center text-muted">Erst Spieler anlegen → dann gibt's hier Heatmaps.</div>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            {players.map(p => (
              <button key={p.id} onClick={() => setPid(p.id)}
                className={`flex items-center gap-2 rounded-full border px-3 py-2 ${pid === p.id ? "border-accent bg-accent/15" : "border-line bg-panel2"}`}>
                <span className="grid h-6 w-6 place-items-center rounded-full text-xs font-black" style={{background: p.color}}>{p.avatar}</span>
                <span className="font-semibold">{p.name}</span>
              </button>
            ))}
          </div>

          {stats && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <Stat label="3-Dart Ø" value={stats.threeDartAvg.toFixed(1)}/>
                <Stat label="First-9 Ø" value={stats.first9Avg.toFixed(1)}/>
                <Stat label="Checkout %" value={stats.checkoutPct.toFixed(0) + "%"}/>
                <Stat label="High Checkout" value={String(stats.highestCheckout)}/>
                <Stat label="180er" value={String(stats.count180)}/>
                <Stat label="140+" value={String(stats.count140)}/>
                <Stat label="100+" value={String(stats.count100)}/>
                <Stat label="Matches" value={String(stats.matches)}/>
              </div>

              <div className="card p-4 mb-4">
                <div className="mb-2 text-xs uppercase tracking-wider text-muted">Heatmap (wo trifft's hin)</div>
                <DartBoard hits={stats.segmentHits}/>
              </div>

              <div className="card p-4 mb-4">
                <div className="mb-2 text-xs uppercase tracking-wider text-muted">Top Felder</div>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(stats.segmentHits).sort((a,b) => b[1]-a[1]).slice(0,9).map(([k,v]) => (
                    <div key={k} className="rounded-lg bg-panel2 p-2 text-center">
                      <div className="font-bold">{k}</div>
                      <div className="text-xs text-muted">{v}×</div>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={exportCSV} className="btn-outline w-full">CSV exportieren</button>
            </>
          )}
        </>
      )}
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-3 text-center">
      <div className="text-xs uppercase text-muted">{label}</div>
      <div className="mt-1 text-2xl font-black">{value}</div>
    </div>
  );
}
