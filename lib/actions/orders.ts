"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { orderSchema, type OrderInput, orderStatuses } from "@/lib/validations/order";
import type { ActionResult } from "@/lib/actions/customers";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function createOrder(input: OrderInput): Promise<ActionResult<{ id: string }>> {
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid data" };

  const { supabase, user } = await requireUser();
  if (!user) return { error: "You must be signed in." };

  const d = parsed.data;
  const { data, error } = await supabase
    .from("orders")
    .insert({
      owner_id: user.id,
      customer_id: d.customerId,
      dress_type_id: d.dressTypeId,
      measurement_id: d.measurementId || null,
      pattern_id: d.patternId || null,
      trial_date: d.trialDate || null,
      delivery_date: d.deliveryDate || null,
      total_amount: d.totalAmount,
      advance_paid: d.advancePaid,
      notes: d.notes || null,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard");
  return { data: { id: data.id } };
}

export async function updateOrderStatus(id: string, status: string): Promise<ActionResult> {
  if (!orderStatuses.includes(status as (typeof orderStatuses)[number])) {
    return { error: "Invalid status" };
  }
  const { supabase, user } = await requireUser();
  if (!user) return { error: "You must be signed in." };

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/orders");
  revalidatePath(`/dashboard/orders/${id}`);
  revalidatePath("/dashboard");
  return {};
}

export async function deleteOrder(id: string): Promise<ActionResult> {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "You must be signed in." };

  const { error } = await supabase.from("orders").delete().eq("id", id).eq("owner_id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard");
  return {};
}
