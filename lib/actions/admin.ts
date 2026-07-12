"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  dressTypeSchema, type DressTypeInput,
  tutorialSchema, type TutorialInput,
  userRoleSchema,
} from "@/lib/validations/admin";
import type { ActionResult } from "@/lib/actions/customers";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function createDressType(input: DressTypeInput): Promise<ActionResult<{ id: string }>> {
  const parsed = dressTypeSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid data" };

  const { supabase, user } = await requireUser();
  if (!user) return { error: "You must be signed in." };

  const { data, error } = await supabase
    .from("dress_types")
    .insert({
      name: parsed.data.name,
      category: parsed.data.category,
      base_fabric_meters: parsed.data.baseFabricMeters,
    })
    .select("id")
    .single();

  // RLS blocks this for non-admins — surface that plainly rather than a raw Postgres error.
  if (error) return { error: "Only admins can add dress types (or: " + error.message + ")" };

  revalidatePath("/admin/dress-types");
  revalidatePath("/dashboard/patterns/new");
  return { data: { id: data.id } };
}

export async function deleteDressType(id: string): Promise<ActionResult> {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "You must be signed in." };

  const { error } = await supabase.from("dress_types").delete().eq("id", id);
  if (error) return { error: "Only admins can delete dress types (or: " + error.message + ")" };

  revalidatePath("/admin/dress-types");
  return {};
}

export async function createTutorial(input: TutorialInput): Promise<ActionResult<{ id: string }>> {
  const parsed = tutorialSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid data" };

  const { supabase, user } = await requireUser();
  if (!user) return { error: "You must be signed in." };

  const { data, error } = await supabase
    .from("curated_tutorials")
    .insert({
      dress_name: parsed.data.dressName,
      step_title: parsed.data.stepTitle,
      title: parsed.data.title,
      youtube_url: parsed.data.youtubeUrl,
      added_by: user.id,
    })
    .select("id")
    .single();

  if (error) return { error: "Only admins can add tutorials (or: " + error.message + ")" };

  revalidatePath("/admin/tutorials");
  return { data: { id: data.id } };
}

export async function deleteTutorial(id: string): Promise<ActionResult> {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "You must be signed in." };

  const { error } = await supabase.from("curated_tutorials").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/tutorials");
  return {};
}

export async function updateUserRole(
  userId: string,
  role: string
): Promise<ActionResult> {
  const parsed = userRoleSchema.safeParse({ userId, role });
  if (!parsed.success) return { error: "Invalid role" };

  const { supabase, user } = await requireUser();
  if (!user) return { error: "You must be signed in." };

  const { error } = await supabase
    .from("profiles")
    .update({ role: parsed.data.role })
    .eq("id", parsed.data.userId);

  if (error) return { error: "Only admins can change roles (or: " + error.message + ")" };

  revalidatePath("/admin/users");
  return {};
}
