"use client";

import { Ruler } from "lucide-react";
import DeleteButton from "@/components/ui/DeleteButton";
import { deleteMeasurement } from "@/lib/actions/customers";
import type { Measurement } from "@/lib/data/customers";

const rows: { key: keyof Measurement; label: string }[] = [
  { key: "bust", label: "Bust" },
  { key: "waist", label: "Waist" },
  { key: "hip", label: "Hip" },
  { key: "shoulder", label: "Shoulder" },
  { key: "arm_round", label: "Arm Round" },
  { key: "sleeve_length", label: "Sleeve Length" },
  { key: "neck", label: "Neck" },
  { key: "dress_length", label: "Dress Length" },
  { key: "height", label: "Height" },
];

export default function MeasurementHistory({ measurements }: { measurements: Measurement[] }) {
  if (measurements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-primary/15 py-12 text-center">
        <Ruler size={26} className="mb-3 text-secondary" />
        <p className="text-sm text-secondary">No measurements saved yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {measurements.map((m) => (
        <div key={m.id} className="rounded-xl border border-primary/10 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary">{m.label}</p>
              <p className="text-xs text-secondary">
                {new Date(m.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}{" "}
                &middot; unit: {m.unit}
              </p>
            </div>
            <DeleteButton onDelete={() => deleteMeasurement(m.id, m.customer_id)} />
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {rows.map(
              (r) =>
                m[r.key] !== null && (
                  <div key={r.key} className="rounded-lg bg-white/[0.03] px-3 py-2 text-center">
                    <p className="text-[11px] text-secondary">{r.label}</p>
                    <p className="text-sm font-medium">
                      {String(m[r.key])}
                      <span className="text-[10px] text-secondary"> {m.unit}</span>
                    </p>
                  </div>
                )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
