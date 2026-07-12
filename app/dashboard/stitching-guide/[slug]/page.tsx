import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Gauge, Youtube, Sparkles, BadgeCheck } from "lucide-react";
import { getDressLibraryEntry } from "@/lib/content/dress-library";
import { getStitchingGuide, youtubeSearchUrl } from "@/lib/content/stitching-guide";
import { getCuratedTutorialsForDress } from "@/lib/data/admin";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";

const difficultyColor: Record<string, string> = {
  Beginner: "border-primary/40 bg-primary/10 text-primary",
  Intermediate: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
  Advanced: "border-red-500/40 bg-red-500/10 text-red-400",
};

export default async function StitchingGuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dress = getDressLibraryEntry(slug);
  if (!dress) notFound();

  const guide = getStitchingGuide(dress.name);
  const curated = await getCuratedTutorialsForDress(dress.name);
  const hours = Math.round((guide.totalMinutes / 60) * 10) / 10;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">{dress.name} — Stitching Guide</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${difficultyColor[guide.difficulty]}`}
            >
              {guide.difficulty}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-secondary">
              <Clock size={13} /> ~{hours}h total
            </span>
            <span className="flex items-center gap-1.5 text-xs text-secondary">
              <Gauge size={13} /> {guide.steps.length} steps
            </span>
          </div>
        </div>
        <Link href="/dashboard/patterns/new">
          <GlowButton className="px-4 py-2 text-xs">
            <Sparkles size={13} /> Generate Pattern First
          </GlowButton>
        </Link>
      </div>

      <div className="space-y-4">
        {guide.steps.map((step, i) => {
          const curatedForStep = curated.find((t) => t.step_title === step.title);
          return (
            <GlassCard key={step.title} className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-medium text-primary">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-medium">{step.title}</h3>
                  <span className="text-xs text-secondary">~{step.minutes} min</span>
                </div>
                <p className="mb-3 text-sm leading-relaxed text-secondary">{step.description}</p>
                {curatedForStep ? (
                  <a
                    href={curatedForStep.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                  >
                    <BadgeCheck size={14} /> {curatedForStep.title}
                  </a>
                ) : (
                  <a
                    href={youtubeSearchUrl(dress.name, step.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                  >
                    <Youtube size={14} /> Find video tutorials for this step
                  </a>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>

      <p className="mt-6 text-[11px] text-secondary/70">
        {curated.length > 0
          ? "Steps marked with a checkmark use a tutorial picked by an admin; the rest fall back to a live YouTube search."
          : "Video links open a YouTube search for this exact dress and step, rather than a fixed embed — that way you always see current, relevant tutorials instead of one hardcoded video."}
      </p>
    </div>
  );
}
