"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { updateOrderStatus } from "@/lib/actions/orders";
import { orderStatuses } from "@/lib/validations/order";

export const statusStyle: Record<string, string> = {
  pending: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
  in_progress: "border-blue-400/40 bg-blue-400/10 text-blue-300",
  completed: "border-primary/40 bg-primary/10 text-primary",
  delivered: "border-purple-400/40 bg-purple-400/10 text-purple-300",
  cancelled: "border-red-500/40 bg-red-500/10 text-red-400",
};

export const statusLabel: Record<string, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusStyle[status]}`}>
      {statusLabel[status]}
    </span>
  );
}

export default function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <select
        defaultValue={status}
        disabled={pending}
        onChange={(e) => startTransition(() => { updateOrderStatus(orderId, e.target.value); })}
        className={`rounded-full border bg-card px-3 py-1.5 text-xs outline-none ${statusStyle[status]}`}
      >
        {orderStatuses.map((s) => (
          <option key={s} value={s} className="bg-card text-white">
            {statusLabel[s]}
          </option>
        ))}
      </select>
      {pending && <Loader2 size={14} className="animate-spin text-secondary" />}
    </div>
  );
}
