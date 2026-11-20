import { RequireSignIn } from "@/components/InternetIdentity";
import { SignInPrompt } from "@/components/SignInPrompt";
import ChatPage from "@/pages/ChatPage";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const signedIn = !!identity && !identity.getPrincipal().isAnonymous();

  if (isInitializing) {
    return (
      <div
        data-ocid="auth.loading_state"
        className="flex min-h-dvh items-center justify-center bg-background text-sm text-muted-foreground"
      >
        <output>Opening Lumen…</output>
      </div>
    );
  }

  if (!signedIn) return <SignInPrompt />;

  return (
    <RequireSignIn fallback={<SignInPrompt />}>
      <ChatPage />
    </RequireSignIn>
  );
}
