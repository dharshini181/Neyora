import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  let fullName = user.user_metadata?.full_name ?? "Tailor";
  let businessName = user.user_metadata?.business_name ?? "My Business";
  let isAdmin = false;

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, business_name, role")
      .eq("id", user.id)
      .single();
    if (profile) {
      fullName = profile.full_name;
      businessName = profile.business_name;
      isAdmin = profile.role === "admin";
    }
  } catch {
    // profiles table not migrated yet — fall back to auth metadata above
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isAdmin={isAdmin} />
      <div className="lg:pl-64">
        <Topbar fullName={fullName} businessName={businessName} />
        <main className="px-6 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
