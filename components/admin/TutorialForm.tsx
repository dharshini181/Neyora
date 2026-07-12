"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { createTutorial } from "@/lib/actions/admin";
import { dressLibrary } from "@/lib/content/dress-library";
import { getStitchingGuide } from "@/lib/content/stitching-guide";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";

const inputClass =
  "w-full rounded-xl border border-primary/15 bg-card px-4 py-3 text-sm text-white outline-none transition-all focus:border-primary/60 focus:shadow-glow-sm";

export default function TutorialForm() {
  const router = useRouter();
  const [dressName, setDressName] = useState(dressLibrary[0].name);
  const [stepTitle, setStepTitle] = useState("");
  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const steps = useMemo(() => getStitchingGuide(dressName).steps, [dressName]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!stepTitle) {
      setError("Choose a stitching step.");
      return;
    }
    setPending(true);
    const result = await createTutorial({ dressName, stepTitle, title, youtubeUrl });
    setPending(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/admin/tutorials");
    router.refresh();
  };

  return (
    <GlassCard className="max-w-lg">
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm text-white/80">Dress</label>
            <select
              className={inputClass}
              value={dressName}
              onChange={(e) => {
                setDressName(e.target.value);
                setStepTitle("");
              }}
            >
              {dressLibrary.map((d) => (
                <option key={d.slug} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-white/80">Stitching step</label>
            <select className={inputClass} value={stepTitle} onChange={(e) => setStepTitle(e.target.value)}>
              <option value="">Select a step</option>
              {steps.map((s) => (
                <option key={s.title} value={s.title}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-white/80">Tutorial title</label>
          <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Attaching a princess-cut sleeve" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-white/80">YouTube URL</label>
          <input className={inputClass} value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-400">{error}</p>
        )}

        <GlowButton type="submit" disabled={pending}>
          {pending ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16} /> Add Tutorial</>}
        </GlowButton>
      </form>
    </GlassCard>
  );
}
