import { z } from "zod";

export const orderStatuses = ["pending", "in_progress", "completed", "delivered", "cancelled"] as const;

export const orderSchema = z.object({
  customerId: z.string().uuid("Choose a customer"),
  dressTypeId: z.string().uuid("Choose a dress type"),
  measurementId: z.string().uuid().optional().or(z.literal("")),
  patternId: z.string().uuid().optional().or(z.literal("")),
  trialDate: z.string().optional().or(z.literal("")),
  deliveryDate: z.string().optional().or(z.literal("")),
  totalAmount: z.coerce.number().min(0, "Enter a valid amount"),
  advancePaid: z.coerce.number().min(0).default(0),
  notes: z.string().optional().or(z.literal("")),
});
export type OrderInput = z.infer<typeof orderSchema>;

export const orderStatusSchema = z.object({
  status: z.enum(orderStatuses),
});
