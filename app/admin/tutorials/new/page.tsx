import TutorialForm from "@/components/admin/TutorialForm";

export default function NewTutorialPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold">Add Tutorial</h1>
      </div>
      <TutorialForm />
    </div>
  );
}
