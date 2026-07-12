import { createClient } from "@/lib/supabase/server";

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  gender: "male" | "female" | "other" | null;
  notes: string | null;
  created_at: string;
};

export type Measurement = {
  id: string;
  customer_id: string;
  label: string;
  unit: "inch" | "cm";
  bust: number | null;
  waist: number | null;
  hip: number | null;
  shoulder: number | null;
  arm_round: number | null;
  sleeve_length: number | null;
  neck: number | null;
  dress_length: number | null;
  height: number | null;
  created_at: string;
};

/** Returns [] instead of throwing when Supabase isn't configured/migrated yet. */
export async function getCustomers(search?: string): Promise<Customer[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    let query = supabase
      .from("customers")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (search) {
      query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) return [];
    return data as Customer[];
  } catch {
    return [];
  }
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .eq("owner_id", user.id)
      .single();

    if (error) return null;
    return data as Customer;
  } catch {
    return null;
  }
}

export async function getMeasurementsForCustomer(customerId: string): Promise<Measurement[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("measurements")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) return [];
    return data as Measurement[];
  } catch {
    return [];
  }
}

export type MeasurementWithCustomer = Measurement & { customers: { name: string } | null };

export async function getAllMeasurements(search?: string): Promise<MeasurementWithCustomer[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const query = supabase
      .from("measurements")
      .select("*, customers(name)")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) return [];

    const rows = data as unknown as MeasurementWithCustomer[];
    if (!search) return rows;

    const q = search.toLowerCase();
    return rows.filter((r) => r.customers?.name?.toLowerCase().includes(q));
  } catch {
    return [];
  }
}
