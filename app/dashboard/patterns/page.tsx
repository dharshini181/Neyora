import Link from "next/link";
import { Shirt, Sparkles } from "lucide-react";
import { getPatterns } from "@/lib/data/patterns";
import SearchBar from "@/components/ui/SearchBar";
import GlowButton from "@/components/ui/GlowButton";
import { BilingualHeading, BilingualText } from "@/components/i18n/Bilingual";

export default async function PatternsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const patterns = await getPatterns(q);
  const configured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <BilingualHeading translationKey="patternsTitle" />
          <BilingualText translationKey="patternsSubtitle" />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar placeholder="Search by customer or dress" defaultValue={q} />
          <Link href="/dashboard/patterns/new">
            <GlowButton className="w-full justify-center sm:w-auto">
              <Sparkles size={16} /> Generate Pattern
            </GlowButton>
          </Link>
        </div>
      </div>

      {!configured || patterns.length === 0 ? (
        <div className="glass flex flex-col items-center gap-3 rounded-2xl py-16 text-center">
          <Shirt size={28} className="text-secondary" />
          <p className="max-w-sm text-sm text-secondary">
            {!configured
              ? "Connect Supabase and run the migrations to generate patterns."
              : q
              ? `No patterns match "${q}".`
              : "No patterns generated yet."}
          </p>
          {configured && !q && (
            <Link href="/dashboard/patterns/new">
              <GlowButton className="mt-2">
                <Sparkles size={16} /> Generate Pattern
              </GlowButton>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {patterns.map((p) => (
            <Link
              key={p.id}
              href={`/dashboard/patterns/${p.id}`}
              className="glass glass-hover rounded-2xl p-6"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                <Shirt size={18} />
              </div>
              <h3 className="mb-1 font-medium">{p.dress_types?.name ?? "Custom Dress"}</h3>
              <p className="mb-3 text-sm text-secondary">for {p.customers?.name ?? "Unknown"}</p>
              <div className="flex items-center justify-between text-xs text-secondary">
                <span>{p.fabric_data.totalWithWastage}m fabric</span>
                <span>
                  {new Date(p.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
