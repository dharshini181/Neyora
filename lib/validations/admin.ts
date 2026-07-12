import { z } from "zod";

export const dressTypeSchema = z.object({
  name: z.string().min(2, "Enter a dress name"),
  category: z.enum(["women", "men", "kids", "general"]),
  baseFabricMeters: z.coerce.number().min(0, "Enter a valid fabric amount"),
});
export type DressTypeInput = z.infer<typeof dressTypeSchema>;

export const tutorialSchema = z.object({
  dressName: z.string().min(1, "Choose a dress"),
  stepTitle: z.string().min(1, "Choose a stitching step"),
  title: z.string().min(2, "Enter a title for this tutorial"),
  youtubeUrl: z.string().url("Enter a valid YouTube URL"),
});
export type TutorialInput = z.infer<typeof tutorialSchema>;

export const userRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["owner", "staff", "admin"]),
});
