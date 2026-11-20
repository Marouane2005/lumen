import { LumenMark } from "@/components/LumenMark";
import { ASSISTANT, STARTER_PROMPTS } from "@/lib/assistant";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { motion } from "motion/react";

export function EmptyThread({
  onPick,
  disabled,
}: {
  onPick: (prompt: string) => void;
  disabled?: boolean;
}) {
  return (
    <div
      data-ocid="chat.empty_state"
      className="mx-auto flex w-full max-w-2xl flex-col items-center px-5 py-10 text-center sm:py-16"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <LumenMark className="size-14" />
      </motion.div>
      <h2 className="mt-6 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
        A quiet place to think out loud
      </h2>
      <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
        {ASSISTANT.personality}
      </p>

      <div className="mt-9 grid w-full gap-2.5 sm:grid-cols-2">
        {STARTER_PROMPTS.map((starter, index) => (
          <motion.button
            key={starter.title}
            type="button"
            data-ocid={`chat.starter.${index + 1}`}
            disabled={disabled}
            onClick={() => onPick(starter.prompt)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.08 + index * 0.05 }}
            className="group flex items-start gap-3 rounded-2xl border border-border/70 bg-card/50 p-4 text-left transition-colors hover:border-primary/40 hover:bg-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60"
          >
            <MessageCircle
              className="mt-0.5 size-4 shrink-0 text-primary/80"
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-foreground">
                {starter.title}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                {starter.prompt}
              </span>
            </span>
            <ArrowUpRight
              className="size-4 shrink-0 text-muted-foreground/50 transition-colors group-hover:text-primary"
              aria-hidden="true"
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
