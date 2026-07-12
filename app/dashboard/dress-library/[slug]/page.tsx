import Link from "next/link";
import { notFound } from "next/navigation";
import { Sparkles, ListChecks, Ruler } from "lucide-react";
import { getDressLibraryEntry } from "@/lib/content/dress-library";
import { neckStyles, sleeveStyles } from "@/lib/content/design-library";
import DressSilhouette from "@/components/library/DressSilhouette";
import StyleIcon from "@/components/library/StyleIcon";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";

export default async function DressDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dress = getDressLibraryEntry(slug);
  if (!dress) notFound();

  const relatedNecks = neckStyles.filter((n) => dress.relatedNecklines.includes(n.name));
  const relatedSleeves = sleeveStyles.filter((s) => dress.relatedSleeves.includes(s.name));

  return (
    <div>
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5">
            <DressSilhouette shape={dress.shape} className="h-16 w-16 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold">{dress.name}</h1>
            <p className="text-sm capitalize text-secondary">{dress.category} wear</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/patterns/new">
            <GlowButton className="px-4 py-2 text-xs">
              <Sparkles size={13} /> Generate Pattern
            </GlowButton>
          </Link>
          <Link href={`/dashboard/stitching-guide/${dress.slug}`}>
            <GlowButton variant="outline" className="px-4 py-2 text-xs">
              <ListChecks size={13} /> Stitching Guide
            </GlowButton>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-medium text-white/80">About this Style</h2>
          <p className="mb-4 text-sm leading-relaxed text-secondary">{dress.description}</p>
          <div className="flex items-start gap-2 rounded-xl bg-white/[0.03] px-4 py-3 text-sm text-secondary">
            <Ruler size={15} className="mt-0.5 shrink-0 text-primary" /> {dress.bestFor}
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="mb-3 text-sm font-medium text-white/80">Quick Facts</h2>
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-secondary">Category</dt>
              <dd className="capitalize">{dress.category}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-secondary">Silhouette</dt>
              <dd className="capitalize">{dress.shape}</dd>
            </div>
          </dl>
        </GlassCard>

        {relatedNecks.length > 0 && (
          <GlassCard className="lg:col-span-1">
            <h2 className="mb-4 text-sm font-medium text-white/80">Popular Necklines</h2>
            <div className="grid grid-cols-3 gap-3">
              {relatedNecks.map((n) => (
                <div key={n.name} className="text-center">
                  <div className="mx-auto mb-1.5 h-12 w-12 text-primary">
                    <StyleIcon category="neck" variant={n.variant} />
                  </div>
                  <p className="text-[11px] text-secondary">{n.name}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {relatedSleeves.length > 0 && (
          <GlassCard className="lg:col-span-1">
            <h2 className="mb-4 text-sm font-medium text-white/80">Popular Sleeves</h2>
            <div className="grid grid-cols-3 gap-3">
              {relatedSleeves.map((s) => (
                <div key={s.name} className="text-center">
                  <div className="mx-auto mb-1.5 h-12 w-12 text-primary">
                    <StyleIcon category="sleeve" variant={s.variant} />
                  </div>
                  <p className="text-[11px] text-secondary">{s.name}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        <GlassCard className="lg:col-span-1">
          <h2 className="mb-3 text-sm font-medium text-white/80">More Styling</h2>
          <p className="mb-3 text-sm text-secondary">
            Browse collar, pocket, and border options in the full Design Library.
          </p>
          <Link href="/dashboard/design-library">
            <GlowButton variant="outline" className="w-full justify-center text-xs">
              Open Design Library
            </GlowButton>
          </Link>
        </GlassCard>
      </div>
    </div>
  );
}
