"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { inventoryItemSchema, inventoryCategories, type InventoryItemInput } from "@/lib/validations/inventory";
import { createInventoryItem, updateInventoryItem } from "@/lib/actions/inventory";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";
import type { InventoryItem } from "@/lib/data/inventory";

const inputClass =
  "w-full rounded-xl border border-primary/15 bg-card px-4 py-3 text-sm text-white outline-none transition-all focus:border-primary/60 focus:shadow-glow-sm";

const categoryLabel: Record<string, string> = {
  fabric: "Fabric",
  thread: "Thread",
  accessory: "Accessory",
  needle: "Needle",
  zip: "Zip",
  button: "Button",
};

export default function InventoryForm({ item }: { item?: InventoryItem }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InventoryItemInput>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: item
      ? {
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          unit: item.unit,
          reorderLevel: item.reorder_level,
          costPerUnit: item.cost_per_unit ?? undefined,
          notes: item.notes ?? "",
        }
      : { category: "fabric", quantity: 0, unit: "meters", reorderLevel: 5 },
  });

  const onSubmit = async (values: InventoryItemInput) => {
    setServerError(null);
    const result = item
      ? await updateInventoryItem(item.id, values)
      : await createInventoryItem(values);

    if (result.error) {
      setServerError(result.error);
      return;
    }
    router.push("/dashboard/inventory");
    router.refresh();
  };

  return (
    <GlassCard className="max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm text-white/80">Item name</label>
          <input className={inputClass} placeholder="Cotton Fabric - White" {...register("name")} />
          {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm text-white/80">Category</label>
            <select className={inputClass} {...register("category")}>
              {inventoryCategories.map((c) => (
                <option key={c} value={c}>
                  {categoryLabel[c]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-white/80">Unit</label>
            <input className={inputClass} placeholder="meters, pcs, spools" {...register("unit")} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm text-white/80">Quantity in stock</label>
            <input type="number" step="0.1" className={inputClass} {...register("quantity")} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-white/80">Reorder level</label>
            <input type="number" step="0.1" className={inputClass} {...register("reorderLevel")} />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-white/80">Cost per unit (₹, optional)</label>
          <input type="number" step="0.01" className={inputClass} {...register("costPerUnit")} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-white/80">Notes (optional)</label>
          <textarea className={inputClass} rows={2} {...register("notes")} />
        </div>

        {serverError && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-400">
            {serverError}
          </p>
        )}

        <div className="flex items-center gap-3">
          <GlowButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : item ? "Save Changes" : "Add Item"}
          </GlowButton>
          <button type="button" onClick={() => router.back()} className="text-sm text-secondary hover:text-white">
            Cancel
          </button>
        </div>
      </form>
    </GlassCard>
  );
}
