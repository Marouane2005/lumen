import { LumenMark } from "@/components/LumenMark";
import { ASSISTANT } from "@/lib/assistant";
import { Menu } from "lucide-react";

export function ChatHeader({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  return (
    <header className="flex items-center gap-3 border-b border-border/70 bg-background/70 px-4 py-3 backdrop-blur sm:px-6">
      <button
        type="button"
        data-ocid="sidebar.open_button"
        aria-label="Open conversations"
        onClick={onOpenSidebar}
        className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring md:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>
      <LumenMark className="size-8 md:hidden" />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="font-display text-xl leading-none tracking-tight text-foreground">
            {ASSISTANT.name}
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/12 px-2 py-0.5 text-[0.65rem] font-medium text-success">
            <span
              className="size-1.5 rounded-full bg-success"
              aria-hidden="true"
            />
            online
          </span>
        </div>
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {ASSISTANT.tagline}
        </p>
      </div>
    </header>
  );
}
