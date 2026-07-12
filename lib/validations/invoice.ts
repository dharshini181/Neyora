import { z } from "zod";

export const invoiceSchema = z.object({
  orderId: z.string().uuid("Choose an order"),
  fabricCost: z.coerce.number().min(0).default(0),
  laborCost: z.coerce.number().min(0).default(0),
  accessoriesCost: z.coerce.number().min(0).default(0),
  taxPercent: z.coerce.number().min(0).max(28).default(0),
  notes: z.string().optional().or(z.literal("")),
});
export type InvoiceInput = z.infer<typeof invoiceSchema>;
