"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { createDressType } from "@/lib/actions/admin";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";

const inputClass =
  "w-full rounded-xl border border-primary/15 bg-card px-4 py-3 text-sm text-white outline-none transition-all focus:border-primary/60 focus:shadow-glow-sm";

export default function DressTypeForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("women");
  const [baseFabricMeters, setBaseFabricMeters] = useState("3");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    const result = await createDressType({
      name,
      category: category as "women" | "men" | "kids" | "general",
      baseFabricMeters: Number(baseFabricMeters),
    });
    setPending(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/admin/dress-types");
    router.refresh();
  };

  return (
    <GlassCard className="max-w-lg">
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm text-white/80">Dress name</label>
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Palazzo Suit" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm text-white/80">Category</label>
            <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="women">Women</option>
              <option value="men">Men</option>
              <option value="kids">Kids</option>
              <option value="general">General</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-white/80">Base fabric (meters)</label>
            <input
              type="number"
              step="0.1"
              className={inputClass}
              value={baseFabricMeters}
              onChange={(e) => setBaseFabricMeters(e.target.value)}
            />
          </div>
        </div>
        <p className="text-[11px] text-secondary/70">
          Note: the Pattern Rule Engine (`lib/pattern-engine/rules.ts`) needs a matching rule entry
          for a brand-new dress type to get lining/lace/elastic logic — otherwise it uses sensible
          defaults automatically.
        </p>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-400">{error}</p>
        )}

        <GlowButton type="submit" disabled={pending}>
          {pending ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16} /> Add Dress Type</>}
        </GlowButton>
      </form>
    </GlassCard>
  );
}
