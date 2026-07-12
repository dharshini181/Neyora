"use client";

import { useState } from "react";
import { Languages, Check } from "lucide-react";
import { locales } from "@/lib/i18n/translations";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const { language, setLanguage, t } = useTranslation();
  const current = locales.find((l) => l.code === language)!;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        title={t("language")}
        className="flex items-center gap-1.5 rounded-full border border-primary/15 px-3 py-1.5 text-xs text-secondary hover:border-primary/40 hover:text-primary"
      >
        <Languages size={14} /> {current.nativeLabel}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="glass absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl py-1.5">
            {locales.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLanguage(l.code);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-white/85 hover:bg-primary/10 hover:text-primary"
              >
                <span>
                  {l.nativeLabel} <span className="text-xs text-secondary">· {l.label}</span>
                </span>
                {language === l.code && <Check size={13} className="text-primary" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
