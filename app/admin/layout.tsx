import Link from "next/link";
import { ShieldCheck, ShieldAlert, LayoutGrid, Shirt, Youtube, Users, ArrowLeft } from "lucide-react";
import { getCurrentProfile } from "@/lib/data/settings";

const adminNav = [
  { label: "Overview", href: "/admin", icon: LayoutGrid },
  { label: "Dress Types", href: "/admin/dress-types", icon: Shirt },
  { label: "Tutorials", href: "/admin/tutorials", icon: Youtube },
  { label: "Users", href: "/admin/users", icon: Users },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <p className="text-sm text-secondary">Sign in to access the Admin Panel.</p>
      </div>
    );
  }

  if (profile.role !== "admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <ShieldAlert size={32} className="text-yellow-400" />
        <div>
          <h1 className="mb-1 font-display text-xl font-semibold">Admin access required</h1>
          <p className="max-w-sm text-sm text-secondary">
            Your account role is <span className="text-white">{profile.role}</span>. To try the
            Admin Panel, promote your account to <code className="text-primary">admin</code> in
            the Supabase SQL editor — see the comment at the bottom of{" "}
            <code className="text-primary">supabase/migrations/004_admin.sql</code>.
          </p>
        </div>
        <Link href="/dashboard" className="text-sm text-primary hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-primary/10 bg-background/80 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 text-primary">
            <ShieldCheck size={16} />
          </span>
          <span className="font-display text-lg font-semibold">Admin Panel</span>
        </div>
        <Link href="/dashboard" className="flex items-center gap-1.5 text-xs text-secondary hover:text-primary">
          <ArrowLeft size={13} /> Back to Dashboard
        </Link>
      </header>

      <div className="mx-auto flex max-w-6xl gap-8 px-6 py-8">
        <nav className="hidden w-48 shrink-0 space-y-1 sm:block">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm text-secondary transition-colors hover:bg-white/5 hover:text-white"
            >
              <item.icon size={16} /> {item.label}
            </Link>
          ))}
        </nav>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
