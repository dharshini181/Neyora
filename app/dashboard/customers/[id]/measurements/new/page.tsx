import { notFound } from "next/navigation";
import { getCustomerById } from "@/lib/data/customers";
import MeasurementForm from "@/components/measurements/MeasurementForm";

export default async function NewMeasurementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomerById(id);
  if (!customer) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold">New Measurement</h1>
        <p className="text-sm text-secondary">For {customer.name}</p>
      </div>
      <MeasurementForm customerId={id} />
    </div>
  );
}
