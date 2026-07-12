"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ClipboardList } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";
import { fetchMeasurementsForCustomer } from "@/lib/actions/patterns";
import { createOrder } from "@/lib/actions/orders";
import type { Customer } from "@/lib/data/customers";
import type { DressType } from "@/lib/data/patterns";

const inputClass =
  "w-full rounded-xl border border-primary/15 bg-card px-4 py-3 text-sm text-white outline-none transition-all focus:border-primary/60 focus:shadow-glow-sm disabled:opacity-40";

export default function OrderForm({
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
  const [trialDate, setTrialDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [advancePaid, setAdvancePaid] = useState("");
  const [notes, setNotes] = useState("");
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
    if (!customerId || !dressTypeId || !totalAmount) {
      setError("Choose a customer, a dress type, and enter the total amount.");
      return;
    }
    startTransition(async () => {
      const result = await createOrder({
        customerId,
        dressTypeId,
        measurementId,
        trialDate,
        deliveryDate,
        totalAmount: Number(totalAmount),
        advancePaid: Number(advancePaid || 0),
        notes,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push(`/dashboard/orders/${result.data!.id}`);
      router.refresh();
    });
  };

  return (
    <GlassCard className="max-w-2xl">
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm text-white/80">Customer</label>
            <select className={inputClass} value={customerId} onChange={(e) => onCustomerChange(e.target.value)}>
              <option value="">Select a customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} &middot; {c.phone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-white/80">Dress type</label>
            <select className={inputClass} value={dressTypeId} onChange={(e) => setDressTypeId(e.target.value)}>
              <option value="">Select a dress type</option>
              {dressTypes.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-white/80">Measurement set (optional)</label>
          <select
            className={inputClass}
            value={measurementId}
            onChange={(e) => setMeasurementId(e.target.value)}
            disabled={!customerId || loadingMeasurements}
          >
            <option value="">
              {loadingMeasurements ? "Loading..." : !customerId ? "Select a customer first" : "None"}
            </option>
            {measurements.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label} &middot;{" "}
                {new Date(m.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm text-white/80">Trial date</label>
            <input type="date" className={inputClass} value={trialDate} onChange={(e) => setTrialDate(e.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-white/80">Delivery date</label>
            <input type="date" className={inputClass} value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm text-white/80">Total amount (₹)</label>
            <input
              type="number"
              className={inputClass}
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="2500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-white/80">Advance paid (₹)</label>
            <input
              type="number"
              className={inputClass}
              value={advancePaid}
              onChange={(e) => setAdvancePaid(e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-white/80">Notes (optional)</label>
          <textarea className={inputClass} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-400">
            {error}
          </p>
        )}

        <GlowButton type="submit" disabled={pending} className="w-full justify-center">
          {pending ? <Loader2 size={16} className="animate-spin" /> : (
            <>
              <ClipboardList size={16} /> Create Order
            </>
          )}
        </GlowButton>
      </form>
    </GlassCard>
  );
}
