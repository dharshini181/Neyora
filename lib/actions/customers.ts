"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  customerSchema,
  measurementSchema,
  type CustomerInput,
  type MeasurementInput,
} from "@/lib/validations/customer";

export type ActionResult<T = undefined> = {
  error?: string;
  data?: T;
};

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function createCustomer(
  input: CustomerInput
): Promise<ActionResult<{ id: string }>> {
  const parsed = customerSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid data" };

  const { supabase, user } = await requireUser();
  if (!user) return { error: "You must be signed in." };

  const { data, error } = await supabase
    .from("customers")
    .insert({
      owner_id: user.id,
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      address: parsed.data.address || null,
      gender: parsed.data.gender || null,
      notes: parsed.data.notes || null,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard/customers");
  return { data: { id: data.id } };
}

export async function updateCustomer(
  id: string,
  input: CustomerInput
): Promise<ActionResult> {
  const parsed = customerSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid data" };

  const { supabase, user } = await requireUser();
  if (!user) return { error: "You must be signed in." };

  const { error } = await supabase
    .from("customers")
    .update({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      address: parsed.data.address || null,
      gender: parsed.data.gender || null,
      notes: parsed.data.notes || null,
    })
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/customers");
  revalidatePath(`/dashboard/customers/${id}`);
  return {};
}

export async function deleteCustomer(id: string): Promise<ActionResult> {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "You must be signed in." };

  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/customers");
  return {};
}

export async function createMeasurement(
  customerId: string,
  input: MeasurementInput
): Promise<ActionResult<{ id: string }>> {
  const parsed = measurementSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid data" };

  const { supabase, user } = await requireUser();
  if (!user) return { error: "You must be signed in." };

  const m = parsed.data;
  const { data, error } = await supabase
    .from("measurements")
    .insert({
      owner_id: user.id,
      customer_id: customerId,
      label: m.label,
      unit: m.unit,
      bust: m.bust ?? null,
      waist: m.waist ?? null,
      hip: m.hip ?? null,
      shoulder: m.shoulder ?? null,
      arm_round: m.armRound ?? null,
      sleeve_length: m.sleeveLength ?? null,
      neck: m.neck ?? null,
      dress_length: m.dressLength ?? null,
      height: m.height ?? null,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/customers/${customerId}`);
  revalidatePath("/dashboard/measurements");
  return { data: { id: data.id } };
}

export async function deleteMeasurement(
  id: string,
  customerId: string
): Promise<ActionResult> {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "You must be signed in." };

  const { error } = await supabase
    .from("measurements")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/customers/${customerId}`);
  revalidatePath("/dashboard/measurements");
  return {};
}
