"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { forgotPassword, type ActionState } from "@/lib/actions/auth";
import AuthShell from "@/components/auth/AuthShell";
import FormField from "@/components/auth/FormField";
import SubmitButton from "@/components/auth/SubmitButton";

const initialState: ActionState = {};

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState(forgotPassword, initialState);

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link."
    >
      <form action={formAction}>
        <FormField
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@studio.com"
          error={state.fieldErrors?.email?.[0]}
          autoComplete="email"
        />

        {state.error && (
          <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-400">
            {state.error}
          </p>
        )}
        {state.success && (
          <p className="mb-4 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5 text-xs text-primary">
            {state.success}
          </p>
        )}

        <SubmitButton>Send Reset Link</SubmitButton>
      </form>

      <Link
        href="/login"
        className="mt-8 flex items-center justify-center gap-1.5 text-sm text-secondary hover:text-primary"
      >
        <ArrowLeft size={14} /> Back to sign in
      </Link>
    </AuthShell>
  );
}
