import { z } from "zod";

export const generatePatternSchema = z.object({
  customerId: z.string().uuid("Choose a customer"),
  measurementId: z.string().uuid("Choose a measurement set"),
  dressTypeId: z.string().uuid("Choose a dress type"),
});
export type GeneratePatternInput = z.infer<typeof generatePatternSchema>;
