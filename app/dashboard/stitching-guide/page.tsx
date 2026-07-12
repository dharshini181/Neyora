import Link from "next/link";
import { Clock, Gauge } from "lucide-react";
import { dressLibrary } from "@/lib/content/dress-library";
import { getStitchingGuide } from "@/lib/content/stitching-guide";
import DressSilhouette from "@/components/library/DressSilhouette";
import { BilingualHeading, BilingualText } from "@/components/i18n/Bilingual";

const difficultyColor: Record<string, string> = {
  Beginner: "text-primary",
  Intermediate: "text-yellow-400",
  Advanced: "text-red-400",
};

export default function StitchingGuidePage() {
  return (
    <div>
      <div className="mb-8">
        <BilingualHeading translationKey="stitchingGuideTitle" />
        <BilingualText translationKey="stitchingGuideSubtitle" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dressLibrary.map((d) => {
          const guide = getStitchingGuide(d.name);
          return (
            <Link
              key={d.slug}
              href={`/dashboard/stitching-guide/${d.slug}`}
              className="glass glass-hover rounded-2xl p-6"
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/5">
                  <DressSilhouette shape={d.shape} className="h-9 w-9 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{d.name}</h3>
                  <p className={`text-xs font-medium ${difficultyColor[guide.difficulty]}`}>
                    {guide.difficulty}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-secondary">
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-primary/70" />
                  {Math.round(guide.totalMinutes / 60 * 10) / 10}h
                </span>
                <span className="flex items-center gap-1.5">
                  <Gauge size={13} className="text-primary/70" />
                  {guide.steps.length} steps
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
