export type BarDatum = { label: string; value: number };

export default function BarChart({
  data,
  valuePrefix = "",
  height = 180,
}: {
  data: BarDatum[];
  valuePrefix?: string;
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div>
      <svg viewBox={`0 0 ${data.length * 60} ${height}`} className="w-full" style={{ height }}>
        {data.map((d, i) => {
          const barHeight = (d.value / max) * (height - 30);
          const x = i * 60 + 10;
          return (
            <g key={d.label}>
              <rect
                x={x}
                y={height - 24 - barHeight}
                width="40"
                height={barHeight}
                rx="4"
                fill="#00FF88"
                fillOpacity="0.18"
                stroke="#00FF88"
                strokeWidth="1.5"
              />
              <text x={x + 20} y={height - 24 - barHeight - 8} textAnchor="middle" fontSize="10" fill="#00FF88">
                {barHeight > 0 ? `${valuePrefix}${Math.round(d.value)}` : ""}
              </text>
              <text x={x + 20} y={height - 6} textAnchor="middle" fontSize="10" fill="#9CA3AF">
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
