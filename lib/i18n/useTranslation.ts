"use client";

import { useUIStore } from "@/store/ui-store";
import { translate } from "@/lib/i18n/translations";

export function useTranslation() {
  const language = useUIStore((s) => s.language);
  const setLanguage = useUIStore((s) => s.setLanguage);
  const t = (key: string) => translate(language, key);
  return { t, language, setLanguage };
}
