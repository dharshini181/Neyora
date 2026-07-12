import { Search } from "lucide-react";

export default function SearchBar({
  placeholder,
  defaultValue,
}: {
  placeholder: string;
  defaultValue?: string;
}) {
  return (
    <form method="get" className="relative w-full max-w-sm">
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" />
      <input
        type="text"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-full border border-primary/15 bg-card py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-secondary/60 focus:border-primary/50"
      />
    </form>
  );
}
