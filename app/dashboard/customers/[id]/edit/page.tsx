import { notFound } from "next/navigation";
import { getCustomerById } from "@/lib/data/customers";
import CustomerForm from "@/components/customers/CustomerForm";

export default async function EditCustomerPage({
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
        <h1 className="font-display text-2xl font-semibold">Edit {customer.name}</h1>
        <p className="text-sm text-secondary">Update their contact details and notes.</p>
      </div>
      <CustomerForm customer={customer} />
    </div>
  );
}
