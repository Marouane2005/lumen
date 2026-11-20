import { ASSISTANT } from "@/lib/assistant";
import { cn } from "@/lib/utils";
import { ArrowUp, Loader2 } from "lucide-react";
import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

export function Composer({
  onSend,
  disabled,
  pending,
  seed,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
  pending?: boolean;
  /** A draft pushed in from outside (starter prompt, retry). */
  seed?: { text: string; nonce: number };
}) {
  const [draft, setDraft] = useState("");
  const [appliedSeed, setAppliedSeed] = useState(0);
  const canSend = draft.trim().length > 0 && !disabled && !pending;
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Apply an external draft during render so the textarea never flashes stale text.
  if (seed && seed.nonce !== appliedSeed) {
    setAppliedSeed(seed.nonce);
    setDraft(seed.text);
  }

  // Grow the field with its content, up to the max height.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-measure whenever the draft changes
  useEffect(() => {
    const node = inputRef.current;
    if (!node) return;
    node.style.height = "auto";
    node.style.height = `${Math.min(node.scrollHeight, 160)}px`;
  }, [draft]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || disabled || pending) return;
    setDraft("");
    onSend(text);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const text = draft.trim();
      if (!text || disabled || pending) return;
      setDraft("");
      onSend(text);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="mx-auto w-full max-w-3xl px-4 pb-4 pt-2 sm:px-6 sm:pb-6"
    >
      <div
        className={cn(
          "flex items-end gap-2 rounded-[1.5rem] border border-border/80 bg-card/80 p-2 pl-4",
          "shadow-[0_10px_30px_-18px_oklch(0.1_0.02_350/0.9)] backdrop-blur",
          "transition-colors focus-within:border-primary/45 focus-within:ring-2 focus-within:ring-primary/15",
        )}
      >
        <label htmlFor="composer-input" className="sr-only">
          Message {ASSISTANT.name}
        </label>
        <textarea
          ref={inputRef}
          id="composer-input"
          data-ocid="chat.textarea"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
          placeholder={`Ask ${ASSISTANT.name} anything…`}
          disabled={disabled}
          className={cn(
            "max-h-40 min-h-10 flex-1 resize-none bg-transparent py-2 text-[0.95rem] leading-relaxed",
            "text-foreground placeholder:text-muted-foreground/80 focus:outline-none disabled:opacity-60",
          )}
        />
        <button
          type="submit"
          data-ocid="chat.send_button"
          disabled={!canSend}
          aria-label={`Send message to ${ASSISTANT.name}`}
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full transition-all",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            "disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
          )}
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <ArrowUp className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>
      <p className="mt-2 text-center text-[0.7rem] text-muted-foreground/70">
        {ASSISTANT.name} can make mistakes — take what helps and leave the rest.
      </p>
    </form>
  );
}
