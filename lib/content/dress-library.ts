export type SilhouetteShape =
  | "straight"
  | "fitted"
  | "flared"
  | "twopiece"
  | "tunic";
export type DressLibraryEntry = {
  slug: string;
  name: string;
  category: "women" | "men" | "kids";
  shape: SilhouetteShape;
  description: string;
  bestFor: string;
  relatedNecklines: string[];
  relatedSleeves: string[];
};

export const dressLibrary: DressLibraryEntry[] = [
  {
    slug: "anarkali",
    name: "Anarkali",
    category: "women",
    shape: "flared",
    description:
      "A fitted bodice flowing into a long, floor-sweeping flare from the waist or hip — one of the most requested festive silhouettes.",
    bestFor: "Festive wear, all body types (the flare skims the hip and thigh).",
    relatedNecklines: ["Round Neck", "Boat Neck", "Sweetheart"],
    relatedSleeves: ["Full Sleeve", "Bell Sleeve", "Cap Sleeve"],
  },
  {
    slug: "kurti",
    name: "Kurti",
    category: "women",
    shape: "straight",
    description:
      "A straight-cut, knee-to-calf length top worn over leggings or churidars — the everyday staple of most Indian wardrobes.",
    bestFor: "Daily wear, easiest silhouette for beginners to draft and stitch.",
    relatedNecklines: ["Round Neck", "V-Neck", "Boat Neck"],
    relatedSleeves: ["Cap Sleeve", "Full Sleeve", "Sleeveless"],
  },
  {
    slug: "salwar",
    name: "Salwar",
    category: "women",
    shape: "twopiece",
    description:
      "Loose, pleated trousers that taper and gather at the ankle, worn with a kameez — comfortable, traditional, forgiving on fit.",
    bestFor: "Everyday and semi-formal wear; very fabric-economical.",
    relatedNecklines: [],
    relatedSleeves: [],
  },
  {
    slug: "churidar",
    name: "Churidar",
    category: "women",
    shape: "fitted",
    description:
      "Ankle-length, close-fitting trousers that bunch into soft folds ('churis') at the ankle — a more tailored alternative to the salwar.",
    bestFor: "Pairs with kurtis and long tops; needs a close, accurate fit.",
    relatedNecklines: [],
    relatedSleeves: [],
  },
  {
    slug: "blouse",
    name: "Blouse",
    category: "women",
    shape: "fitted",
    description:
      "A short, fitted top cut precisely to the bust and worn under a saree — precision in the dart and armhole matters most here.",
    bestFor: "Saree pairing; the most fit-critical garment in the library.",
    relatedNecklines: ["Sweetheart", "Boat Neck", "Halter"],
    relatedSleeves: ["Cap Sleeve", "Sleeveless", "Puff Sleeve"],
  },
  {
    slug: "lehenga",
    name: "Lehenga",
    category: "women",
    shape: "flared",
    description:
      "A heavily flared, floor-length skirt paired with a fitted choli — built from multiple panels for maximum flare and movement.",
    bestFor: "Bridal and festive wear; an advanced multi-panel construction.",
    relatedNecklines: ["Sweetheart", "Boat Neck"],
    relatedSleeves: ["Cap Sleeve", "Full Sleeve"],
  },
  {
    slug: "gown",
    name: "Gown",
    category: "women",
    shape: "flared",
    description:
      "A single-piece, floor-length silhouette — fitted through the bodice and released into a flare from the waist or empire line.",
    bestFor: "Evening and party wear; needs accurate princess-line seams.",
    relatedNecklines: ["V-Neck", "Sweetheart", "Halter"],
    relatedSleeves: ["Sleeveless", "Full Sleeve", "Bell Sleeve"],
  },
  {
    slug: "frock",
    name: "Frock",
    category: "kids",
    shape: "flared",
    description:
      "A simple, flared knee-length dress for children — generous ease and easy-access closures matter more than a precise fit.",
    bestFor: "Kids' daily and party wear.",
    relatedNecklines: ["Round Neck", "Boat Neck"],
    relatedSleeves: ["Puff Sleeve", "Cap Sleeve", "Sleeveless"],
  },
  {
    slug: "mens-shirt",
    name: "Men's Shirt",
    category: "men",
    shape: "straight",
    description:
      "The classic collared, buttoned shirt — a straight body with set-in sleeves, a collar stand, and a placket.",
    bestFor: "Formal and casual menswear; a strong intermediate project.",
    relatedNecklines: [],
    relatedSleeves: ["Full Sleeve"],
  },
  {
    slug: "kids-wear",
    name: "Kids Wear",
    category: "kids",
    shape: "tunic",
    description:
      "General children's tunic/top block — loose, comfortable, and quick to stitch, built with growing room.",
    bestFor: "Everyday kidswear; great first project for new tailors.",
    relatedNecklines: ["Round Neck"],
    relatedSleeves: ["Cap Sleeve", "Puff Sleeve"],
  },
];

export function getDressLibraryEntry(slug: string) {
  return dressLibrary.find((d) => d.slug === slug) ?? null;
}
