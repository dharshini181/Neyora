"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteButton({
  onDelete,
  confirmText = "Delete this? This can't be undone.",
  label,
}: {
  onDelete: () => Promise<{ error?: string } | void>;
  confirmText?: string;
  label?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (confirming) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="text-secondary">{confirmText}</span>
        <button
          onClick={() =>
            startTransition(async () => {
              const res = await onDelete();
              if (res?.error) setError(res.error);
            })
          }
          disabled={pending}
          className="rounded-full bg-red-500/15 px-3 py-1 font-medium text-red-400 hover:bg-red-500/25"
        >
          {pending ? <Loader2 size={12} className="animate-spin" /> : "Confirm"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded-full border border-white/10 px-3 py-1 text-secondary hover:text-white"
        >
          Cancel
        </button>
        {error && <span className="text-red-400">{error}</span>}
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-secondary transition hover:border-red-500/40 hover:text-red-400"
    >
      <Trash2 size={13} /> {label ?? "Delete"}
    </button>
  );
}
