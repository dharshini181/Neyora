import Link from "next/link";
import { Phone, Mail, ChevronRight, User } from "lucide-react";
import type { Customer } from "@/lib/data/customers";

export default function CustomerTable({ customers }: { customers: Customer[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-primary/10">
      <div className="hidden grid-cols-[2fr_1.2fr_1.5fr_1fr_auto] gap-4 border-b border-primary/10 bg-white/[0.02] px-6 py-3 text-xs uppercase tracking-wide text-secondary sm:grid">
        <span>Customer</span>
        <span>Phone</span>
        <span>Email</span>
        <span>Joined</span>
        <span />
      </div>
      <div className="divide-y divide-primary/10">
        {customers.map((c) => (
          <Link
            key={c.id}
            href={`/dashboard/customers/${c.id}`}
            className="grid grid-cols-1 gap-2 px-6 py-4 transition-colors hover:bg-primary/[0.04] sm:grid-cols-[2fr_1.2fr_1.5fr_1fr_auto] sm:items-center sm:gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
                <User size={15} />
              </div>
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                {c.gender && (
                  <p className="text-xs capitalize text-secondary">{c.gender}</p>
                )}
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-sm text-secondary sm:text-white/80">
              <Phone size={13} className="text-primary/70 sm:hidden" /> {c.phone}
            </span>
            <span className="flex items-center gap-1.5 truncate text-sm text-secondary">
              <Mail size={13} className="text-primary/70 sm:hidden" /> {c.email || "—"}
            </span>
            <span className="text-xs text-secondary">
              {new Date(c.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <ChevronRight size={16} className="hidden text-secondary sm:block" />
          </Link>
        ))}
      </div>
    </div>
  );
}
