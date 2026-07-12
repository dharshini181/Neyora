import AuthShell from "@/components/auth/AuthShell";
import GoogleButton from "@/components/auth/GoogleButton";

export default function SignupPage() {
  return (
    <AuthShell title="Create your workspace" subtitle="Start free — no card required.">
      <GoogleButton />
      <p className="mt-6 text-center text-xs text-secondary">
        One click, no password to remember. Already have an account? Signing in
        with the same Google account takes you straight back to your workspace.
      </p>
    </AuthShell>
  );
}
