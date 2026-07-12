import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(2, "Enter the customer's name"),
  phone: z.string().min(7, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  gender: z.enum(["male", "female", "other"]).optional(),
  notes: z.string().optional().or(z.literal("")),
});
export type CustomerInput = z.infer<typeof customerSchema>;

export const measurementSchema = z.object({
  label: z.string().min(1, "Give this set of measurements a name").default("Standard"),
  unit: z.enum(["inch", "cm"]).default("inch"),
  bust: z.coerce.number().min(0).optional(),
  waist: z.coerce.number().min(0).optional(),
  hip: z.coerce.number().min(0).optional(),
  shoulder: z.coerce.number().min(0).optional(),
  armRound: z.coerce.number().min(0).optional(),
  sleeveLength: z.coerce.number().min(0).optional(),
  neck: z.coerce.number().min(0).optional(),
  dressLength: z.coerce.number().min(0).optional(),
  height: z.coerce.number().min(0).optional(),
});
export type MeasurementInput = z.infer<typeof measurementSchema>;
