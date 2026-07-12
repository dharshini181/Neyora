"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { inventoryItemSchema, type InventoryItemInput } from "@/lib/validations/inventory";
import type { ActionResult } from "@/lib/actions/customers";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function createInventoryItem(
  input: InventoryItemInput
): Promise<ActionResult<{ id: string }>> {
  const parsed = inventoryItemSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid data" };

  const { supabase, user } = await requireUser();
  if (!user) return { error: "You must be signed in." };

  const d = parsed.data;
  const { data, error } = await supabase
    .from("inventory_items")
    .insert({
      owner_id: user.id,
      name: d.name,
      category: d.category,
      quantity: d.quantity,
      unit: d.unit,
      reorder_level: d.reorderLevel,
      cost_per_unit: d.costPerUnit ?? null,
      notes: d.notes || null,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  revalidatePath("/dashboard/inventory");
  return { data: { id: data.id } };
}

export async function updateInventoryItem(
  id: string,
  input: InventoryItemInput
): Promise<ActionResult> {
  const parsed = inventoryItemSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid data" };

  const { supabase, user } = await requireUser();
  if (!user) return { error: "You must be signed in." };

  const d = parsed.data;
  const { error } = await supabase
    .from("inventory_items")
    .update({
      name: d.name,
      category: d.category,
      quantity: d.quantity,
      unit: d.unit,
      reorder_level: d.reorderLevel,
      cost_per_unit: d.costPerUnit ?? null,
      notes: d.notes || null,
    })
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/inventory");
  return {};
}

export async function deleteInventoryItem(id: string): Promise<ActionResult> {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "You must be signed in." };

  const { error } = await supabase.from("inventory_items").delete().eq("id", id).eq("owner_id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/dashboard/inventory");
  return {};
}

/** Quick +/- stock adjustment used by the inventory table's inline stepper. */
export async function adjustInventoryQuantity(id: string, delta: number): Promise<ActionResult> {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "You must be signed in." };

  const { data: item, error: fetchError } = await supabase
    .from("inventory_items")
    .select("quantity")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();

  if (fetchError || !item) return { error: "Item not found" };

  const newQuantity = Math.max(0, Number(item.quantity) + delta);
  const { error } = await supabase
    .from("inventory_items")
    .update({ quantity: newQuantity })
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/inventory");
  return {};
}
