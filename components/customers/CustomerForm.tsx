"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { customerSchema, type CustomerInput } from "@/lib/validations/customer";
import { createCustomer, updateCustomer } from "@/lib/actions/customers";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";
import type { Customer } from "@/lib/data/customers";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <label className="mb-1.5 block text-sm text-white/80">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-primary/15 bg-card px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-secondary/60 focus:border-primary/60 focus:shadow-glow-sm";

export default function CustomerForm({ customer }: { customer?: Customer }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerInput>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer
      ? {
          name: customer.name,
          phone: customer.phone,
          email: customer.email ?? "",
          address: customer.address ?? "",
          gender: customer.gender ?? undefined,
          notes: customer.notes ?? "",
        }
      : { name: "", phone: "", email: "", address: "", notes: "" },
  });

  const onSubmit = async (values: CustomerInput) => {
    setServerError(null);
    const result = customer
      ? await updateCustomer(customer.id, values)
      : await createCustomer(values);

    if (result.error) {
      setServerError(result.error);
      return;
    }

    const id = customer ? customer.id : (result as { data?: { id: string } }).data?.id;
    router.push(id ? `/dashboard/customers/${id}` : "/dashboard/customers");
    router.refresh();
  };

  return (
    <GlassCard className="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <Field label="Full name" error={errors.name?.message}>
            <input className={inputClass} placeholder="Anjali Sharma" {...register("name")} />
          </Field>
          <Field label="Phone number" error={errors.phone?.message}>
            <input className={inputClass} placeholder="+91 98765 43210" {...register("phone")} />
          </Field>
          <Field label="Email (optional)" error={errors.email?.message}>
            <input className={inputClass} placeholder="customer@email.com" {...register("email")} />
          </Field>
          <Field label="Gender">
            <select className={inputClass} {...register("gender")}>
              <option value="">Prefer not to say</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </Field>
        </div>

        <Field label="Address (optional)">
          <textarea
            className={inputClass}
            rows={2}
            placeholder="123 MG Road, Chennai"
            {...register("address")}
          />
        </Field>

        <Field label="Notes (optional)">
          <textarea
            className={inputClass}
            rows={3}
            placeholder="Preferences, fit notes, allergies to fabrics, etc."
            {...register("notes")}
          />
        </Field>

        {serverError && (
          <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-400">
            {serverError}
          </p>
        )}

        <div className="flex items-center gap-3">
          <GlowButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : customer ? (
              "Save Changes"
            ) : (
              "Add Customer"
            )}
          </GlowButton>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-secondary hover:text-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </GlassCard>
  );
}
