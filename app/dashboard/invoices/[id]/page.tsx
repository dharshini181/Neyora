import { notFound } from "next/navigation";
import { Scissors } from "lucide-react";
import { getInvoiceById } from "@/lib/data/invoices";
import GlassCard from "@/components/ui/GlassCard";
import PrintButton from "@/components/patterns/PrintButton";
import WorkflowNav from "@/components/ui/WorkflowNav";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);
  if (!invoice) notFound();

  const costTotal = Number(invoice.fabric_cost) + Number(invoice.labor_cost) + Number(invoice.accessories_cost);
  const profit = Number(invoice.total) - costTotal;
  const margin = invoice.total > 0 ? (profit / Number(invoice.total)) * 100 : 0;

  return (
    <div>
      <div className="no-print mb-6 flex items-center justify-end">
        <PrintButton />
      </div>

      <GlassCard className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between border-b border-primary/10 pb-6">
          <div className="flex items-center gap-2 font-display text-lg font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 text-primary">
              <Scissors size={16} />
            </span>
            NEYORA
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-primary">{invoice.invoice_number}</p>
            <p className="text-xs text-secondary">
              {new Date(invoice.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-6">
          <div>
            <p className="mb-1 text-xs text-secondary">Billed To</p>
            <p className="text-sm font-medium">{invoice.orders?.customers?.name}</p>
            <p className="text-xs text-secondary">{invoice.orders?.customers?.phone}</p>
            {invoice.orders?.customers?.address && (
              <p className="text-xs text-secondary">{invoice.orders.customers.address}</p>
            )}
          </div>
          <div className="text-right">
            <p className="mb-1 text-xs text-secondary">Garment</p>
            <p className="text-sm font-medium">{invoice.orders?.dress_types?.name}</p>
          </div>
        </div>

        <div className="mb-6 overflow-hidden rounded-xl border border-primary/10">
          <div className="grid grid-cols-2 bg-white/[0.03] px-4 py-2.5 text-xs text-secondary">
            <span>Description</span>
            <span className="text-right">Amount</span>
          </div>
          <div className="grid grid-cols-2 px-4 py-3 text-sm">
            <span>{invoice.orders?.dress_types?.name ?? "Garment"} — stitching charge</span>
            <span className="text-right">₹{invoice.subtotal}</span>
          </div>
          {Number(invoice.orders?.advance_paid ?? 0) > 0 && (
            <div className="grid grid-cols-2 border-t border-primary/10 px-4 py-3 text-sm text-secondary">
              <span>Advance paid</span>
              <span className="text-right">− ₹{invoice.orders?.advance_paid}</span>
            </div>
          )}
        </div>

        <div className="ml-auto max-w-[220px] space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-secondary">Subtotal</span>
            <span>₹{invoice.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Tax ({invoice.tax_percent}%)</span>
            <span>₹{invoice.tax_amount}</span>
          </div>
          <div className="flex justify-between border-t border-primary/10 pt-2 text-base font-medium text-primary">
            <span>Total</span>
            <span>₹{invoice.total}</span>
          </div>
        </div>

        {invoice.notes && (
          <p className="mt-6 border-t border-primary/10 pt-4 text-xs text-secondary">{invoice.notes}</p>
        )}
      </GlassCard>

      <div className="no-print mx-auto mt-6 max-w-2xl">
        <GlassCard>
          <h2 className="mb-4 text-sm font-medium text-white/80">
            Profit Calculator <span className="text-xs text-secondary">(internal only — never printed)</span>
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label="Fabric" value={`₹${invoice.fabric_cost}`} />
            <Stat label="Labor" value={`₹${invoice.labor_cost}`} />
            <Stat label="Accessories" value={`₹${invoice.accessories_cost}`} />
            <Stat label="Total Cost" value={`₹${costTotal.toFixed(2)}`} />
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 px-5 py-4">
            <div>
              <p className="text-xs text-secondary">Profit on this order</p>
              <p className="font-display text-2xl font-semibold text-primary">₹{profit.toFixed(2)}</p>
            </div>
            <p className="text-sm text-secondary">{margin.toFixed(1)}% margin</p>
          </div>
        </GlassCard>
      </div>

      <div className="no-print mx-auto max-w-2xl">
        <WorkflowNav
          prev={{ label: "Back to Invoices", href: "/dashboard/invoices" }}
          next={{ label: "Back to Dashboard", href: "/dashboard" }}
        />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/[0.03] px-3 py-2.5 text-center">
      <p className="text-[10px] text-secondary">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
