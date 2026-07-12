import { notFound } from "next/navigation";
import { getInventoryItemById } from "@/lib/data/inventory";
import InventoryForm from "@/components/inventory/InventoryForm";

export default async function EditInventoryItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getInventoryItemById(id);
  if (!item) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold">Edit {item.name}</h1>
      </div>
      <InventoryForm item={item} />
    </div>
  );
}
