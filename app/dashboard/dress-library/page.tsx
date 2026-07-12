import Link from "next/link";
import { dressLibrary } from "@/lib/content/dress-library";
import DressSilhouette from "@/components/library/DressSilhouette";
import { BilingualHeading, BilingualText } from "@/components/i18n/Bilingual";

export default function DressLibraryPage() {
  return (
    <div>
      <div className="mb-8">
        <BilingualHeading translationKey="dressLibraryTitle" />
        <BilingualText translationKey="dressLibrarySubtitle" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {dressLibrary.map((d) => (
          <Link
            key={d.slug}
            href={`/dashboard/dress-library/${d.slug}`}
            className="glass glass-hover flex flex-col items-center rounded-2xl p-5 text-center"
          >
            <DressSilhouette shape={d.shape} className="mb-3 h-20 w-20 text-primary" />
            <p className="text-sm font-medium">{d.name}</p>
            <p className="mt-1 text-[11px] capitalize text-secondary">{d.category}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
