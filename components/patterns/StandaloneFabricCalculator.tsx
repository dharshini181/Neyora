"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import FabricBreakdown from "@/components/patterns/FabricBreakdown";
import { calculateFabric } from "@/lib/pattern-engine/generate";
import type { DressType } from "@/lib/data/patterns";

const inputClass =
  "w-full rounded-xl border border-primary/15 bg-card px-4 py-3 text-sm text-white outline-none transition-all focus:border-primary/60 focus:shadow-glow-sm";

export default function StandaloneFabricCalculator({ dressTypes }: { dressTypes: DressType[] }) {
  const [dressTypeId, setDressTypeId] = useState(dressTypes[0]?.id ?? "");
  const [height, setHeight] = useState<string>("64");
  const [waist, setWaist] = useState<string>("");
  const [unit, setUnit] = useState<"inch" | "cm">("inch");

  const dressType = dressTypes.find((d) => d.id === dressTypeId);

  const fabric = useMemo(() => {
    if (!dressType) return null;
    return calculateFabric(
      dressType.name,
      {
        height: height ? Number(height) : undefined,
        waist: waist ? Number(waist) : undefined,
        unit,
      },
      dressType.base_fabric_meters ?? 3
    );
  }, [dressType, height, waist, unit]);

  if (dressTypes.length === 0) {
    return (
      <GlassCard className="max-w-xl text-center">
        <p className="text-sm text-secondary">
          Connect Supabase and run <code className="text-primary">supabase/schema.sql</code> to
          load the dress type catalogue.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <GlassCard>
        <h2 className="mb-5 flex items-center gap-2 text-sm font-medium text-white/80">
          <Calculator size={15} className="text-primary" /> Quick Fabric Estimate
        </h2>
        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm text-white/80">Dress type</label>
            <select
              className={inputClass}
              value={dressTypeId}
              onChange={(e) => setDressTypeId(e.target.value)}
            >
              {dressTypes.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm text-white/80">Height</label>
              <input
                type="number"
                className={inputClass}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-white/80">Unit</label>
              <select
                className={inputClass}
                value={unit}
                onChange={(e) => setUnit(e.target.value as "inch" | "cm")}
              >
                <option value="inch">Inches</option>
                <option value="cm">Centimeters</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-white/80">Waist (optional, for elastic)</label>
            <input
              type="number"
              className={inputClass}
              placeholder="Only needed for Salwar/Churidar/Kids Wear"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
            />
          </div>

          <p className="text-[11px] text-secondary/70">
            This is a quick standalone estimate. For a saved, printable pattern tied to a customer,
            use{" "}
            <a href="/dashboard/patterns/new" className="text-primary hover:underline">
              Generate Pattern
            </a>{" "}
            instead.
          </p>
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="mb-5 text-sm font-medium text-white/80">Requirement Breakdown</h2>
        {fabric && <FabricBreakdown fabric={fabric} />}
      </GlassCard>
    </div>
  );
}
