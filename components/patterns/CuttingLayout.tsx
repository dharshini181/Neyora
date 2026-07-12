import { Scissors, Layers, Sparkles } from "lucide-react";
import { getCuttingGuide } from "@/lib/pattern-engine/generate";

export default function CuttingLayout({ dressName }: { dressName: string }) {
  const guide = getCuttingGuide(dressName);

  return (
    <div className="space-y-6">
      <div className="flex gap-3 rounded-xl bg-white/[0.03] p-4">
        <Layers size={18} className="mt-0.5 shrink-0 text-primary" />
        <p className="text-sm text-secondary">{guide.foldingInstructions}</p>
      </div>

      <div>
        <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-white/80">
          <Scissors size={15} className="text-primary" /> Cutting Sequence
        </h4>
        <ol className="space-y-2.5">
          {guide.steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-secondary">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[11px] font-medium text-primary">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-white/80">
          <Sparkles size={15} className="text-primary" /> Fabric-Saving Tips
        </h4>
        <ul className="space-y-2">
          {guide.fabricSavingTips.map((tip, i) => (
            <li key={i} className="flex gap-2 text-sm text-secondary">
              <span className="text-primary">&bull;</span> {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
