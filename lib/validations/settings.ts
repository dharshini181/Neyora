import { z } from "zod";
import { locales } from "@/lib/i18n/translations";

const localeCodes = locales.map((l) => l.code) as [string, ...string[]];

export const settingsSchema = z.object({
  fullName: z.string().min(2, "Enter your name"),
  businessName: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  preferredLanguage: z.enum(localeCodes),
});
export type SettingsInput = z.infer<typeof settingsSchema>;
