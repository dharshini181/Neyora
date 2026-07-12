"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Upload, Loader2, Sparkles, ExternalLink } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";
import { detectDressFromImage, type DressDetectionResult } from "@/lib/actions/ai";

function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve({ base64, mimeType: file.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function DressDetectionUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DressDetectionResult | null>(null);

  const onFile = async (file: File) => {
    setError(null);
    setResult(null);
    setPreview(URL.createObjectURL(file));
    setLoading(true);

    try {
      const { base64, mimeType } = await fileToBase64(file);
      const res = await detectDressFromImage(base64, mimeType);
      if (res.error) setError(res.error);
      else setResult(res.data!);
    } catch {
      setError("Couldn't read that image. Try a JPG or PNG under 5MB.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <GlassCard>
        <h2 className="mb-4 text-sm font-medium text-white/80">Upload a Dress Photo</h2>
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) onFile(file);
          }}
          className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/25 bg-white/[0.02] px-6 py-14 text-center transition hover:border-primary/50"
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Uploaded dress" className="max-h-64 rounded-xl object-contain" />
          ) : (
            <>
              <Upload size={28} className="mb-3 text-primary" />
              <p className="text-sm text-secondary">Click to upload or drag & drop</p>
              <p className="mt-1 text-xs text-secondary/60">JPG or PNG, up to 5MB</p>
            </>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
        />
        {preview && (
          <button
            onClick={() => inputRef.current?.click()}
            className="mt-3 text-xs text-primary hover:underline"
          >
            Upload a different photo
          </button>
        )}
      </GlassCard>

      <GlassCard>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-medium text-white/80">
          <Sparkles size={15} className="text-primary" /> AI Analysis
        </h2>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Loader2 size={24} className="mb-3 animate-spin text-primary" />
            <p className="text-sm text-secondary">Analyzing garment...</p>
          </div>
        )}

        {!loading && error && (
          <p className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-4 py-3 text-xs text-yellow-200/80">
            {error}
          </p>
        )}

        {!loading && !error && !result && (
          <p className="text-sm text-secondary">
            Upload a photo to identify the dress type, sleeve style, neckline, and get a fabric
            suggestion.
          </p>
        )}

        {!loading && result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Field label="Dress Type" value={result.dressType} />
              <Field label="Sleeve Style" value={result.sleeveStyle} />
              <Field label="Neckline" value={result.neckStyle} />
            </div>
            {result.fabricSuggestion && (
              <div className="rounded-xl bg-white/[0.03] px-4 py-3">
                <p className="mb-1 text-xs text-secondary">Fabric Suggestion</p>
                <p className="text-sm">{result.fabricSuggestion}</p>
              </div>
            )}

            {(result.matchedDressSlug || result.matchedNeck || result.matchedSleeve) && (
              <div>
                <p className="mb-2 text-xs text-secondary">Similar patterns in your library</p>
                <div className="flex flex-wrap gap-2">
                  {result.matchedDressSlug && (
                    <Link
                      href={`/dashboard/dress-library/${result.matchedDressSlug}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 px-3 py-1.5 text-xs text-primary hover:bg-primary/10"
                    >
                      View {result.dressType} in Dress Library <ExternalLink size={11} />
                    </Link>
                  )}
                  {result.matchedDressSlug && (
                    <Link href={`/dashboard/patterns/new`}>
                      <GlowButton className="px-3 py-1.5 text-xs">Generate This Pattern</GlowButton>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/[0.03] px-3 py-2.5 text-center">
      <p className="text-[10px] text-secondary">{label}</p>
      <p className="text-sm font-medium capitalize">{value}</p>
    </div>
  );
}
