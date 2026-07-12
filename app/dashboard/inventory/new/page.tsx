import InventoryForm from "@/components/inventory/InventoryForm";

export default function NewInventoryItemPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold">Add Inventory Item</h1>
        <p className="text-sm text-secondary">Track fabric, thread, and accessories in one place.</p>
      </div>
      <InventoryForm />
    </div>
  );
}
