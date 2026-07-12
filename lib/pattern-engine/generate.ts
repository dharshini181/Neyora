import { getRule, type DressRule } from "./rules";

export type MeasurementInput = {
  bust?: number | null;
  waist?: number | null;
  hip?: number | null;
  shoulder?: number | null;
  armRound?: number | null;
  sleeveLength?: number | null;
  neck?: number | null;
  dressLength?: number | null;
  height?: number | null;
  unit?: "inch" | "cm";
};

export type PatternPiece = {
  name: string;
  width: number;
  height: number;
  notes: string;
};

export type PatternResult = {
  unit: "inch" | "cm";
  seamAllowance: number;
  dartWidth: number;
  dartLength: number;
  pieces: PatternPiece[];
  warnings: string[];
};

export type FabricResult = {
  unit: "meter";
  mainFabric: number;
  lining: number;
  lace: number;
  elastic: number;
  interfacing: number;
  wastagePercent: number;
  totalWithWastage: number;
};

const AVG_ADULT_HEIGHT_INCH = 64; // ~163cm, used as the baseline for scaling base fabric
const AVG_ADULT_HEIGHT_CM = 163;

function toInches(value: number, unit: "inch" | "cm") {
  return unit === "cm" ? value / 2.54 : value;
}

/**
 * Computes simplified front/back/sleeve pattern dimensions from body
 * measurements using standard-ease drafting formulas. Values are in the
 * same unit the measurements were recorded in.
 */
export function generatePattern(dressName: string, m: MeasurementInput): PatternResult {
  const rule = getRule(dressName);
  const unit = m.unit ?? "inch";
  const warnings: string[] = [];

  const bust = m.bust ?? 0;
  const waist = m.waist ?? 0;
  const shoulder = m.shoulder ?? 0;
  const armRound = m.armRound ?? 0;
  const sleeveLength = m.sleeveLength ?? 0;
  const neck = m.neck ?? 0;
  const dressLength = m.dressLength ?? 0;

  if (!bust) warnings.push("Bust measurement missing — front/back width defaulted to 0. Add it for an accurate draft.");
  if (!dressLength) warnings.push("Dress length missing — using 0. Add it to size the body pieces.");

  const seamAllowance = rule.seamAllowance;
  const quarterBust = bust / 4;
  const ease = rule.easeFactor / 4;

  // Front is slightly wider than back to account for bust shaping
  const frontWidth = quarterBust + ease + seamAllowance * 2;
  const backWidth = quarterBust - 0.25 + seamAllowance * 2;

  const armholeDepth = shoulder ? shoulder / 2 + 2.25 : bust / 6 + 2.5;
  const bodyLength = dressLength + rule.hemAllowance + seamAllowance;

  const dartWidth = Math.max(bust / 4 - waist / 4, 0.5);
  const dartLength = armholeDepth * 0.65;

  const neckWidth = neck ? neck / 5 : 2.5;
  const neckDepth = neck ? neck / 5 + 0.5 : 3;

  const sleeveWidth = armRound ? armRound / 2 + 1.5 + seamAllowance * 2 : quarterBust;
  const sleeveFullLength = sleeveLength + seamAllowance + rule.hemAllowance / 2;

  const pieces: PatternPiece[] = [
    {
      name: "Front Body",
      width: round1(frontWidth),
      height: round1(bodyLength),
      notes: `Neck opening ${round1(neckWidth)}×${round1(neckDepth)} ${unit}, cut on fold`,
    },
    {
      name: "Back Body",
      width: round1(backWidth),
      height: round1(bodyLength),
      notes: `Dart: ${round1(dartWidth)} ${unit} wide × ${round1(dartLength)} ${unit} long, cut on fold`,
    },
    {
      name: "Sleeve",
      width: round1(sleeveWidth),
      height: round1(sleeveFullLength),
      notes: `Cut 2 (mirror pair), ease into armhole depth ${round1(armholeDepth)} ${unit}`,
    },
  ];

  return { unit, seamAllowance, dartWidth: round1(dartWidth), dartLength: round1(dartLength), pieces, warnings };
}

/**
 * Computes total fabric requirement (main fabric, lining, lace, elastic,
 * interfacing) in meters, including standard cutting wastage.
 */
export function calculateFabric(
  dressName: string,
  m: MeasurementInput,
  baseFabricMeters: number
): FabricResult {
  const rule = getRule(dressName);
  const unit = m.unit ?? "inch";

  const heightInch = m.height ? toInches(m.height, unit) : AVG_ADULT_HEIGHT_INCH;
  const waistInch = m.waist ? toInches(m.waist, unit) : 0;

  const heightScale = clamp(heightInch / AVG_ADULT_HEIGHT_INCH, 0.75, 1.35);
  const mainFabric = baseFabricMeters * rule.fabricScale * heightScale;

  const lining = rule.needsLining ? mainFabric * rule.liningFactor : 0;
  const lace = rule.needsLace ? rule.laceFactor : 0;
  const elastic = rule.needsElastic
    ? (waistInch || AVG_ADULT_HEIGHT_CM / 2.54 / 2.5) * 0.0254 * rule.elasticFactor
    : 0;
  const interfacing = rule.needsInterfacing ? rule.interfacingMeters : 0;

  const subtotal = mainFabric + lining;
  const totalWithWastage = subtotal * (1 + rule.wastage);

  return {
    unit: "meter",
    mainFabric: round2(mainFabric),
    lining: round2(lining),
    lace: round2(lace),
    elastic: round2(elastic),
    interfacing: round2(interfacing),
    wastagePercent: Math.round(rule.wastage * 100),
    totalWithWastage: round2(totalWithWastage),
  };
}

/** Static, per-dress-type cutting guidance — folding, sequence, and fabric-saving tips. */
export function getCuttingGuide(dressName: string): {
  foldingInstructions: string;
  steps: string[];
  fabricSavingTips: string[];
} {
  const rule = getRule(dressName);
  const foldingInstructions =
    rule.category === "kids"
      ? "Fold fabric in half lengthwise, selvedge to selvedge. Kids' pieces are small — nest them inside the offcuts of the body pieces."
      : "Fold fabric in half lengthwise (selvedge to selvedge) for symmetrical pieces (front/back on the fold); open a single layer for the sleeve pieces to cut 2 in mirror.";

  const steps = [
    "Press the fabric flat before cutting to remove fold lines that distort measurements.",
    "Lay the Front Body piece on the fold first — it's the widest piece and anchors the layout.",
    "Place the Back Body piece alongside, sharing the same fold line where possible.",
    "Cut the Sleeve pieces from the remaining single-layer fabric, mirrored (cut 2).",
    rule.needsLining ? "Cut lining pieces from the lining fabric using the same Front/Back pattern, minus seam allowance at the hem." : "Finish raw edges with overlock or a folded hem — no lining required for this style.",
    rule.needsLace ? "Reserve lace for the neckline and sleeve hems — measure and cut after the body pieces are stitched, to match the actual finished edge." : "Skip lace unless requested as a design add-on.",
    "Mark all notches (shoulder, side seam, sleeve head) with tailor's chalk before lifting pieces off the fabric.",
  ];

  const fabricSavingTips = [
    "Cut the sleeves from the fabric left over after the body pieces, rather than reserving a separate length.",
    "Alternate the direction of pattern pieces (head-to-toe) on printed/striped fabric only if the print is non-directional.",
    `Standard wastage for ${dressName} is budgeted at ${Math.round(rule.wastage * 100)}% — buy that much extra, no more.`,
    "Keep offcuts larger than 6 inches — they're enough for facings, plackets, or a matching mask/scrunchie for referral upsells.",
  ];

  return { foldingInstructions, steps, fabricSavingTips };
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}
function round2(n: number) {
  return Math.round(n * 100) / 100;
}
function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

export type { DressRule };
