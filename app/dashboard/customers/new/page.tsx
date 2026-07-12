import CustomerForm from "@/components/customers/CustomerForm";

export default function NewCustomerPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold">Add Customer</h1>
        <p className="text-sm text-secondary">Store their details once, reuse them for every order.</p>
      </div>
      <CustomerForm />
    </div>
  );
}
