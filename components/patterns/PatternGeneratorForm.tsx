"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";
import { fetchMeasurementsForCustomer, generatePatternForCustomer } from "@/lib/actions/patterns";
import type { Customer } from "@/lib/data/customers";
import type { DressType } from "@/lib/data/patterns";

const inputClass =
  "w-full rounded-xl border border-primary/15 bg-card px-4 py-3 text-sm text-white outline-none transition-all focus:border-primary/60 focus:shadow-glow-sm disabled:opacity-40";

export default function PatternGeneratorForm({
  customers,
  dressTypes,
}: {
  customers: Customer[];
  dressTypes: DressType[];
}) {
  const router = useRouter();
  const [customerId, setCustomerId] = useState("");
  const [measurements, setMeasurements] = useState<
    { id: string; label: string; created_at: string }[]
  >([]);
  const [measurementId, setMeasurementId] = useState("");
  const [dressTypeId, setDressTypeId] = useState("");
  const [loadingMeasurements, setLoadingMeasurements] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onCustomerChange = async (id: string) => {
    setCustomerId(id);
    setMeasurementId("");
    setMeasurements([]);
    if (!id) return;
    setLoadingMeasurements(true);
    const rows = await fetchMeasurementsForCustomer(id);
    setMeasurements(rows);
    setLoadingMeasurements(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!customerId || !measurementId || !dressTypeId) {
      setError("Choose a customer, a measurement set, and a dress type.");
      return;
    }
    startTransition(async () => {
      const result = await generatePatternForCustomer({ customerId, measurementId, dressTypeId });
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push(`/dashboard/patterns/${result.data!.id}`);
      router.refresh();
    });
  };

  if (customers.length === 0) {
    return (
      <GlassCard className="max-w-xl text-center">
        <p className="text-sm text-secondary">
          Add a customer with at least one saved measurement set before generating a pattern.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="max-w-xl">
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm text-white/80">Customer</label>
          <select
            className={inputClass}
            value={customerId}
            onChange={(e) => onCustomerChange(e.target.value)}
          >
            <option value="">Select a customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} &middot; {c.phone}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-white/80">Measurement set</label>
          <select
            className={inputClass}
            value={measurementId}
            onChange={(e) => setMeasurementId(e.target.value)}
            disabled={!customerId || loadingMeasurements}
          >
            <option value="">
              {loadingMeasurements
                ? "Loading..."
                : !customerId
                ? "Select a customer first"
                : measurements.length === 0
                ? "No measurements saved for this customer"
                : "Select a measurement set"}
            </option>
            {measurements.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label} &middot;{" "}
                {new Date(m.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-white/80">Dress type</label>
          <select
            className={inputClass}
            value={dressTypeId}
            onChange={(e) => setDressTypeId(e.target.value)}
          >
            <option value="">Select a dress type</option>
            {dressTypes.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-400">
            {error}
          </p>
        )}

        <GlowButton type="submit" disabled={pending} className="w-full justify-center">
          {pending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              <Sparkles size={16} /> Generate Pattern
            </>
          )}
        </GlowButton>
      </form>
    </GlassCard>
  );
}
