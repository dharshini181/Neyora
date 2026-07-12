export type StyleCategory = "neck" | "sleeve" | "collar" | "pocket" | "border";

export type StyleEntry = {
  name: string;
  variant: string;
  description: string;
};

export const neckStyles: StyleEntry[] = [
  { name: "Round Neck", variant: "round", description: "A simple circular opening — the most beginner-friendly neckline to draft and finish." },
  { name: "V-Neck", variant: "v", description: "A V-shaped opening that elongates the neckline; depth is easy to adjust for modesty." },
  { name: "Boat Neck", variant: "boat", description: "A wide, shallow opening running shoulder to shoulder — classic on Kurtis and Anarkalis." },
  { name: "Sweetheart", variant: "sweetheart", description: "A curved, heart-shaped dip at the center front — common on blouses and gowns." },
  { name: "Halter", variant: "halter", description: "Straps that tie or fasten behind the neck, leaving the shoulders bare." },
];

export const sleeveStyles: StyleEntry[] = [
  { name: "Full Sleeve", variant: "full", description: "Sleeve extends to the wrist — the standard sleeve for shirts and Anarkalis." },
  { name: "Puff Sleeve", variant: "puff", description: "Gathered at the shoulder and/or cuff for a rounded, voluminous shape." },
  { name: "Bell Sleeve", variant: "bell", description: "Fitted at the shoulder, flaring out towards the wrist like a bell." },
  { name: "Cap Sleeve", variant: "cap", description: "A short sleeve that just covers the shoulder — minimal fabric, easy to set." },
  { name: "Sleeveless", variant: "sleeveless", description: "No sleeve — armhole is finished with a facing or bias binding." },
];

export const collarStyles: StyleEntry[] = [
  { name: "Peter Pan Collar", variant: "peterpan", description: "A flat, rounded collar that sits close to the neckline — soft and feminine." },
  { name: "Mandarin Collar", variant: "mandarin", description: "A short, stand-up band collar with no fold — common on kurtas and ethnic shirts." },
  { name: "Shirt Collar", variant: "shirt", description: "The classic two-piece collar with a stand and a fold, used on formal shirts." },
  { name: "Shawl Collar", variant: "shawl", description: "A single continuous curved piece running from the lapel to the back neck." },
  { name: "Notched Collar", variant: "notched", description: "A collar with a visible notch where the lapel meets the collar, common on jackets." },
];

export const pocketStyles: StyleEntry[] = [
  { name: "Patch Pocket", variant: "patch", description: "A pocket sewn directly onto the outside of the garment — visible and easy to stitch." },
  { name: "Welt Pocket", variant: "welt", description: "A pocket hidden inside the garment with only a narrow welt visible on the outside." },
  { name: "Slant Pocket", variant: "slant", description: "An angled side-seam pocket opening, common on trousers and salwars." },
  { name: "Flap Pocket", variant: "flap", description: "A patch or welt pocket finished with a covering flap for a structured look." },
  { name: "Hidden Pocket", variant: "hidden", description: "A pocket set inside a seam so no opening is visible from outside." },
];

export const borderStyles: StyleEntry[] = [
  { name: "Piping", variant: "piping", description: "A thin folded strip of contrast fabric inserted into a seam for a crisp edge." },
  { name: "Lace Trim", variant: "lace", description: "Decorative lace stitched along a hem, neckline, or sleeve edge." },
  { name: "Embroidered Border", variant: "embroidery", description: "A decorative embroidered band applied along the hem or neckline." },
  { name: "Contrast Border", variant: "contrast", description: "A plain strip of contrasting fabric added along an edge for definition." },
  { name: "Scallop Edge", variant: "scallop", description: "A repeating wave/shell-shaped finished edge, often on necklines and hems." },
];

export const styleCategories: { key: StyleCategory; label: string; items: StyleEntry[] }[] = [
  { key: "neck", label: "Neck Styles", items: neckStyles },
  { key: "sleeve", label: "Sleeve Styles", items: sleeveStyles },
  { key: "collar", label: "Collar Styles", items: collarStyles },
  { key: "pocket", label: "Pocket Styles", items: pocketStyles },
  { key: "border", label: "Border Styles", items: borderStyles },
];
