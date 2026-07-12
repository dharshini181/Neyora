import type { FabricResult } from "@/lib/pattern-engine/generate";

const rows: { key: keyof FabricResult; label: string }[] = [
  { key: "mainFabric", label: "Main Fabric" },
  { key: "lining", label: "Lining" },
  { key: "lace", label: "Lace / Trim" },
  { key: "elastic", label: "Elastic" },
  { key: "interfacing", label: "Interfacing" },
];

export default function FabricBreakdown({ fabric }: { fabric: FabricResult }) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {rows.map(
          (r) =>
            Number(fabric[r.key]) > 0 && (
              <div key={r.key} className="rounded-xl bg-white/[0.03] px-4 py-3 text-center">
                <p className="text-[11px] text-secondary">{r.label}</p>
                <p className="text-lg font-medium text-white">
                  {fabric[r.key]}
                  <span className="text-xs text-secondary"> m</span>
                </p>
              </div>
            )
        )}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 px-5 py-4">
        <div>
          <p className="text-xs text-secondary">Total incl. {fabric.wastagePercent}% wastage</p>
          <p className="font-display text-2xl font-semibold text-primary">
            {fabric.totalWithWastage} m
          </p>
        </div>
      </div>
    </div>
  );
}
