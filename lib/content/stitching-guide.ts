import { getRule } from "@/lib/pattern-engine/rules";

export type StitchingStep = {
  title: string;
  description: string;
  minutes: number;
};

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type StitchingGuide = {
  dressName: string;
  difficulty: Difficulty;
  totalMinutes: number;
  steps: StitchingStep[];
};

const DIFFICULTY_BY_DRESS: Record<string, Difficulty> = {
  Kurti: "Beginner",
  Churidar: "Beginner",
  Salwar: "Beginner",
  "Kids Wear": "Beginner",
  Frock: "Beginner",
  Anarkali: "Intermediate",
  Blouse: "Intermediate",
  "Men's Shirt": "Intermediate",
  Gown: "Advanced",
  Lehenga: "Advanced",
};

/** Builds a step-by-step stitching guide for a dress type, adjusting steps to that garment's rules (lining, elastic, interfacing). */
export function getStitchingGuide(dressName: string): StitchingGuide {
  const rule = getRule(dressName);
  const difficulty = DIFFICULTY_BY_DRESS[dressName] ?? "Intermediate";

  const steps: StitchingStep[] = [
    {
      title: "Cut & Mark",
      description:
        "Cut the Front, Back, and Sleeve pieces following the pattern layout. Transfer all notches and dart lines with tailor's chalk.",
      minutes: 20,
    },
    {
      title: "Stitch Darts",
      description:
        "Stitch the bust/waist darts on the Front and Back pieces first, pressing them towards the center for a smooth shape.",
      minutes: 15,
    },
  ];

  if (rule.needsInterfacing) {
    steps.push({
      title: "Apply Interfacing",
      description:
        "Fuse interfacing to the collar, cuffs, and plackets before assembly — this is what gives them structure and keeps edges crisp.",
      minutes: 15,
    });
  }

  steps.push(
    {
      title: "Join Shoulder Seams",
      description: "Join Front to Back at the shoulder seams, right sides together, then press the seam open.",
      minutes: 10,
    },
    {
      title: "Attach Sleeve",
      description:
        "Ease the sleeve head into the armhole, matching notches at the shoulder and underarm, and stitch with a slightly loose top thread tension.",
      minutes: 25,
    },
    {
      title: "Join Side Seams",
      description: "Stitch the side seam continuously from the sleeve hem down to the body hem in one pass.",
      minutes: 15,
    }
  );

  if (rule.needsLining) {
    steps.push({
      title: "Attach Lining",
      description:
        "Assemble the lining the same way as the outer fabric, then attach it at the neckline and armholes before finishing.",
      minutes: 30,
    });
  }

  steps.push({
    title: "Finish Neckline",
    description:
      "Finish the neckline with bias binding, facing, or lace trim depending on the design — this is the most visible seam, take your time.",
    minutes: 20,
  });

  if (rule.needsElastic) {
    steps.push({
      title: "Insert Elastic",
      description:
        "Stitch the waist casing, insert the elastic to the customer's waist measurement, and close the casing.",
      minutes: 15,
    });
  }

  if (rule.needsLace) {
    steps.push({
      title: "Attach Lace / Trim",
      description: "Stitch the reserved lace or trim along the finished neckline, sleeve hem, or border.",
      minutes: 15,
    });
  }

  steps.push({
    title: "Hem & Final Press",
    description:
      "Turn and stitch the bottom hem, trim all loose threads, and give the finished garment a final press.",
    minutes: 15,
  });

  const totalMinutes = steps.reduce((sum, s) => sum + s.minutes, 0);

  return { dressName, difficulty, totalMinutes, steps };
}

export function youtubeSearchUrl(dressName: string, stepTitle: string) {
  const query = `${dressName} ${stepTitle} stitching tutorial`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}
