import Link from "next/link";
import { Plus, Youtube } from "lucide-react";
import { getCuratedTutorials } from "@/lib/data/admin";
import { deleteTutorial } from "@/lib/actions/admin";
import DeleteButton from "@/components/ui/DeleteButton";
import GlowButton from "@/components/ui/GlowButton";

export default async function AdminTutorialsPage() {
  const tutorials = await getCuratedTutorials();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Tutorials</h1>
          <p className="text-sm text-secondary">
            Curated videos shown first on the Stitching Guide, before the live YouTube search fallback.
          </p>
        </div>
        <Link href="/admin/tutorials/new">
          <GlowButton className="text-xs">
            <Plus size={14} /> Add Tutorial
          </GlowButton>
        </Link>
      </div>

      {tutorials.length === 0 ? (
        <div className="glass flex flex-col items-center gap-3 rounded-2xl py-16 text-center">
          <Youtube size={28} className="text-secondary" />
          <p className="text-sm text-secondary">No curated tutorials yet — the Stitching Guide is using search links only.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-primary/10">
          <div className="hidden grid-cols-[1fr_1fr_1.5fr_auto] gap-4 border-b border-primary/10 bg-white/[0.02] px-6 py-3 text-xs uppercase tracking-wide text-secondary sm:grid">
            <span>Dress</span>
            <span>Step</span>
            <span>Title</span>
            <span />
          </div>
          <div className="divide-y divide-primary/10">
            {tutorials.map((t) => (
              <div key={t.id} className="grid grid-cols-1 gap-2 px-6 py-4 sm:grid-cols-[1fr_1fr_1.5fr_auto] sm:items-center sm:gap-4">
                <span className="text-sm">{t.dress_name}</span>
                <span className="text-sm text-secondary">{t.step_title}</span>
                <a href={t.youtube_url} target="_blank" rel="noopener noreferrer" className="truncate text-sm text-primary hover:underline">
                  {t.title}
                </a>
                <DeleteButton label="" onDelete={() => deleteTutorial(t.id)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
