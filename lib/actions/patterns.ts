"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generatePatternSchema, type GeneratePatternInput } from "@/lib/validations/pattern";
import { generatePattern, calculateFabric } from "@/lib/pattern-engine/generate";
import { generateGeminiText } from "@/lib/gemini/client";
import type { ActionResult } from "@/lib/actions/customers";

export async function fetchMeasurementsForCustomer(
  customerId: string
): Promise<{ id: string; label: string; created_at: string }[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("measurements")
    .select("id, label, created_at")
    .eq("customer_id", customerId)
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data;
}

export async function generatePatternForCustomer(
  input: GeneratePatternInput
): Promise<ActionResult<{ id: string }>> {
  const parsed = generatePatternSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid data" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { customerId, measurementId, dressTypeId } = parsed.data;

  const [{ data: measurement, error: mErr }, { data: dressType, error: dErr }] = await Promise.all([
    supabase.from("measurements").select("*").eq("id", measurementId).single(),
    supabase.from("dress_types").select("*").eq("id", dressTypeId).single(),
  ]);

  if (mErr || !measurement) return { error: "Measurement set not found." };
  if (dErr || !dressType) return { error: "Dress type not found." };

  const measurementInput = {
    bust: measurement.bust,
    waist: measurement.waist,
    hip: measurement.hip,
    shoulder: measurement.shoulder,
    armRound: measurement.arm_round,
    sleeveLength: measurement.sleeve_length,
    neck: measurement.neck,
    dressLength: measurement.dress_length,
    height: measurement.height,
    unit: measurement.unit as "inch" | "cm",
  };

  const patternData = generatePattern(dressType.name, measurementInput);
  const fabricData = calculateFabric(
    dressType.name,
    measurementInput,
    dressType.base_fabric_meters ?? 3
  );

  const prompt = `You are a tailoring assistant helping an Indian local tailor. Dress type: ${dressType.name}. Fabric needed: ${fabricData.totalWithWastage} meters total (main ${fabricData.mainFabric}m, lining ${fabricData.lining}m). Seam allowance: ${patternData.seamAllowance} inch, dart width ${patternData.dartWidth} inch. Give 3 short, practical stitching tips specific to this garment and these numbers (max 60 words total, plain text, no markdown headers).`;

  const aiNotes = await generateGeminiText(prompt);

  const { data, error } = await supabase
    .from("patterns")
    .insert({
      owner_id: user.id,
      customer_id: customerId,
      measurement_id: measurementId,
      dress_type_id: dressTypeId,
      pattern_data: patternData,
      fabric_data: fabricData,
      ai_notes: aiNotes,
      ai_generated: !!aiNotes,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard/patterns");
  return { data: { id: data.id } };
}
