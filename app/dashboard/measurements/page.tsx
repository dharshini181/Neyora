import Link from "next/link";
import { Ruler } from "lucide-react";
import { getAllMeasurements } from "@/lib/data/customers";
import SearchBar from "@/components/ui/SearchBar";
import { BilingualHeading, BilingualText } from "@/components/i18n/Bilingual";

export default async function MeasurementsModulePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const measurements = await getAllMeasurements(q);
  const configured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <BilingualHeading translationKey="measurementsTitle" />
          <BilingualText translationKey="measurementsSubtitle" />
        </div>
        <SearchBar placeholder="Search by customer name" defaultValue={q} />
      </div>

      {!configured || measurements.length === 0 ? (
        <div className="glass flex flex-col items-center gap-3 rounded-2xl py-16 text-center">
          <Ruler size={28} className="text-secondary" />
          <p className="max-w-sm text-sm text-secondary">
            {!configured
              ? "Connect Supabase to start recording measurements."
              : q
              ? `No measurements found for "${q}".`
              : "No measurements recorded yet. Open a customer and add one."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-primary/10">
          <div className="hidden grid-cols-[2fr_1.2fr_1fr_1fr_1fr] gap-4 border-b border-primary/10 bg-white/[0.02] px-6 py-3 text-xs uppercase tracking-wide text-secondary sm:grid">
            <span>Customer</span>
            <span>Label</span>
            <span>Bust / Waist / Hip</span>
            <span>Unit</span>
            <span>Recorded</span>
          </div>
          <div className="divide-y divide-primary/10">
            {measurements.map((m) => (
              <Link
                key={m.id}
                href={`/dashboard/customers/${m.customer_id}`}
                className="grid grid-cols-1 gap-2 px-6 py-4 transition-colors hover:bg-primary/[0.04] sm:grid-cols-[2fr_1.2fr_1fr_1fr_1fr] sm:items-center sm:gap-4"
              >
                <span className="text-sm font-medium">{m.customers?.name ?? "Unknown"}</span>
                <span className="text-sm text-secondary">{m.label}</span>
                <span className="text-sm text-secondary">
                  {m.bust ?? "—"} / {m.waist ?? "—"} / {m.hip ?? "—"}
                </span>
                <span className="text-xs text-secondary">{m.unit}</span>
                <span className="text-xs text-secondary">
                  {new Date(m.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
