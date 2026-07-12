import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Locale } from "@/lib/i18n/translations";

/**
 * Small piece of global client state for the dashboard shell — kept minimal
 * on purpose. Feature modules (customers, orders, patterns...) will get
 * their own scoped stores as those rounds land.
 *
 * `language` is persisted to localStorage so the choice survives a reload —
 * this is a real deployed app (not a sandboxed artifact), so browser storage
 * is the right tool here.
 */
interface UIState {
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;

  language: Locale;
  setLanguage: (lang: Locale) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      mobileSidebarOpen: false,
      setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
      toggleMobileSidebar: () => set((s) => ({ mobileSidebarOpen: !s.mobileSidebarOpen })),

      language: "en",
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: "neyora-ui-store",
      partialize: (state) => ({ language: state.language }),
    }
  )
);
