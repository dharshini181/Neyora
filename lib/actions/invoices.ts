"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { invoiceSchema, type InvoiceInput } from "@/lib/validations/invoice";
import type { ActionResult } from "@/lib/actions/customers";

export async function createInvoice(input: InvoiceInput): Promise<ActionResult<{ id: string }>> {
  const parsed = invoiceSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid data" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("total_amount, advance_paid")
    .eq("id", parsed.data.orderId)
    .eq("owner_id", user.id)
    .single();

  if (orderError || !order) return { error: "Order not found." };

  const { count } = await supabase
    .from("invoices")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", user.id);

  const invoiceNumber = `INV-${String((count ?? 0) + 1).padStart(4, "0")}`;

  const subtotal = Number(order.total_amount);
  const taxAmount = subtotal * (parsed.data.taxPercent / 100);
  const total = subtotal + taxAmount;

  const { data, error } = await supabase
    .from("invoices")
    .insert({
      owner_id: user.id,
      order_id: parsed.data.orderId,
      invoice_number: invoiceNumber,
      fabric_cost: parsed.data.fabricCost,
      labor_cost: parsed.data.laborCost,
      accessories_cost: parsed.data.accessoriesCost,
      tax_percent: parsed.data.taxPercent,
      subtotal,
      tax_amount: taxAmount,
      total,
      notes: parsed.data.notes || null,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard/invoices");
  return { data: { id: data.id } };
}
