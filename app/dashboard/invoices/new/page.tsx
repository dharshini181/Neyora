import { getOrders } from "@/lib/data/orders";
import InvoiceForm from "@/components/invoices/InvoiceForm";

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  const orders = await getOrders("all");

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold">Generate Invoice</h1>
        <p className="text-sm text-secondary">
          Pick an order — the amount is pulled in automatically, add your costs for the internal
          Profit Calculator.
        </p>
      </div>
      <InvoiceForm orders={orders} preselectedOrderId={orderId} />
    </div>
  );
}
