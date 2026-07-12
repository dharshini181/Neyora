import Link from "next/link";
import { Plus } from "lucide-react";
import { getDressTypes } from "@/lib/data/patterns";
import { deleteDressType } from "@/lib/actions/admin";
import DeleteButton from "@/components/ui/DeleteButton";
import GlowButton from "@/components/ui/GlowButton";

export default async function AdminDressTypesPage() {
  const dressTypes = await getDressTypes();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Dress Types</h1>
          <p className="text-sm text-secondary">The shared catalogue every tailor drafts patterns from.</p>
        </div>
        <Link href="/admin/dress-types/new">
          <GlowButton className="text-xs">
            <Plus size={14} /> Add Dress
          </GlowButton>
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-primary/10">
        <div className="hidden grid-cols-[2fr_1fr_1fr_auto] gap-4 border-b border-primary/10 bg-white/[0.02] px-6 py-3 text-xs uppercase tracking-wide text-secondary sm:grid">
          <span>Name</span>
          <span>Category</span>
          <span>Base Fabric</span>
          <span />
        </div>
        <div className="divide-y divide-primary/10">
          {dressTypes.map((d) => (
            <div key={d.id} className="grid grid-cols-1 gap-2 px-6 py-4 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-center sm:gap-4">
              <span className="text-sm font-medium">{d.name}</span>
              <span className="text-sm capitalize text-secondary">{d.category}</span>
              <span className="text-sm text-secondary">{d.base_fabric_meters}m</span>
              <DeleteButton label="" onDelete={() => deleteDressType(d.id)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
