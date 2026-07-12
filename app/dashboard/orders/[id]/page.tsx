import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, IndianRupee, Receipt, FileText } from "lucide-react";
import { getOrderById } from "@/lib/data/orders";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";
import DeleteButton from "@/components/ui/DeleteButton";
import OrderStatusSelect from "@/components/orders/OrderStatusSelect";
import { deleteOrder } from "@/lib/actions/orders";
import WorkflowNav from "@/components/ui/WorkflowNav";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const balance = order.total_amount - order.advance_paid;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            {order.dress_types?.name ?? "Order"}
          </h1>
          <p className="text-sm text-secondary">
            for{" "}
            <Link href={`/dashboard/customers/${order.customer_id}`} className="text-primary hover:underline">
              {order.customers?.name ?? "Unknown"}
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusSelect orderId={order.id} status={order.status} />
          <DeleteButton
            label=""
            confirmText="Delete this order?"
            onDelete={async () => {
              "use server";
              return deleteOrder(id);
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <GlassCard>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-medium text-white/80">
            <Calendar size={15} className="text-primary" /> Dates
          </h2>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-secondary">Trial</span>
              <span>
                {order.trial_date
                  ? new Date(order.trial_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                  : "Not set"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Delivery</span>
              <span>
                {order.delivery_date
                  ? new Date(order.delivery_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                  : "Not set"}
              </span>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-medium text-white/80">
            <IndianRupee size={15} className="text-primary" /> Payment
          </h2>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-secondary">Total</span>
              <span>₹{order.total_amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Advance Paid</span>
              <span>₹{order.advance_paid}</span>
            </div>
            <div className="flex justify-between border-t border-primary/10 pt-2.5 font-medium text-primary">
              <span>Balance Due</span>
              <span>₹{balance}</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-medium text-white/80">
            <Receipt size={15} className="text-primary" /> Actions
          </h2>
          <div className="space-y-2">
            {order.pattern_id && (
              <Link href={`/dashboard/patterns/${order.pattern_id}`}>
                <GlowButton variant="outline" className="w-full justify-center text-xs">
                  View Pattern
                </GlowButton>
              </Link>
            )}
            <Link href={`/dashboard/invoices/new?orderId=${order.id}`}>
              <GlowButton className="w-full justify-center text-xs">
                <FileText size={13} /> Generate Invoice
              </GlowButton>
            </Link>
          </div>
        </GlassCard>

        {order.notes && (
          <GlassCard className="lg:col-span-3">
            <h2 className="mb-2 text-sm font-medium text-white/80">Notes</h2>
            <p className="text-sm text-secondary">{order.notes}</p>
          </GlassCard>
        )}
      </div>

      <WorkflowNav
        prev={{ label: "Back to Orders", href: "/dashboard/orders" }}
        next={{ label: "Generate Invoice", href: `/dashboard/invoices/new?orderId=${order.id}` }}
      />
    </div>
  );
}
