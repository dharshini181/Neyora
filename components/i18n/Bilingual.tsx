"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import { translations } from "@/lib/i18n/translations";

/**
 * Renders a page title in the selected language. When that language isn't
 * English, the English original appears as a small caption underneath —
 * so switching to Tamil (or any other language) never loses the English
 * meaning, it just becomes secondary instead of primary.
 */
export function BilingualHeading({
  translationKey,
  className = "font-display text-2xl font-semibold",
}: {
  translationKey: string;
  className?: string;
}) {
  const { t, language } = useTranslation();
  const english = translations.en[translationKey] ?? translationKey;
  const translated = t(translationKey);

  return (
    <div>
      <h1 className={className}>{translated}</h1>
      {language !== "en" && <p className="mt-0.5 text-xs text-secondary/60">{english}</p>}
    </div>
  );
}

/** Same idea, for the smaller subtitle line under a page title. */
export function BilingualText({
  translationKey,
  className = "text-sm text-secondary",
}: {
  translationKey: string;
  className?: string;
}) {
  const { t, language } = useTranslation();
  const english = translations.en[translationKey] ?? translationKey;
  const translated = t(translationKey);

  return (
    <div>
      <p className={className}>{translated}</p>
      {language !== "en" && <p className="mt-0.5 text-[11px] text-secondary/50">{english}</p>}
    </div>
  );
}
