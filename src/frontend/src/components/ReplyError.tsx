import { ASSISTANT } from "@/lib/assistant";
import { AlertCircle, RotateCcw } from "lucide-react";

export function ReplyError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      role="alert"
      data-ocid="chat.error_state"
      className="flex flex-wrap items-center gap-3 rounded-xl border border-destructive/35 bg-destructive/10 px-4 py-3 text-sm text-foreground"
    >
      <AlertCircle
        className="size-4 shrink-0 text-destructive"
        aria-hidden="true"
      />
      <p className="min-w-0 flex-1">
        {ASSISTANT.name} couldn't finish that reply. {message}
      </p>
      <button
        type="button"
        data-ocid="chat.retry_button"
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 rounded-full border border-border/80 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <RotateCcw className="size-3.5" aria-hidden="true" />
        Try again
      </button>
    </div>
  );
}
