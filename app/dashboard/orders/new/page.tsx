import { getCustomers } from "@/lib/data/customers";
import { getDressTypes } from "@/lib/data/patterns";
import OrderForm from "@/components/orders/OrderForm";

export default async function NewOrderPage() {
  const [customers, dressTypes] = await Promise.all([getCustomers(), getDressTypes()]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold">New Order</h1>
        <p className="text-sm text-secondary">Create an order and track it through to delivery.</p>
      </div>
      <OrderForm customers={customers} dressTypes={dressTypes} />
    </div>
  );
}
