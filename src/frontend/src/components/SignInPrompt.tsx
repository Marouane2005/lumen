import { SignInButton } from "@/components/InternetIdentity";
import { LumenMark } from "@/components/LumenMark";
import { ASSISTANT } from "@/lib/assistant";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function SignInPrompt() {
  const { isInitializing, isLoggingIn } = useInternetIdentity();
  const busy = isInitializing || isLoggingIn;

  return (
    <section
      data-ocid="auth.panel"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background px-6 py-16 text-center"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,oklch(0.76_0.13_68/0.16),transparent_60%)]"
      />
      <div className="relative flex w-full max-w-md flex-col items-center">
        <LumenMark className="size-16" />
        <h1 className="mt-7 font-display text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
          {ASSISTANT.name}
        </h1>
        <p className="mt-2 text-sm uppercase tracking-[0.22em] text-primary/80">
          {ASSISTANT.tagline}
        </p>
        <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-muted-foreground">
          {ASSISTANT.personality} Sign in to keep your conversations private and
          pick up right where you left off.
        </p>
        <div className="mt-9 w-full max-w-xs">
          <SignInButton className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60" />
        </div>
        <p className="mt-4 text-xs text-muted-foreground/70">
          {busy
            ? "Opening your secure sign-in…"
            : "Your conversations stay tied to your Internet Identity."}
        </p>
      </div>
    </section>
  );
}
