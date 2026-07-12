import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone, Mail, MapPin, Pencil, Ruler, StickyNote } from "lucide-react";
import { getCustomerById, getMeasurementsForCustomer } from "@/lib/data/customers";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";
import DeleteButton from "@/components/ui/DeleteButton";
import MeasurementHistory from "@/components/measurements/MeasurementHistory";
import WorkflowNav from "@/components/ui/WorkflowNav";
import { deleteCustomer } from "@/lib/actions/customers";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomerById(id);
  if (!customer) notFound();

  const measurements = await getMeasurementsForCustomer(id);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">{customer.name}</h1>
          <p className="text-sm capitalize text-secondary">{customer.gender || "Customer"}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/customers/${id}/edit`}>
            <GlowButton variant="outline" className="px-4 py-2 text-xs">
              <Pencil size={13} /> Edit
            </GlowButton>
          </Link>
          <DeleteButton
            label="Delete Customer"
            confirmText="Delete customer and all their measurements?"
            onDelete={async () => {
              "use server";
              return deleteCustomer(id);
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-1">
          <h2 className="mb-4 text-sm font-medium text-white/80">Contact Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Phone size={15} className="text-primary" /> {customer.phone}
            </div>
            <div className="flex items-center gap-3">
              <Mail size={15} className="text-primary" /> {customer.email || "—"}
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={15} className="mt-0.5 shrink-0 text-primary" />
              <span className="text-secondary">{customer.address || "No address on file"}</span>
            </div>
            {customer.notes && (
              <div className="flex items-start gap-3 border-t border-primary/10 pt-3">
                <StickyNote size={15} className="mt-0.5 shrink-0 text-primary" />
                <span className="text-secondary">{customer.notes}</span>
              </div>
            )}
          </div>
        </GlassCard>

        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-medium text-white/80">
              <Ruler size={15} className="text-primary" /> Measurement History
            </h2>
            <Link href={`/dashboard/customers/${id}/measurements/new`}>
              <GlowButton className="px-4 py-2 text-xs">Add Measurement</GlowButton>
            </Link>
          </div>
          <MeasurementHistory measurements={measurements} />
        </div>
      </div>

      <WorkflowNav
        prev={{ label: "All Customers", href: "/dashboard/customers" }}
        next={{ label: "Generate Pattern", href: "/dashboard/patterns/new" }}
      />
    </div>
  );
}
