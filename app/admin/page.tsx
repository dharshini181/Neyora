import { Users, ShoppingBag, IndianRupee, Store } from "lucide-react";
import { getPlatformSummary } from "@/lib/data/admin";
import GlassCard from "@/components/ui/GlassCard";

export default async function AdminOverviewPage() {
  const summary = await getPlatformSummary();

  const stats = [
    { label: "Tailors on Platform", value: summary.totalUsers, icon: Store },
    { label: "Total Customers", value: summary.totalCustomers, icon: Users },
    { label: "Total Orders", value: summary.totalOrders, icon: ShoppingBag },
    { label: "Platform Revenue", value: `₹${summary.totalRevenue.toLocaleString("en-IN")}`, icon: IndianRupee },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold">Overview</h1>
        <p className="text-sm text-secondary">Platform-wide numbers across every tailor using Neyora.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <GlassCard key={s.label} className="text-center">
            <s.icon size={18} className="mx-auto mb-2 text-primary" />
            <p className="text-xl font-semibold">{s.value}</p>
            <p className="text-[11px] text-secondary">{s.label}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
