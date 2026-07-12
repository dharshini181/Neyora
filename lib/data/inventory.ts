import { createClient } from "@/lib/supabase/server";

export type InventoryItem = {
  id: string;
  name: string;
  category: "fabric" | "thread" | "accessory" | "needle" | "zip" | "button";
  quantity: number;
  unit: string;
  reorder_level: number;
  cost_per_unit: number | null;
  notes: string | null;
  created_at: string;
};

export async function getInventoryItems(search?: string, category?: string): Promise<InventoryItem[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    let query = supabase
      .from("inventory_items")
      .select("*")
      .eq("owner_id", user.id)
      .order("name");

    if (category && category !== "all") query = query.eq("category", category);
    if (search) query = query.ilike("name", `%${search}%`);

    const { data, error } = await query;
    if (error) return [];
    return data as InventoryItem[];
  } catch {
    return [];
  }
}

export async function getInventoryItemById(id: string): Promise<InventoryItem | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("inventory_items")
      .select("*")
      .eq("id", id)
      .eq("owner_id", user.id)
      .single();

    if (error) return null;
    return data as InventoryItem;
  } catch {
    return null;
  }
}

export async function getLowStockCount(): Promise<number> {
  const items = await getInventoryItems();
  return items.filter((i) => Number(i.quantity) <= Number(i.reorder_level)).length;
}
