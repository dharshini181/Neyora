import Link from "next/link";
import { ClipboardList, Plus } from "lucide-react";
import { getOrders } from "@/lib/data/orders";
import { orderStatuses } from "@/lib/validations/order";
import { StatusBadge, statusLabel } from "@/components/orders/OrderStatusSelect";
import { BilingualHeading, BilingualText } from "@/components/i18n/Bilingual";
import SearchBar from "@/components/ui/SearchBar";
import GlowButton from "@/components/ui/GlowButton";
import { cn } from "@/lib/utils";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status = "all", q } = await searchParams;
  const orders = await getOrders(status, q);
  const configured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

  const tabs = ["all", ...orderStatuses];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <BilingualHeading translationKey="ordersTitle" />
          <p className="text-sm text-secondary">{orders.length} order{orders.length === 1 ? "" : "s"}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar placeholder="Search by customer or dress" defaultValue={q} />
          <Link href="/dashboard/orders/new">
            <GlowButton className="w-full justify-center sm:w-auto">
              <Plus size={16} /> New Order
            </GlowButton>
          </Link>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t}
            href={`/dashboard/orders?status=${t}${q ? `&q=${q}` : ""}`}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs transition",
              status === t
                ? "border-primary/60 bg-primary/10 text-primary"
                : "border-white/10 text-secondary hover:border-primary/30 hover:text-white"
            )}
          >
            {t === "all" ? "All" : statusLabel[t]}
          </Link>
        ))}
      </div>

      {!configured || orders.length === 0 ? (
        <div className="glass flex flex-col items-center gap-3 rounded-2xl py-16 text-center">
          <ClipboardList size={28} className="text-secondary" />
          <p className="max-w-sm text-sm text-secondary">
            {!configured
              ? "Connect Supabase and run the migrations to start taking orders."
              : "No orders match this filter."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-primary/10">
          <div className="hidden grid-cols-[1.5fr_1.2fr_1fr_1fr_1fr] gap-4 border-b border-primary/10 bg-white/[0.02] px-6 py-3 text-xs uppercase tracking-wide text-secondary sm:grid">
            <span>Customer</span>
            <span>Dress</span>
            <span>Delivery</span>
            <span>Amount</span>
            <span>Status</span>
          </div>
          <div className="divide-y divide-primary/10">
            {orders.map((o) => (
              <Link
                key={o.id}
                href={`/dashboard/orders/${o.id}`}
                className="grid grid-cols-1 gap-2 px-6 py-4 transition-colors hover:bg-primary/[0.04] sm:grid-cols-[1.5fr_1.2fr_1fr_1fr_1fr] sm:items-center sm:gap-4"
              >
                <span className="text-sm font-medium">{o.customers?.name ?? "Unknown"}</span>
                <span className="text-sm text-secondary">{o.dress_types?.name ?? "—"}</span>
                <span className="text-xs text-secondary">
                  {o.delivery_date
                    ? new Date(o.delivery_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                    : "—"}
                </span>
                <span className="text-sm">₹{o.total_amount}</span>
                <StatusBadge status={o.status} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
