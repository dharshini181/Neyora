import { createClient } from "@/lib/supabase/server";

export type AdminUser = {
  id: string;
  full_name: string;
  business_name: string | null;
  role: "owner" | "staff" | "admin";
  created_at: string;
};

export type PlatformSummary = {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
};

/** RLS (via is_admin()) makes these return every row only for admins; regular users just get their own. */
export async function getAllUsers(): Promise<AdminUser[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, business_name, role, created_at")
      .order("created_at", { ascending: false });
    if (error) return [];
    return data as AdminUser[];
  } catch {
    return [];
  }
}

export async function getPlatformSummary(): Promise<PlatformSummary> {
  const empty: PlatformSummary = { totalUsers: 0, totalOrders: 0, totalRevenue: 0, totalCustomers: 0 };
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return empty;
  try {
    const supabase = await createClient();
    const [usersRes, ordersRes, customersRes] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("total_amount").neq("status", "cancelled"),
      supabase.from("customers").select("id", { count: "exact", head: true }),
    ]);

    const totalRevenue = (ordersRes.data ?? []).reduce(
      (s, o: { total_amount: number }) => s + Number(o.total_amount),
      0
    );

    return {
      totalUsers: usersRes.count ?? 0,
      totalOrders: (ordersRes.data ?? []).length,
      totalRevenue,
      totalCustomers: customersRes.count ?? 0,
    };
  } catch {
    return empty;
  }
}

export type CuratedTutorial = {
  id: string;
  dress_name: string;
  step_title: string;
  title: string;
  youtube_url: string;
  created_at: string;
};

export async function getCuratedTutorials(): Promise<CuratedTutorial[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("curated_tutorials")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return [];
    return data as CuratedTutorial[];
  } catch {
    return [];
  }
}

export async function getCuratedTutorialsForDress(dressName: string): Promise<CuratedTutorial[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("curated_tutorials")
      .select("*")
      .eq("dress_name", dressName)
      .order("created_at", { ascending: false });
    if (error) return [];
    return data as CuratedTutorial[];
  } catch {
    return [];
  }
}

export async function getCuratedTutorial(
  dressName: string,
  stepTitle: string
): Promise<CuratedTutorial | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("curated_tutorials")
      .select("*")
      .eq("dress_name", dressName)
      .eq("step_title", stepTitle)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) return null;
    return data as CuratedTutorial | null;
  } catch {
    return null;
  }
}
