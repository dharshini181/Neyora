import { ExternalLink, IndianRupee } from "lucide-react";
import { referralCategories, buildAmazonSearchUrl } from "@/lib/content/referrals";
import GlassCard from "@/components/ui/GlassCard";
import { BilingualHeading, BilingualText } from "@/components/i18n/Bilingual";

export default function ReferralShoppingPage() {
  const affiliateTag = process.env.AMAZON_AFFILIATE_TAG;

  return (
    <div>
      <div className="mb-8">
        <BilingualHeading translationKey="referralsTitle" />
        <BilingualText translationKey="referralsSubtitle" />
      </div>

      {!affiliateTag && (
        <div className="mb-8 flex items-start gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/5 px-4 py-3">
          <IndianRupee size={16} className="mt-0.5 shrink-0 text-yellow-400" />
          <p className="text-xs text-yellow-200/80">
            These links work right now, but aren't earning commission yet. Join the{" "}
            <a
              href="https://affiliate-program.amazon.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Amazon Associates program
            </a>
            , then set <code className="text-primary">AMAZON_AFFILIATE_TAG</code> in{" "}
            <code className="text-primary">.env.local</code> to start earning.
          </p>
        </div>
      )}

      <div className="space-y-10">
        {referralCategories.map((cat) => (
          <div key={cat.key}>
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-primary">{cat.label}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {cat.items.map((item) => (
                <GlassCard key={item.name} className="flex flex-col justify-between">
                  <div>
                    <p className="mb-1.5 text-sm font-medium">{item.name}</p>
                    <p className="mb-4 text-xs leading-relaxed text-secondary">{item.description}</p>
                  </div>
                  <a
                    href={buildAmazonSearchUrl(item.searchQuery, affiliateTag)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                  >
                    Shop on Amazon <ExternalLink size={11} />
                  </a>
                </GlassCard>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
