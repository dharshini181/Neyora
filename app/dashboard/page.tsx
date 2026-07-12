import { createClient } from "@/lib/supabase/server";
import { getDashboardStats } from "@/lib/data/dashboard";
import StatCard from "@/components/dashboard/StatCard";
import GlassCard from "@/components/ui/GlassCard";
import { Users, ClipboardList, Clock, Wallet, Package, Plus } from "lucide-react";
import GlowButton from "@/components/ui/GlowButton";
import { BilingualHeading, BilingualText } from "@/components/i18n/Bilingual";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const stats = user ? await getDashboardStats(user.id) : null;
  const s = stats ?? { totalCustomers: 0, totalOrders: 0, pendingOrders: 0, revenue: 0, todaysDeliveries: [] };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <BilingualHeading translationKey="dashboardTitle" className="font-display text-2xl font-semibold sm:text-3xl" />
        </div>
        <GlowButton className="text-xs">
          <Plus size={15} /> New Order
        </GlowButton>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Users size={18} />} label="Total Customers" value={s.totalCustomers} />
        <StatCard icon={<ClipboardList size={18} />} label="Total Orders" value={s.totalOrders} />
        <StatCard icon={<Clock size={18} />} label="Pending Orders" value={s.pendingOrders} />
        <StatCard icon={<Wallet size={18} />} label="Revenue" value={s.revenue} prefix="₹" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-medium">Today&apos;s Deliveries</h2>
            <span className="text-xs text-secondary">
              {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>

          {s.todaysDeliveries.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-primary/15 py-12 text-center">
              <Package size={28} className="mb-3 text-secondary" />
              <p className="text-sm text-secondary">
                Nothing scheduled for delivery today.
                <br />
                Orders due today will show up here automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {s.todaysDeliveries.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between rounded-xl border border-primary/10 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{d.customerName}</p>
                    <p className="text-xs text-secondary">{d.dressType}</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                    Due today
                  </span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        <GlassCard>
          <h2 className="mb-5 font-medium">Quick Actions</h2>
          <div className="space-y-2.5">
            {[
              { label: "Add Customer", href: "/dashboard/customers" },
              { label: "New Measurement", href: "/dashboard/measurements" },
              { label: "Generate Pattern", href: "/dashboard/patterns" },
              { label: "Calculate Fabric", href: "/dashboard/fabric-calculator" },
            ].map((a) => (
              <a
                key={a.href}
                href={a.href}
                className="flex items-center justify-between rounded-xl border border-primary/10 px-4 py-3 text-sm transition hover:border-primary/40 hover:bg-primary/5"
              >
                {a.label}
                <Plus size={14} className="text-primary" />
              </a>
            ))}
          </div>
        </GlassCard>
      </div>

      {!process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith("http") && (
        <p className="mt-8 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-xs text-secondary">
          Showing empty-state data — connect your Supabase project in{" "}
          <code className="text-primary">.env.local</code> and run{" "}
          <code className="text-primary">supabase/schema.sql</code> to see live numbers here.
        </p>
      )}
    </div>
  );
}
