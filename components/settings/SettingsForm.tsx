"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { settingsSchema, type SettingsInput } from "@/lib/validations/settings";
import { updateProfile } from "@/lib/actions/settings";
import { locales, type Locale } from "@/lib/i18n/translations";
import { useUIStore } from "@/store/ui-store";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";
import type { Profile } from "@/lib/data/settings";

const inputClass =
  "w-full rounded-xl border border-primary/15 bg-card px-4 py-3 text-sm text-white outline-none transition-all focus:border-primary/60 focus:shadow-glow-sm";

export default function SettingsForm({ profile }: { profile: Profile }) {
  const setLanguage = useUIStore((s) => s.setLanguage);
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      fullName: profile.full_name,
      businessName: profile.business_name ?? "",
      phone: profile.phone ?? "",
      preferredLanguage: (profile.preferred_language as Locale) ?? "en",
    },
  });

  const onSubmit = async (values: SettingsInput) => {
    setServerError(null);
    setSaved(false);
    const result = await updateProfile(values);
    if (result.error) {
      setServerError(result.error);
      return;
    }
    setLanguage(values.preferredLanguage as Locale);
    setSaved(true);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <GlassCard className="lg:col-span-2">
        <h2 className="mb-5 text-sm font-medium text-white/80">Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm text-white/80">Full name</label>
              <input className={inputClass} {...register("fullName")} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-white/80">Business name</label>
              <input className={inputClass} {...register("businessName")} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm text-white/80">Phone</label>
              <input className={inputClass} {...register("phone")} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-white/80">Preferred language</label>
              <select className={inputClass} {...register("preferredLanguage")}>
                {locales.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.nativeLabel} ({l.label})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-white/80">Email</label>
            <input className={inputClass} value={profile.email ?? ""} disabled />
            <p className="mt-1.5 text-[11px] text-secondary/70">
              Email is managed through your account provider and can't be changed here.
            </p>
          </div>

          {serverError && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-400">
              {serverError}
            </p>
          )}
          {saved && (
            <p className="flex items-center gap-1.5 text-xs text-primary">
              <CheckCircle2 size={13} /> Saved.
            </p>
          )}

          <GlowButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Save Changes"}
          </GlowButton>
        </form>
      </GlassCard>

      <GlassCard>
        <h2 className="mb-3 text-sm font-medium text-white/80">Account</h2>
        <dl className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-secondary">Role</dt>
            <dd className="capitalize">{profile.role}</dd>
          </div>
        </dl>
        {profile.role === "admin" && (
          <a href="/admin" className="mt-4 block text-xs text-primary hover:underline">
            Open Admin Panel →
          </a>
        )}
      </GlassCard>
    </div>
  );
}
