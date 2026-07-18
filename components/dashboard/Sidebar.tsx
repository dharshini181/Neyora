"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Ruler,
  Shirt,
  Calculator,
  ScanEye,
  MessageCircle,
  ClipboardList,
  Boxes,
  BarChart3,
  Receipt,
  Settings,
  ShieldCheck,
  Scissors,
  X,
  BookOpen,
  Palette,
  ListChecks,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";
import { useTranslation } from "@/lib/i18n/useTranslation";

const nav = [
  { label: "Dashboard", labelKey: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Customers", labelKey: "customers", href: "/dashboard/customers", icon: Users },
  { label: "Measurements", labelKey: "measurements", href: "/dashboard/measurements", icon: Ruler },
  { label: "Pattern Generator", labelKey: "patternGenerator", href: "/dashboard/patterns", icon: Shirt },
  { label: "Fabric Calculator", labelKey: "fabricCalculator", href: "/dashboard/fabric-calculator", icon: Calculator },
  { label: "Dress Library", labelKey: "dressLibrary", href: "/dashboard/dress-library", icon: BookOpen },
  { label: "Design Library", labelKey: "designLibrary", href: "/dashboard/design-library", icon: Palette },
  { label: "Stitching Guide", labelKey: "stitchingGuide", href: "/dashboard/stitching-guide", icon: ListChecks },
  { label: "Dress Detection", labelKey: "dressDetection", href: "/dashboard/dress-detection", icon: ScanEye },
  { label: "AI Chat", labelKey: "aiChat", href: "/dashboard/ai-chat", icon: MessageCircle },
  { label: "Orders", labelKey: "orders", href: "/dashboard/orders", icon: ClipboardList },
  { label: "Inventory", labelKey: "inventory", href: "/dashboard/inventory", icon: Boxes },
  { label: "Referral Shopping", labelKey: "referralShopping", href: "/dashboard/referrals", icon: ShoppingBag },
  { label: "Reports", labelKey: "reports", href: "/dashboard/reports", icon: BarChart3 },
  { label: "Invoices", labelKey: "invoices", href: "/dashboard/invoices", icon: Receipt },
];

const bottomNav = [
  { label: "Settings", labelKey: "settings", href: "/dashboard/settings", icon: Settings },
  { label: "Admin", labelKey: "admin", href: "/admin", icon: ShieldCheck },
];

function NavLink({
  item,
  active,
  label,
}: {
  item: (typeof nav)[number];
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors",
        active ? "bg-primary/10 text-primary" : "text-secondary hover:bg-white/5 hover:text-white"
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,136,0.7)]" />
      )}
      <item.icon size={17} strokeWidth={1.75} />
      {label}
    </Link>
  );
}

export default function Sidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUIStore();
  const { t } = useTranslation();
  const visibleBottomNav = bottomNav.filter((item) => item.href !== "/admin" || isAdmin);

  const content = (
    <>
      <div className="flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 text-primary">
            <Scissors size={16} />
          </span>
          NEYORA
        </div>
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="text-secondary hover:text-primary lg:hidden"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {nav.map((item) => (
          <NavLink key={item.href} item={item} active={pathname === item.href} label={t(item.labelKey)} />
        ))}
      </nav>

      <div className="space-y-1 border-t border-primary/10 px-3 py-4">
        {visibleBottomNav.map((item) => (
          <NavLink key={item.href} item={item} active={pathname === item.href} label={t(item.labelKey)} />
        ))}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-primary/10 bg-[#080808] lg:flex">
        {content}
      </aside>

      {/* Mobile */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-primary/10 bg-[#080808] transition-transform duration-300 lg:hidden",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {content}
      </aside>
    </>
  );
}
