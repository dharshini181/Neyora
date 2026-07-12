import { TrendingUp, Users, ShoppingBag, Wallet } from "lucide-react";
import { getMonthlyRevenue, getBestSellingDressTypes, getBusinessSummary } from "@/lib/data/reports";
import GlassCard from "@/components/ui/GlassCard";
import BarChart from "@/components/reports/BarChart";
import { BilingualHeading, BilingualText } from "@/components/i18n/Bilingual";

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default async function ReportsPage() {
  const [monthly, bestSelling, summary] = await Promise.all([
    getMonthlyRevenue(6),
    getBestSellingDressTypes(5),
    getBusinessSummary(),
  ]);
  const configured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

  const stats = [
    { label: "Total Revenue", value: formatINR(summary.totalRevenue), icon: TrendingUp },
    { label: "Total Expenses", value: formatINR(summary.totalExpenses), icon: Wallet },
    { label: "Profit", value: formatINR(summary.profit), icon: TrendingUp },
    { label: "Total Orders", value: summary.totalOrders, icon: ShoppingBag },
    { label: "Total Customers", value: summary.totalCustomers, icon: Users },
    { label: "New This Month", value: summary.newCustomersThisMonth, icon: Users },
  ];

  return (
    <div>
      <div className="mb-8">
        <BilingualHeading translationKey="reportsTitle" />
        <BilingualText translationKey="reportsSubtitle" />
      </div>

      {!configured ? (
        <div className="glass flex flex-col items-center gap-3 rounded-2xl py-16 text-center">
          <TrendingUp size={28} className="text-secondary" />
          <p className="max-w-sm text-sm text-secondary">
            Connect Supabase and run the migrations to see live reports.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {stats.map((s) => (
              <GlassCard key={s.label} className="text-center">
                <s.icon size={16} className="mx-auto mb-2 text-primary" />
                <p className="text-lg font-semibold">{s.value}</p>
                <p className="text-[10px] text-secondary">{s.label}</p>
              </GlassCard>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <GlassCard>
              <h2 className="mb-4 text-sm font-medium text-white/80">Revenue — Last 6 Months</h2>
              {monthly.some((m) => m.revenue > 0) ? (
                <BarChart data={monthly.map((m) => ({ label: m.label, value: m.revenue }))} valuePrefix="₹" />
              ) : (
                <p className="py-10 text-center text-sm text-secondary">No orders recorded yet.</p>
              )}
            </GlassCard>

            <GlassCard>
              <h2 className="mb-4 text-sm font-medium text-white/80">Best-Selling Dress Types</h2>
              {bestSelling.length > 0 ? (
                <div className="space-y-3">
                  {bestSelling.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-3">
                      <span className="w-5 text-xs text-secondary">#{i + 1}</span>
                      <span className="flex-1 text-sm">{d.name}</span>
                      <span className="text-xs text-secondary">{d.count} orders</span>
                      <span className="text-sm font-medium text-primary">{formatINR(d.revenue)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-10 text-center text-sm text-secondary">No orders recorded yet.</p>
              )}
            </GlassCard>
          </div>
        </>
      )}
    </div>
  );
}
