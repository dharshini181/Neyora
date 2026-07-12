import Link from "next/link";
import { UserPlus, Users } from "lucide-react";
import { getCustomers } from "@/lib/data/customers";
import CustomerTable from "@/components/customers/CustomerTable";
import SearchBar from "@/components/ui/SearchBar";
import { BilingualHeading } from "@/components/i18n/Bilingual";
import GlowButton from "@/components/ui/GlowButton";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const customers = await getCustomers(q);
  const configured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <BilingualHeading translationKey="customersTitle" />
          <p className="text-sm text-secondary">
            {customers.length} customer{customers.length === 1 ? "" : "s"} in your workspace
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar placeholder="Search by name or phone" defaultValue={q} />
          <Link href="/dashboard/customers/new">
            <GlowButton className="w-full justify-center sm:w-auto">
              <UserPlus size={16} /> Add Customer
            </GlowButton>
          </Link>
        </div>
      </div>

      {!configured ? (
        <div className="glass flex flex-col items-center gap-3 rounded-2xl py-16 text-center">
          <Users size={28} className="text-secondary" />
          <p className="max-w-sm text-sm text-secondary">
            Connect Supabase and run <code className="text-primary">supabase/schema.sql</code> to
            start adding real customers. See the README for setup steps.
          </p>
        </div>
      ) : customers.length === 0 ? (
        <div className="glass flex flex-col items-center gap-3 rounded-2xl py-16 text-center">
          <Users size={28} className="text-secondary" />
          <p className="text-sm text-secondary">
            {q ? `No customers match "${q}".` : "No customers yet — add your first one."}
          </p>
          {!q && (
            <Link href="/dashboard/customers/new">
              <GlowButton className="mt-2">
                <UserPlus size={16} /> Add Customer
              </GlowButton>
            </Link>
          )}
        </div>
      ) : (
        <CustomerTable customers={customers} />
      )}
    </div>
  );
}
