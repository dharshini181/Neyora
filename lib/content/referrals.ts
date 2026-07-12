export type ReferralItem = {
  name: string;
  description: string;
  searchQuery: string;
};

export type ReferralCategory = {
  key: string;
  label: string;
  items: ReferralItem[];
};

export const referralCategories: ReferralCategory[] = [
  {
    key: "fabrics",
    label: "Fabrics",
    items: [
      { name: "Cotton Fabric", description: "Breathable, everyday-wear fabric — good for Kurtis and Kids Wear.", searchQuery: "cotton fabric by the meter" },
      { name: "Georgette Fabric", description: "Light, flowy — a common choice for Anarkalis and Gowns.", searchQuery: "georgette fabric by the meter" },
      { name: "Silk Fabric", description: "Festive and bridal wear — Lehengas, Blouses.", searchQuery: "silk fabric by the meter" },
      { name: "Cotton Lycra", description: "Stretch comfort — Churidars and fitted Kurtis.", searchQuery: "cotton lycra fabric" },
    ],
  },
  {
    key: "threads",
    label: "Threads",
    items: [
      { name: "Polyester Sewing Thread Set", description: "All-purpose machine thread, multi-color set.", searchQuery: "polyester sewing thread set" },
      { name: "Cotton Embroidery Thread", description: "For hand-finishing and embroidered borders.", searchQuery: "cotton embroidery thread set" },
    ],
  },
  {
    key: "machines",
    label: "Sewing Machines",
    items: [
      { name: "Home Sewing Machine", description: "Entry-level electric machine for a home tailoring setup.", searchQuery: "home sewing machine electric" },
      { name: "Overlock / Serger Machine", description: "For clean, professional seam finishing.", searchQuery: "overlock serger sewing machine" },
    ],
  },
  {
    key: "accessories",
    label: "Accessories",
    items: [
      { name: "Measuring Tape", description: "Standard 150cm tailor's tape.", searchQuery: "tailor measuring tape" },
      { name: "Fabric Scissors", description: "Sharp, dedicated fabric-cutting shears.", searchQuery: "fabric cutting scissors tailor" },
      { name: "Tailor's Chalk", description: "For marking patterns and notches on fabric.", searchQuery: "tailor chalk marking set" },
      { name: "Assorted Buttons & Hooks", description: "Common sizes for shirts, blouses, and salwars.", searchQuery: "sewing buttons hooks assorted set" },
    ],
  },
];

/** Builds a real Amazon.in search URL, appending an affiliate tag only if one is configured. */
export function buildAmazonSearchUrl(query: string, affiliateTag?: string) {
  const params = new URLSearchParams({ k: query });
  if (affiliateTag) params.set("tag", affiliateTag);
  return `https://www.amazon.in/s?${params.toString()}`;
}
