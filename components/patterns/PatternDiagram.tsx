import type { PatternResult } from "@/lib/pattern-engine/generate";

const COLORS = ["#00FF88", "#00c46c", "#00a35a"];

/** Renders each pattern piece as a labeled, roughly-to-scale rectangle. */
export default function PatternDiagram({ pattern }: { pattern: PatternResult }) {
  const maxHeight = Math.max(...pattern.pieces.map((p) => p.height), 1);
  const scale = 220 / maxHeight;
  const gap = 24;
  let x = 20;

  const rects = pattern.pieces.map((p, i) => {
    const w = p.width * scale;
    const h = p.height * scale;
    const rect = { x, y: 260 - h, w, h, color: COLORS[i % COLORS.length], piece: p };
    x += w + gap;
    return rect;
  });

  const totalWidth = x + 20;

  return (
    <svg viewBox={`0 0 ${Math.max(totalWidth, 320)} 300`} className="w-full">
      <line x1="0" y1="262" x2={Math.max(totalWidth, 320)} y2="262" stroke="rgba(0,255,136,0.15)" strokeWidth="1" />
      {rects.map((r, i) => (
        <g key={i}>
          <rect
            x={r.x}
            y={r.y}
            width={r.w}
            height={r.h}
            rx="4"
            fill={`${r.color}14`}
            stroke={r.color}
            strokeWidth="1.5"
            strokeDasharray="5 3"
          />
          <text x={r.x + r.w / 2} y={r.y - 8} textAnchor="middle" fontSize="11" fill="#00FF88" fontWeight="600">
            {r.piece.name}
          </text>
          <text x={r.x + r.w / 2} y={r.y + r.h / 2} textAnchor="middle" fontSize="10" fill="#9CA3AF">
            {r.piece.width}×{r.piece.height} {pattern.unit}
          </text>
        </g>
      ))}
    </svg>
  );
}
