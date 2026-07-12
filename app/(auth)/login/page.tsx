import AuthShell from "@/components/auth/AuthShell";
import GoogleButton from "@/components/auth/GoogleButton";

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue to your workspace.">
      <GoogleButton />
      <p className="mt-6 text-center text-xs text-secondary">
        First time here? Signing in with Google creates your account automatically —
        no separate signup needed.
      </p>
    </AuthShell>
  );
}
