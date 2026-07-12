import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  full_name: string;
  business_name: string | null;
  phone: string | null;
  role: "owner" | "staff" | "admin";
  preferred_language: string;
  avatar_url: string | null;
  email?: string;
};

export async function getCurrentProfile(): Promise<Profile | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (error || !data) return null;

    return { ...data, email: user.email } as Profile;
  } catch {
    return null;
  }
}
