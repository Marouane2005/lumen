import { ConversationRow } from "@/components/ConversationRow";
import { SignInButton } from "@/components/InternetIdentity";
import { LumenMark } from "@/components/LumenMark";
import { ASSISTANT } from "@/lib/assistant";
import { cn } from "@/lib/utils";
import type { ConversationSummary } from "@/types";
import { Plus } from "lucide-react";

export function ConversationSidebar({
  conversations,
  activeId,
  loading,
  onNew,
  onOpen,
  onRename,
  onDelete,
  className,
}: {
  conversations: ConversationSummary[];
  activeId: bigint | null;
  loading: boolean;
  onNew: () => void;
  onOpen: (id: bigint) => void;
  onRename: (id: bigint, title: string) => void;
  onDelete: (id: bigint) => void;
  className?: string;
}) {
  return (
    <div
      data-ocid="sidebar.panel"
      className={cn(
        "flex h-full min-h-0 flex-col bg-sidebar text-sidebar-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 px-4 pb-4 pt-5">
        <LumenMark className="size-8" />
        <div className="min-w-0">
          <p className="font-display text-lg leading-none tracking-tight text-foreground">
            {ASSISTANT.name}
          </p>
          <p className="mt-1 truncate text-[0.68rem] text-muted-foreground">
            {ASSISTANT.tagline}
          </p>
        </div>
      </div>

      <div className="px-3">
        <button
          type="button"
          data-ocid="conversation.new_button"
          onClick={onNew}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Plus className="size-4" aria-hidden="true" />
          New conversation
        </button>
      </div>

      <div className="mt-5 flex min-h-0 flex-1 flex-col">
        <p className="px-4 pb-2 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
          Conversations
        </p>
        <nav
          aria-label="Your conversations"
          className="min-h-0 flex-1 overflow-y-auto px-2 pb-3"
        >
          {loading ? (
            <ul data-ocid="sidebar.loading_state" className="space-y-1.5 px-1">
              {Array.from({ length: 4 }, (_, i) => `skeleton-${i}`).map(
                (id) => (
                  <li
                    key={id}
                    className="h-12 animate-pulse rounded-xl bg-sidebar-accent/40"
                  />
                ),
              )}
            </ul>
          ) : conversations.length === 0 ? (
            <p
              data-ocid="sidebar.empty_state"
              className="px-3 py-6 text-center text-xs leading-relaxed text-muted-foreground"
            >
              No conversations yet. Start one and it will appear here.
            </p>
          ) : (
            <ul className="space-y-0.5">
              {conversations.map((conversation) => (
                <ConversationRow
                  key={conversation.id.toString()}
                  conversation={conversation}
                  active={conversation.id === activeId}
                  onOpen={() => onOpen(conversation.id)}
                  onRename={(title) => onRename(conversation.id, title)}
                  onDelete={() => onDelete(conversation.id)}
                />
              ))}
            </ul>
          )}
        </nav>
      </div>

      <div className="border-t border-sidebar-border px-3 py-3">
        <SignInButton className="w-full rounded-full px-3 py-2 text-left text-xs font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/50 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring" />
      </div>
    </div>
  );
}
