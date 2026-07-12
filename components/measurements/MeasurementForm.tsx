"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { measurementSchema, type MeasurementInput } from "@/lib/validations/customer";
import { createMeasurement } from "@/lib/actions/customers";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";
import VoiceInputButton from "@/components/measurements/VoiceInputButton";
import type { ParsedMeasurements } from "@/lib/voice/parse-measurements";

const fields: { name: keyof MeasurementInput; label: string }[] = [
  { name: "bust", label: "Bust" },
  { name: "waist", label: "Waist" },
  { name: "hip", label: "Hip" },
  { name: "shoulder", label: "Shoulder" },
  { name: "armRound", label: "Arm Round" },
  { name: "sleeveLength", label: "Sleeve Length" },
  { name: "neck", label: "Neck" },
  { name: "dressLength", label: "Dress Length" },
  { name: "height", label: "Height" },
];

const inputClass =
  "w-full rounded-xl border border-primary/15 bg-card px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-secondary/60 focus:border-primary/60 focus:shadow-glow-sm";

export default function MeasurementForm({ customerId }: { customerId: string }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [voiceFilled, setVoiceFilled] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MeasurementInput>({
    resolver: zodResolver(measurementSchema),
    defaultValues: { label: "Standard", unit: "inch" },
  });

  const onVoiceParsed = useCallback(
    (values: ParsedMeasurements, matchedFields: string[]) => {
      for (const [key, value] of Object.entries(values)) {
        if (value !== undefined) setValue(key as keyof MeasurementInput, value, { shouldValidate: true });
      }
      setVoiceFilled(matchedFields);
    },
    [setValue]
  );

  const onSubmit = async (values: MeasurementInput) => {
    setServerError(null);
    const result = await createMeasurement(customerId, values);
    if (result.error) {
      setServerError(result.error);
      return;
    }
    router.push(`/dashboard/customers/${customerId}`);
    router.refresh();
  };

  return (
    <GlassCard className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="grid flex-1 grid-cols-2 gap-3 sm:max-w-xs">
          <div>
            <label className="mb-1.5 block text-xs text-white/70">Label</label>
            <input className={inputClass} placeholder="Standard" {...register("label")} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-white/70">Unit</label>
            <select className={inputClass} {...register("unit")}>
              <option value="inch">Inches</option>
              <option value="cm">Centimeters</option>
            </select>
          </div>
        </div>

        <VoiceInputButton onParsed={onVoiceParsed} />
      </div>

      {voiceFilled.length > 0 && (
        <p className="mb-4 flex items-center gap-1.5 text-xs text-primary">
          <CheckCircle2 size={13} /> Filled from voice: {voiceFilled.join(", ")}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="mb-1.5 block text-sm text-white/80">{f.label}</label>
              <input
                type="number"
                step="0.1"
                className={inputClass}
                placeholder="0.0"
                {...register(f.name, { valueAsNumber: true })}
              />
              {errors[f.name] && (
                <p className="mt-1.5 text-xs text-red-400">{errors[f.name]?.message as string}</p>
              )}
            </div>
          ))}
        </div>

        {serverError && (
          <p className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-400">
            {serverError}
          </p>
        )}

        <div className="mt-6 flex items-center gap-3">
          <GlowButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Save Measurement"}
          </GlowButton>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-secondary hover:text-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </GlassCard>
  );
}
