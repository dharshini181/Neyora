"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, FileText } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";
import { createInvoice } from "@/lib/actions/invoices";
import type { Order } from "@/lib/data/orders";

const inputClass =
  "w-full rounded-xl border border-primary/15 bg-card px-4 py-3 text-sm text-white outline-none transition-all focus:border-primary/60 focus:shadow-glow-sm";

export default function InvoiceForm({
  orders,
  preselectedOrderId,
}: {
  orders: Order[];
  preselectedOrderId?: string;
}) {
  const router = useRouter();
  const [orderId, setOrderId] = useState(preselectedOrderId ?? "");
  const [fabricCost, setFabricCost] = useState("");
  const [laborCost, setLaborCost] = useState("");
  const [accessoriesCost, setAccessoriesCost] = useState("");
  const [taxPercent, setTaxPercent] = useState("0");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const order = orders.find((o) => o.id === orderId);
  const subtotal = order?.total_amount ?? 0;
  const taxAmount = useMemo(() => (subtotal * Number(taxPercent || 0)) / 100, [subtotal, taxPercent]);
  const total = subtotal + taxAmount;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!orderId) {
      setError("Choose an order to invoice.");
      return;
    }
    setPending(true);
    const result = await createInvoice({
      orderId,
      fabricCost: Number(fabricCost || 0),
      laborCost: Number(laborCost || 0),
      accessoriesCost: Number(accessoriesCost || 0),
      taxPercent: Number(taxPercent || 0),
      notes,
    });
    setPending(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    router.push(`/dashboard/invoices/${result.data!.id}`);
    router.refresh();
  };

  if (orders.length === 0) {
    return (
      <GlassCard className="max-w-xl text-center">
        <p className="text-sm text-secondary">Create an order first, then generate its invoice here.</p>
      </GlassCard>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <GlassCard>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm text-white/80">Order</label>
            <select className={inputClass} value={orderId} onChange={(e) => setOrderId(e.target.value)}>
              <option value="">Select an order</option>
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.customers?.name} &middot; {o.dress_types?.name} &middot; ₹{o.total_amount}
                </option>
              ))}
            </select>
          </div>

          <p className="text-xs text-secondary">
            Fabric, labor, and accessories cost are for your internal Profit Calculator — they
            aren't shown to the customer on the printed invoice.
          </p>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1.5 block text-xs text-white/70">Fabric Cost</label>
              <input type="number" className={inputClass} value={fabricCost} onChange={(e) => setFabricCost(e.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-white/70">Labor Cost</label>
              <input type="number" className={inputClass} value={laborCost} onChange={(e) => setLaborCost(e.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-white/70">Accessories</label>
              <input type="number" className={inputClass} value={accessoriesCost} onChange={(e) => setAccessoriesCost(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-white/80">Tax / GST %</label>
            <input type="number" className={inputClass} value={taxPercent} onChange={(e) => setTaxPercent(e.target.value)} />
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
                <FileText size={16} /> Generate Invoice
              </>
            )}
          </GlowButton>
        </form>
      </GlassCard>

      <GlassCard>
        <h2 className="mb-4 text-sm font-medium text-white/80">Preview</h2>
        {order ? (
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-secondary">Customer</span>
              <span>{order.customers?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Garment</span>
              <span>{order.dress_types?.name}</span>
            </div>
            <div className="mt-3 flex justify-between border-t border-primary/10 pt-3">
              <span className="text-secondary">Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Tax ({taxPercent || 0}%)</span>
              <span>₹{taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-primary/10 pt-3 text-base font-medium text-primary">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-secondary">Select an order to preview the invoice.</p>
        )}
      </GlassCard>
    </div>
  );
}
