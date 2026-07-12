/**
 * Parses a spoken transcript like "bust 38 waist 34 sleeve length 20" into
 * partial measurement values. Longer, more specific phrases (e.g. "sleeve
 * length", "arm round") are matched before shorter/ambiguous ones.
 */
export type ParsedMeasurements = {
  bust?: number;
  waist?: number;
  hip?: number;
  shoulder?: number;
  armRound?: number;
  sleeveLength?: number;
  neck?: number;
  dressLength?: number;
  height?: number;
};

const NUMBER = "(\\d+(?:\\.\\d+)?)";

const patterns: { key: keyof ParsedMeasurements; regex: RegExp }[] = [
  { key: "armRound", regex: new RegExp(`arm\\s*round\\s*(?:is|=|:)?\\s*${NUMBER}`, "i") },
  { key: "sleeveLength", regex: new RegExp(`sleeve\\s*length\\s*(?:is|=|:)?\\s*${NUMBER}`, "i") },
  { key: "dressLength", regex: new RegExp(`dress\\s*length\\s*(?:is|=|:)?\\s*${NUMBER}`, "i") },
  { key: "bust", regex: new RegExp(`bust\\s*(?:is|=|:)?\\s*${NUMBER}`, "i") },
  { key: "waist", regex: new RegExp(`waist\\s*(?:is|=|:)?\\s*${NUMBER}`, "i") },
  { key: "hip", regex: new RegExp(`hip\\s*(?:is|=|:)?\\s*${NUMBER}`, "i") },
  { key: "shoulder", regex: new RegExp(`shoulder\\s*(?:is|=|:)?\\s*${NUMBER}`, "i") },
  { key: "neck", regex: new RegExp(`neck\\s*(?:is|=|:)?\\s*${NUMBER}`, "i") },
  { key: "height", regex: new RegExp(`height\\s*(?:is|=|:)?\\s*${NUMBER}`, "i") },
];

export function parseMeasurementTranscript(transcript: string): {
  values: ParsedMeasurements;
  matchedFields: string[];
} {
  const values: ParsedMeasurements = {};
  const matchedFields: string[] = [];
  let remaining = transcript;

  for (const { key, regex } of patterns) {
    const match = remaining.match(regex);
    if (match) {
      values[key] = parseFloat(match[1]);
      matchedFields.push(key);
      // Remove the matched phrase so shorter patterns don't re-match its number
      remaining = remaining.replace(match[0], " ");
    }
  }

  return { values, matchedFields };
}
