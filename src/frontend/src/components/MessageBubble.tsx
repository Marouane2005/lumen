import { ASSISTANT } from "@/lib/assistant";
import { cn } from "@/lib/utils";
import type { ThreadMessage } from "@/types";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";

function TypingDots() {
  return (
    <span
      className="inline-flex items-center gap-1 py-1"
      aria-label={`${ASSISTANT.name} is thinking`}
    >
      {[0, 1, 2].map((index) => (
        <motion.span
          key={`dot-${index}`}
          className="size-1.5 rounded-full bg-primary/80"
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
          transition={{
            duration: 1.1,
            repeat: Number.POSITIVE_INFINITY,
            delay: index * 0.16,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}

export function MessageBubble({ message }: { message: ThreadMessage }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      data-ocid={isUser ? "chat.message.user" : "chat.message.assistant"}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "flex w-full gap-3",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {!isUser && (
        <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
          <Sparkles className="size-3.5" aria-hidden="true" />
        </span>
      )}
      <div
        className={cn(
          "max-w-[min(34rem,85%)] whitespace-pre-wrap break-words text-[0.95rem] leading-relaxed",
          isUser
            ? "rounded-[1.25rem] rounded-br-md bg-accent/22 px-4 py-3 text-foreground ring-1 ring-accent/25"
            : "px-1 py-1 text-foreground/92",
        )}
      >
        {message.text ? (
          message.text
        ) : message.streaming ? (
          <TypingDots />
        ) : null}
        {message.streaming && message.text && (
          <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-primary/70" />
        )}
      </div>
    </motion.div>
  );
}
