import { Users } from "lucide-react";
import { getAllUsers } from "@/lib/data/admin";
import UserRoleSelect from "@/components/admin/UserRoleSelect";

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold">Users</h1>
        <p className="text-sm text-secondary">Every tailor account on the platform.</p>
      </div>

      {users.length === 0 ? (
        <div className="glass flex flex-col items-center gap-3 rounded-2xl py-16 text-center">
          <Users size={28} className="text-secondary" />
          <p className="text-sm text-secondary">No users found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-primary/10">
          <div className="hidden grid-cols-[2fr_1.5fr_1fr_1fr] gap-4 border-b border-primary/10 bg-white/[0.02] px-6 py-3 text-xs uppercase tracking-wide text-secondary sm:grid">
            <span>Name</span>
            <span>Business</span>
            <span>Joined</span>
            <span>Role</span>
          </div>
          <div className="divide-y divide-primary/10">
            {users.map((u) => (
              <div key={u.id} className="grid grid-cols-1 gap-2 px-6 py-4 sm:grid-cols-[2fr_1.5fr_1fr_1fr] sm:items-center sm:gap-4">
                <span className="text-sm font-medium">{u.full_name || "—"}</span>
                <span className="text-sm text-secondary">{u.business_name || "—"}</span>
                <span className="text-xs text-secondary">
                  {new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                <UserRoleSelect userId={u.id} role={u.role} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
