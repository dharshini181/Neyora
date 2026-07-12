import Link from "next/link";
import { Boxes, Plus, AlertTriangle } from "lucide-react";
import { getInventoryItems } from "@/lib/data/inventory";
import { inventoryCategories } from "@/lib/validations/inventory";
import InventoryTable from "@/components/inventory/InventoryTable";
import { BilingualHeading, BilingualText } from "@/components/i18n/Bilingual";
import SearchBar from "@/components/ui/SearchBar";
import GlowButton from "@/components/ui/GlowButton";
import { cn } from "@/lib/utils";

const categoryLabel: Record<string, string> = {
  fabric: "Fabric", thread: "Thread", accessory: "Accessory", needle: "Needle", zip: "Zip", button: "Button",
};

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category = "all" } = await searchParams;
  const items = await getInventoryItems(q, category);
  const configured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const lowStock = items.filter((i) => Number(i.quantity) <= Number(i.reorder_level));

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <BilingualHeading translationKey="inventoryTitle" />
          <p className="text-sm text-secondary">{items.length} item{items.length === 1 ? "" : "s"} tracked</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar placeholder="Search inventory" defaultValue={q} />
          <Link href="/dashboard/inventory/new">
            <GlowButton className="w-full justify-center sm:w-auto">
              <Plus size={16} /> Add Item
            </GlowButton>
          </Link>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/5 px-4 py-3">
          <AlertTriangle size={16} className="shrink-0 text-yellow-400" />
          <p className="text-xs text-yellow-200/80">
            {lowStock.length} item{lowStock.length === 1 ? " is" : "s are"} at or below reorder level:{" "}
            {lowStock.map((i) => i.name).join(", ")}
          </p>
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {["all", ...inventoryCategories].map((c) => (
          <Link
            key={c}
            href={`/dashboard/inventory?category=${c}${q ? `&q=${q}` : ""}`}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs transition",
              category === c
                ? "border-primary/60 bg-primary/10 text-primary"
                : "border-white/10 text-secondary hover:border-primary/30 hover:text-white"
            )}
          >
            {c === "all" ? "All" : categoryLabel[c]}
          </Link>
        ))}
      </div>

      {!configured || items.length === 0 ? (
        <div className="glass flex flex-col items-center gap-3 rounded-2xl py-16 text-center">
          <Boxes size={28} className="text-secondary" />
          <p className="max-w-sm text-sm text-secondary">
            {!configured
              ? "Connect Supabase and run the migrations to start tracking inventory."
              : "No items in this category yet."}
          </p>
        </div>
      ) : (
        <InventoryTable items={items} />
      )}
    </div>
  );
}
