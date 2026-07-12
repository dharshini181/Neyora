import { createClient } from "@/lib/supabase/server";

export type MonthlyPoint = { label: string; revenue: number; orders: number };
export type DressSales = { name: string; count: number; revenue: number };

export async function getMonthlyRevenue(months = 6): Promise<MonthlyPoint[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const since = new Date();
    since.setMonth(since.getMonth() - (months - 1));
    since.setDate(1);

    const { data, error } = await supabase
      .from("orders")
      .select("total_amount, created_at, status")
      .eq("owner_id", user.id)
      .neq("status", "cancelled")
      .gte("created_at", since.toISOString());

    if (error) return [];

    const buckets: Record<string, MonthlyPoint> = {};
    for (let i = 0; i < months; i++) {
      const d = new Date(since);
      d.setMonth(d.getMonth() + i);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      buckets[key] = { label: d.toLocaleDateString("en-IN", { month: "short" }), revenue: 0, orders: 0 };
    }

    for (const row of data as { total_amount: number; created_at: string }[]) {
      const d = new Date(row.created_at);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (buckets[key]) {
        buckets[key].revenue += Number(row.total_amount);
        buckets[key].orders += 1;
      }
    }

    return Object.values(buckets);
  } catch {
    return [];
  }
}

export async function getBestSellingDressTypes(limit = 5): Promise<DressSales[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("orders")
      .select("total_amount, dress_types(name)")
      .eq("owner_id", user.id)
      .neq("status", "cancelled");

    if (error) return [];

    const grouped: Record<string, DressSales> = {};
    for (const row of data as unknown as { total_amount: number; dress_types: { name: string } | null }[]) {
      const name = row.dress_types?.name ?? "Custom";
      if (!grouped[name]) grouped[name] = { name, count: 0, revenue: 0 };
      grouped[name].count += 1;
      grouped[name].revenue += Number(row.total_amount);
    }

    return Object.values(grouped)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  } catch {
    return [];
  }
}

export type BusinessSummary = {
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
  totalOrders: number;
  totalCustomers: number;
  newCustomersThisMonth: number;
};

export async function getBusinessSummary(): Promise<BusinessSummary> {
  const empty: BusinessSummary = {
    totalRevenue: 0, totalExpenses: 0, profit: 0, totalOrders: 0, totalCustomers: 0, newCustomersThisMonth: 0,
  };
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return empty;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return empty;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [ordersRes, invoicesRes, customersCountRes, newCustomersRes] = await Promise.all([
      supabase.from("orders").select("total_amount").eq("owner_id", user.id).neq("status", "cancelled"),
      supabase.from("invoices").select("fabric_cost, labor_cost, accessories_cost").eq("owner_id", user.id),
      supabase.from("customers").select("id", { count: "exact", head: true }).eq("owner_id", user.id),
      supabase
        .from("customers")
        .select("id", { count: "exact", head: true })
        .eq("owner_id", user.id)
        .gte("created_at", startOfMonth.toISOString()),
    ]);

    const totalRevenue = (ordersRes.data ?? []).reduce((s, o: { total_amount: number }) => s + Number(o.total_amount), 0);
    const totalExpenses = (invoicesRes.data ?? []).reduce(
      (s, i: { fabric_cost: number; labor_cost: number; accessories_cost: number }) =>
        s + Number(i.fabric_cost) + Number(i.labor_cost) + Number(i.accessories_cost),
      0
    );

    return {
      totalRevenue,
      totalExpenses,
      profit: totalRevenue - totalExpenses,
      totalOrders: (ordersRes.data ?? []).length,
      totalCustomers: customersCountRes.count ?? 0,
      newCustomersThisMonth: newCustomersRes.count ?? 0,
    };
  } catch {
    return empty;
  }
}
