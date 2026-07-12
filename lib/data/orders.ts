import { createClient } from "@/lib/supabase/server";

export type Order = {
  id: string;
  customer_id: string;
  dress_type_id: string;
  measurement_id: string | null;
  pattern_id: string | null;
  status: "pending" | "in_progress" | "completed" | "delivered" | "cancelled";
  trial_date: string | null;
  delivery_date: string | null;
  total_amount: number;
  advance_paid: number;
  notes: string | null;
  created_at: string;
  customers: { name: string; phone: string } | null;
  dress_types: { name: string } | null;
};

export async function getOrders(status?: string, search?: string): Promise<Order[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    let query = supabase
      .from("orders")
      .select("*, customers(name, phone), dress_types(name)")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (status && status !== "all") query = query.eq("status", status);

    const { data, error } = await query;
    if (error) return [];

    let rows = data as unknown as Order[];
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (o) =>
          o.customers?.name?.toLowerCase().includes(q) ||
          o.dress_types?.name?.toLowerCase().includes(q)
      );
    }
    return rows;
  } catch {
    return [];
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("orders")
      .select("*, customers(name, phone), dress_types(name)")
      .eq("id", id)
      .eq("owner_id", user.id)
      .single();

    if (error) return null;
    return data as unknown as Order;
  } catch {
    return null;
  }
}

export async function getOrderCountsByStatus(): Promise<Record<string, number>> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return {};
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return {};

    const { data, error } = await supabase.from("orders").select("status").eq("owner_id", user.id);
    if (error) return {};

    return (data as { status: string }[]).reduce((acc, o) => {
      acc[o.status] = (acc[o.status] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  } catch {
    return {};
  }
}
