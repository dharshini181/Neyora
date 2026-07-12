"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Minus, Plus, Pencil, AlertTriangle, Loader2 } from "lucide-react";
import { adjustInventoryQuantity, deleteInventoryItem } from "@/lib/actions/inventory";
import DeleteButton from "@/components/ui/DeleteButton";
import type { InventoryItem } from "@/lib/data/inventory";

const categoryLabel: Record<string, string> = {
  fabric: "Fabric",
  thread: "Thread",
  accessory: "Accessory",
  needle: "Needle",
  zip: "Zip",
  button: "Button",
};

function Row({ item }: { item: InventoryItem }) {
  const [pending, startTransition] = useTransition();
  const low = Number(item.quantity) <= Number(item.reorder_level);

  return (
    <div className="grid grid-cols-1 gap-3 px-6 py-4 sm:grid-cols-[2fr_1fr_1.2fr_1fr_auto] sm:items-center sm:gap-4">
      <div>
        <p className="flex items-center gap-2 text-sm font-medium">
          {item.name}
          {low && <AlertTriangle size={13} className="text-yellow-400" />}
        </p>
        {item.notes && <p className="text-xs text-secondary">{item.notes}</p>}
      </div>
      <span className="text-sm text-secondary">{categoryLabel[item.category]}</span>

      <div className="flex items-center gap-2">
        <button
          disabled={pending}
          onClick={() => startTransition(() => { adjustInventoryQuantity(item.id, -1); })}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-secondary hover:border-primary/40 hover:text-primary"
        >
          <Minus size={12} />
        </button>
        <span className={`w-16 text-center text-sm ${low ? "text-yellow-400" : ""}`}>
          {pending ? <Loader2 size={13} className="mx-auto animate-spin" /> : `${item.quantity} ${item.unit}`}
        </span>
        <button
          disabled={pending}
          onClick={() => startTransition(() => { adjustInventoryQuantity(item.id, 1); })}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-secondary hover:border-primary/40 hover:text-primary"
        >
          <Plus size={12} />
        </button>
      </div>

      <span className="text-xs text-secondary">
        {item.cost_per_unit ? `₹${item.cost_per_unit}/unit` : "—"}
      </span>

      <div className="flex items-center gap-2">
        <Link
          href={`/dashboard/inventory/${item.id}/edit`}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-secondary hover:border-primary/40 hover:text-primary"
        >
          <Pencil size={12} />
        </Link>
        <DeleteButton label="" onDelete={() => deleteInventoryItem(item.id)} />
      </div>
    </div>
  );
}

export default function InventoryTable({ items }: { items: InventoryItem[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-primary/10">
      <div className="hidden grid-cols-[2fr_1fr_1.2fr_1fr_auto] gap-4 border-b border-primary/10 bg-white/[0.02] px-6 py-3 text-xs uppercase tracking-wide text-secondary sm:grid">
        <span>Item</span>
        <span>Category</span>
        <span>Stock</span>
        <span>Cost</span>
        <span />
      </div>
      <div className="divide-y divide-primary/10">
        {items.map((item) => (
          <Row key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
