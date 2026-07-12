"use client";

import { useState } from "react";
import { Search, Bell, ChevronDown, LogOut, Settings as SettingsIcon, Menu } from "lucide-react";
import { logout } from "@/lib/actions/auth";
import { useUIStore } from "@/store/ui-store";
import { useTranslation } from "@/lib/i18n/useTranslation";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";

export default function Topbar({
  fullName,
  businessName,
}: {
  fullName: string;
  businessName: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { toggleMobileSidebar } = useUIStore();
  const { t } = useTranslation();
  const initials = fullName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-primary/10 bg-background/80 px-6 py-4 backdrop-blur-xl lg:px-8">
      <button
        onClick={toggleMobileSidebar}
        className="mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/15 text-secondary hover:text-primary lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={17} />
      </button>

      <div className="relative hidden max-w-sm flex-1 sm:block">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" />
        <input
          type="text"
          placeholder={`${t("search")} customers, orders...`}
          className="w-full rounded-full border border-primary/15 bg-card py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-secondary/60 focus:border-primary/50"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <LanguageSwitcher />

        <button
          title={t("notifications")}
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-primary/15 text-secondary hover:text-primary"
        >
          <Bell size={16} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full border border-primary/15 py-1.5 pl-1.5 pr-3 hover:border-primary/40"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-xs font-medium text-primary">
              {initials || "U"}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-xs font-medium leading-tight">{fullName}</span>
              <span className="block text-[11px] leading-tight text-secondary">{businessName}</span>
            </span>
            <ChevronDown size={14} className="text-secondary" />
          </button>

          {menuOpen && (
            <div className="glass absolute right-0 top-12 w-48 overflow-hidden rounded-xl py-1.5">
              <a
                href="/dashboard/settings"
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/80 hover:bg-primary/5 hover:text-primary"
              >
                <SettingsIcon size={15} /> {t("settings")}
              </a>
              <form action={logout}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-white/80 hover:bg-red-500/5 hover:text-red-400"
                >
                  <LogOut size={15} /> {t("signOut")}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
