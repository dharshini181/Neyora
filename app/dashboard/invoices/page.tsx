import Link from "next/link";
import { Receipt, Plus } from "lucide-react";
import { getInvoices } from "@/lib/data/invoices";
import { BilingualHeading, BilingualText } from "@/components/i18n/Bilingual";
import SearchBar from "@/components/ui/SearchBar";
import GlowButton from "@/components/ui/GlowButton";

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const invoices = await getInvoices(q);
  const configured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <BilingualHeading translationKey="invoicesTitle" />
          <p className="text-sm text-secondary">{invoices.length} invoice{invoices.length === 1 ? "" : "s"}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar placeholder="Search by invoice # or customer" defaultValue={q} />
          <Link href="/dashboard/invoices/new">
            <GlowButton className="w-full justify-center sm:w-auto">
              <Plus size={16} /> New Invoice
            </GlowButton>
          </Link>
        </div>
      </div>

      {!configured || invoices.length === 0 ? (
        <div className="glass flex flex-col items-center gap-3 rounded-2xl py-16 text-center">
          <Receipt size={28} className="text-secondary" />
          <p className="max-w-sm text-sm text-secondary">
            {!configured
              ? "Connect Supabase and run the migrations to generate invoices."
              : "No invoices generated yet."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-primary/10">
          <div className="hidden grid-cols-[1fr_1.5fr_1fr_1fr_1fr] gap-4 border-b border-primary/10 bg-white/[0.02] px-6 py-3 text-xs uppercase tracking-wide text-secondary sm:grid">
            <span>Invoice #</span>
            <span>Customer</span>
            <span>Garment</span>
            <span>Total</span>
            <span>Date</span>
          </div>
          <div className="divide-y divide-primary/10">
            {invoices.map((inv) => (
              <Link
                key={inv.id}
                href={`/dashboard/invoices/${inv.id}`}
                className="grid grid-cols-1 gap-2 px-6 py-4 transition-colors hover:bg-primary/[0.04] sm:grid-cols-[1fr_1.5fr_1fr_1fr_1fr] sm:items-center sm:gap-4"
              >
                <span className="text-sm font-medium text-primary">{inv.invoice_number}</span>
                <span className="text-sm">{inv.orders?.customers?.name ?? "—"}</span>
                <span className="text-sm text-secondary">{inv.orders?.dress_types?.name ?? "—"}</span>
                <span className="text-sm">₹{inv.total}</span>
                <span className="text-xs text-secondary">
                  {new Date(inv.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
