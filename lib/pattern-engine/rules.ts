/**
 * Pattern Rule Engine — rule table
 * ---------------------------------
 * Each dress type has its own drafting rules and fabric needs, stored here
 * as data rather than hardcoded per-dress logic. Adding a new garment means
 * adding a row here, not rewriting the calculator.
 *
 * All formulas are simplified, standard-ease drafting approximations meant
 * to give a tailor a solid, printable starting point — not a substitute for
 * a trial fitting. Units follow the measurement's own unit (inch or cm).
 */

export type DressRule = {
  name: string;
  category: "women" | "men" | "kids";
  /** Ease added to bust/chest for garment comfort */
  easeFactor: number;
  /** Whether this garment is typically lined */
  needsLining: boolean;
  /** Lining fabric as a fraction of main fabric required */
  liningFactor: number;
  /** Whether lace/trim is typically used (neckline, sleeve hem, border) */
  needsLace: boolean;
  /** Lace required per meter of neck+sleeve opening perimeter */
  laceFactor: number;
  /** Whether elastic is used (waistbands, salwars, kids wear) */
  needsElastic: boolean;
  /** Elastic length as a fraction of waist measurement */
  elasticFactor: number;
  /** Whether interfacing is used (collars, cuffs, plackets) */
  needsInterfacing: boolean;
  interfacingMeters: number;
  /** Base fabric multiplier relative to dress_types.base_fabric_meters */
  fabricScale: number;
  /** Standard cutting wastage, as a fraction */
  wastage: number;
  /** Seam allowance in the measurement's own unit (inch) */
  seamAllowance: number;
  /** Hem allowance in inches */
  hemAllowance: number;
};

export const dressRules: Record<string, DressRule> = {
  Anarkali: {
    name: "Anarkali", category: "women", easeFactor: 2.5,
    needsLining: true, liningFactor: 0.55,
    needsLace: true, laceFactor: 1.2,
    needsElastic: false, elasticFactor: 0,
    needsInterfacing: false, interfacingMeters: 0,
    fabricScale: 1.0, wastage: 0.1, seamAllowance: 0.625, hemAllowance: 1.5,
  },
  Kurti: {
    name: "Kurti", category: "women", easeFactor: 2,
    needsLining: false, liningFactor: 0,
    needsLace: true, laceFactor: 0.8,
    needsElastic: false, elasticFactor: 0,
    needsInterfacing: false, interfacingMeters: 0,
    fabricScale: 1.0, wastage: 0.08, seamAllowance: 0.625, hemAllowance: 1,
  },
  Salwar: {
    name: "Salwar", category: "women", easeFactor: 3,
    needsLining: false, liningFactor: 0,
    needsLace: false, laceFactor: 0,
    needsElastic: true, elasticFactor: 1.05,
    needsInterfacing: false, interfacingMeters: 0,
    fabricScale: 1.0, wastage: 0.08, seamAllowance: 0.625, hemAllowance: 1,
  },
  Churidar: {
    name: "Churidar", category: "women", easeFactor: 1.5,
    needsLining: false, liningFactor: 0,
    needsLace: false, laceFactor: 0,
    needsElastic: true, elasticFactor: 1.0,
    needsInterfacing: false, interfacingMeters: 0,
    fabricScale: 1.0, wastage: 0.1, seamAllowance: 0.5, hemAllowance: 0.75,
  },
  Blouse: {
    name: "Blouse", category: "women", easeFactor: 1.5,
    needsLining: true, liningFactor: 0.9,
    needsLace: true, laceFactor: 1.4,
    needsElastic: false, elasticFactor: 0,
    needsInterfacing: true, interfacingMeters: 0.25,
    fabricScale: 1.0, wastage: 0.12, seamAllowance: 0.625, hemAllowance: 0.75,
  },
  Lehenga: {
    name: "Lehenga", category: "women", easeFactor: 2,
    needsLining: true, liningFactor: 0.6,
    needsLace: true, laceFactor: 2.5,
    needsElastic: false, elasticFactor: 0,
    needsInterfacing: false, interfacingMeters: 0,
    fabricScale: 1.0, wastage: 0.12, seamAllowance: 0.625, hemAllowance: 2,
  },
  Gown: {
    name: "Gown", category: "women", easeFactor: 2.5,
    needsLining: true, liningFactor: 0.7,
    needsLace: true, laceFactor: 1.6,
    needsElastic: false, elasticFactor: 0,
    needsInterfacing: false, interfacingMeters: 0,
    fabricScale: 1.0, wastage: 0.1, seamAllowance: 0.625, hemAllowance: 1.5,
  },
  Frock: {
    name: "Frock", category: "kids", easeFactor: 2.5,
    needsLining: false, liningFactor: 0,
    needsLace: true, laceFactor: 1,
    needsElastic: true, elasticFactor: 0.9,
    needsInterfacing: false, interfacingMeters: 0,
    fabricScale: 1.0, wastage: 0.12, seamAllowance: 0.5, hemAllowance: 1,
  },
  "Men's Shirt": {
    name: "Men's Shirt", category: "men", easeFactor: 3,
    needsLining: false, liningFactor: 0,
    needsLace: false, laceFactor: 0,
    needsElastic: false, elasticFactor: 0,
    needsInterfacing: true, interfacingMeters: 0.3,
    fabricScale: 1.0, wastage: 0.08, seamAllowance: 0.625, hemAllowance: 1,
  },
  "Kids Wear": {
    name: "Kids Wear", category: "kids", easeFactor: 2,
    needsLining: false, liningFactor: 0,
    needsLace: true, laceFactor: 0.8,
    needsElastic: true, elasticFactor: 0.9,
    needsInterfacing: false, interfacingMeters: 0,
    fabricScale: 1.0, wastage: 0.14, seamAllowance: 0.5, hemAllowance: 0.75,
  },
};

/** Fallback used for any dress type not explicitly listed above. */
export const defaultRule: DressRule = {
  name: "Custom", category: "women", easeFactor: 2,
  needsLining: false, liningFactor: 0,
  needsLace: false, laceFactor: 0,
  needsElastic: false, elasticFactor: 0,
  needsInterfacing: false, interfacingMeters: 0,
  fabricScale: 1.0, wastage: 0.1, seamAllowance: 0.625, hemAllowance: 1,
};

export function getRule(dressName: string): DressRule {
  return dressRules[dressName] ?? { ...defaultRule, name: dressName };
}
