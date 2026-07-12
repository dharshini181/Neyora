"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { updateUserRole } from "@/lib/actions/admin";

export default function UserRoleSelect({ userId, role }: { userId: string; role: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <select
        defaultValue={role}
        disabled={pending}
        onChange={(e) => startTransition(() => { updateUserRole(userId, e.target.value); })}
        className="rounded-full border border-primary/20 bg-card px-3 py-1.5 text-xs capitalize outline-none"
      >
        <option value="owner">Owner</option>
        <option value="staff">Staff</option>
        <option value="admin">Admin</option>
      </select>
      {pending && <Loader2 size={13} className="animate-spin text-secondary" />}
    </div>
  );
}
