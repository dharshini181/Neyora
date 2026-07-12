import { z } from "zod";

export const inventoryCategories = ["fabric", "thread", "accessory", "needle", "zip", "button"] as const;

export const inventoryItemSchema = z.object({
  name: z.string().min(2, "Enter an item name"),
  category: z.enum(inventoryCategories),
  quantity: z.coerce.number().min(0, "Enter a valid quantity"),
  unit: z.string().min(1, "Enter a unit (e.g. meters, pcs, spools)"),
  reorderLevel: z.coerce.number().min(0).default(0),
  costPerUnit: z.coerce.number().min(0).optional(),
  notes: z.string().optional().or(z.literal("")),
});
export type InventoryItemInput = z.infer<typeof inventoryItemSchema>;
