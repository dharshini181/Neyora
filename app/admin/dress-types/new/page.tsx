import DressTypeForm from "@/components/admin/DressTypeForm";

export default function NewDressTypePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold">Add Dress Type</h1>
      </div>
      <DressTypeForm />
    </div>
  );
}
