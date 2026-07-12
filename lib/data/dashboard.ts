import { createClient } from "@/lib/supabase/server";

export type DashboardStats = {
  totalCustomers: number;
  totalOrders: number;
  pendingOrders: number;
  revenue: number;
  todaysDeliveries: {
    id: string;
    customerName: string;
    dressType: string;
    deliveryDate: string;
  }[];
};

const EMPTY_STATS: DashboardStats = {
  totalCustomers: 0,
  totalOrders: 0,
  pendingOrders: 0,
  revenue: 0,
  todaysDeliveries: [],
};

/**
 * Pulls the dashboard's headline numbers for the signed-in tailor.
 * Falls back to zeroed stats (rather than throwing) if Supabase isn't
 * configured yet, so the dashboard UI is visible before you add real keys.
 */
export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return EMPTY_STATS;

  try {
    const supabase = await createClient();

    const [{ count: totalCustomers }, { count: totalOrders }, { count: pendingOrders }, ordersRes] =
      await Promise.all([
        supabase
          .from("customers")
          .select("id", { count: "exact", head: true })
          .eq("owner_id", userId),
        supabase
          .from("orders")
          .select("id", { count: "exact", head: true })
          .eq("owner_id", userId),
        supabase
          .from("orders")
          .select("id", { count: "exact", head: true })
          .eq("owner_id", userId)
          .eq("status", "pending"),
        supabase
          .from("orders")
          .select("total_amount")
          .eq("owner_id", userId)
          .neq("status", "cancelled"),
      ]);

    const revenue = (ordersRes.data ?? []).reduce(
      (sum, o: { total_amount: number }) => sum + Number(o.total_amount || 0),
      0
    );

    const today = new Date().toISOString().slice(0, 10);
    const { data: deliveries } = await supabase
      .from("orders")
      .select("id, delivery_date, customers(name), dress_types(name)")
      .eq("owner_id", userId)
      .eq("delivery_date", today);

    return {
      totalCustomers: totalCustomers ?? 0,
      totalOrders: totalOrders ?? 0,
      pendingOrders: pendingOrders ?? 0,
      revenue,
      todaysDeliveries: (deliveries ?? []).map((d: any) => ({
        id: d.id,
        customerName: d.customers?.name ?? "Unknown",
        dressType: d.dress_types?.name ?? "—",
        deliveryDate: d.delivery_date,
      })),
    };
  } catch {
    // Tables not migrated yet, or Supabase env vars missing/invalid.
    return EMPTY_STATS;
  }
}
