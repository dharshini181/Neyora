import { createClient } from "@/lib/supabase/server";

export type Invoice = {
  id: string;
  order_id: string;
  invoice_number: string;
  fabric_cost: number;
  labor_cost: number;
  accessories_cost: number;
  tax_percent: number;
  subtotal: number;
  tax_amount: number;
  total: number;
  issued_date: string;
  notes: string | null;
  created_at: string;
  orders: {
    advance_paid: number;
    customers: { name: string; phone: string; address: string | null } | null;
    dress_types: { name: string } | null;
  } | null;
};

export async function getInvoices(search?: string): Promise<Invoice[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("invoices")
      .select("*, orders(advance_paid, customers(name, phone, address), dress_types(name))")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (error) return [];
    let rows = data as unknown as Invoice[];
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (i) =>
          i.invoice_number.toLowerCase().includes(q) ||
          i.orders?.customers?.name?.toLowerCase().includes(q)
      );
    }
    return rows;
  } catch {
    return [];
  }
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("invoices")
      .select("*, orders(advance_paid, customers(name, phone, address), dress_types(name))")
      .eq("id", id)
      .eq("owner_id", user.id)
      .single();

    if (error) return null;
    return data as unknown as Invoice;
  } catch {
    return null;
  }
}
