import { createClient } from "@/lib/supabase/server";
import type { PatternResult, FabricResult } from "@/lib/pattern-engine/generate";

export type DressType = {
  id: string;
  name: string;
  category: string;
  base_fabric_meters: number | null;
};

export async function getDressTypes(): Promise<DressType[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("dress_types").select("*").order("name");
    if (error) return [];
    return data as DressType[];
  } catch {
    return [];
  }
}

export type Pattern = {
  id: string;
  customer_id: string;
  measurement_id: string | null;
  dress_type_id: string;
  pattern_data: PatternResult;
  fabric_data: FabricResult;
  ai_notes: string | null;
  ai_generated: boolean;
  created_at: string;
  customers: { name: string } | null;
  dress_types: { name: string } | null;
};

export async function getPatterns(search?: string): Promise<Pattern[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("patterns")
      .select("*, customers(name), dress_types(name)")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (error) return [];
    const rows = data as unknown as Pattern[];
    if (!search) return rows;

    const q = search.toLowerCase();
    return rows.filter(
      (p) =>
        p.customers?.name?.toLowerCase().includes(q) ||
        p.dress_types?.name?.toLowerCase().includes(q)
    );
  } catch {
    return [];
  }
}

export async function getPatternById(id: string): Promise<Pattern | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("patterns")
      .select("*, customers(name), dress_types(name)")
      .eq("id", id)
      .eq("owner_id", user.id)
      .single();

    if (error) return null;
    return data as unknown as Pattern;
  } catch {
    return null;
  }
}
