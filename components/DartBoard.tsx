"use client";

/** SVG dart board with optional heatmap overlay per segment. */
const ORDER = [20,1,18,4,13,6,10,15,2,17,3,19,7,16,8,11,14,9,12,5];

export default function DartBoard({ hits = {} }: { hits?: Record<string, number> }) {
  const cx = 200, cy = 200;
  const rOuter = 180;       // double outer
  const rDoubleIn = 168;
  const rOuterSingle = 168; // = rDoubleIn
  const rTripleOut = 110;
  const rTripleIn = 100;
  const rInnerSingle = 100;
  const rBull = 18;
  const rBullEye = 8;

  const max = Math.max(1, ...Object.values(hits));

  function colorFor(key: string): string {
    const v = (hits[key] || 0) / max;
    if (v === 0) return "rgba(255,255,255,0.04)";
    const alpha = 0.15 + v * 0.75;
    return `rgba(255,59,59,${alpha})`;
  }

  function arc(seg: number, rIn: number, rOut: number, mult: 1|2|3): JSX.Element {
    const idx = ORDER.indexOf(seg);
    const step = (Math.PI * 2) / 20;
    const a0 = -Math.PI/2 + idx * step - step/2;
    const a1 = a0 + step;
    const x0 = cx + rOut * Math.cos(a0);
    const y0 = cy + rOut * Math.sin(a0);
    const x1 = cx + rOut * Math.cos(a1);
    const y1 = cy + rOut * Math.sin(a1);
    const x2 = cx + rIn * Math.cos(a1);
    const y2 = cy + rIn * Math.sin(a1);
    const x3 = cx + rIn * Math.cos(a0);
    const y3 = cy + rIn * Math.sin(a0);
    const d = `M ${x0} ${y0} A ${rOut} ${rOut} 0 0 1 ${x1} ${y1} L ${x2} ${y2} A ${rIn} ${rIn} 0 0 0 ${x3} ${y3} Z`;
    const key = `${mult === 3 ? "T" : mult === 2 ? "D" : "S"}${seg}`;
    return <path key={`${seg}-${mult}-${rIn}`} d={d} fill={colorFor(key)} stroke="#0b0d10" strokeWidth={1}/>;
  }

  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-sm mx-auto">
      <circle cx={cx} cy={cy} r={rOuter + 12} fill="#0b0d10"/>
      <circle cx={cx} cy={cy} r={rOuter + 4} fill="#1c2026"/>
      {/* singles outer */}
      {ORDER.map(s => arc(s, rTripleOut, rDoubleIn, 1))}
      {/* doubles */}
      {ORDER.map(s => arc(s, rDoubleIn, rOuter, 2))}
      {/* singles inner */}
      {ORDER.map(s => arc(s, rBull, rTripleIn, 1))}
      {/* triples */}
      {ORDER.map(s => arc(s, rTripleIn, rTripleOut, 3))}
      {/* bull */}
      <circle cx={cx} cy={cy} r={rBull} fill={colorFor("25")} stroke="#0b0d10"/>
      <circle cx={cx} cy={cy} r={rBullEye} fill={colorFor("BULL")} stroke="#0b0d10"/>
      {/* numbers */}
      {ORDER.map((s, i) => {
        const step = (Math.PI * 2) / 20;
        const a = -Math.PI/2 + i * step;
        const x = cx + (rOuter + 18) * Math.cos(a);
        const y = cy + (rOuter + 18) * Math.sin(a);
        return <text key={s} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="fill-muted" fontSize="14" fontWeight={700}>{s}</text>;
      })}
    </svg>
  );
}
