import { styleCategories } from "@/lib/content/design-library";
import StyleIcon from "@/components/library/StyleIcon";
import GlassCard from "@/components/ui/GlassCard";
import { BilingualHeading, BilingualText } from "@/components/i18n/Bilingual";

export default function DesignLibraryPage() {
  return (
    <div>
      <div className="mb-8">
        <BilingualHeading translationKey="designLibraryTitle" />
        <BilingualText translationKey="designLibrarySubtitle" />
      </div>

      <div className="space-y-10">
        {styleCategories.map((cat) => (
          <div key={cat.key}>
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-primary">
              {cat.label}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {cat.items.map((item) => (
                <GlassCard key={item.name} className="text-center">
                  <div className="mx-auto mb-3 h-16 w-16 text-primary">
                    <StyleIcon category={cat.key} variant={item.variant} />
                  </div>
                  <p className="mb-1 text-sm font-medium">{item.name}</p>
                  <p className="text-[11px] leading-relaxed text-secondary">{item.description}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
