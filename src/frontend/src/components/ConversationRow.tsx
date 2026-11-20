import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ConversationSummary } from "@/types";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";

export function ConversationRow({
  conversation,
  active,
  onOpen,
  onRename,
  onDelete,
}: {
  conversation: ConversationSummary;
  active: boolean;
  onOpen: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(conversation.title);

  const startEditing = () => {
    setDraft(conversation.title);
    setEditing(true);
  };

  const commit = () => {
    const next = draft.trim();
    setEditing(false);
    if (next && next !== conversation.title) onRename(next);
  };

  if (editing) {
    return (
      <li className="rounded-xl bg-sidebar-accent/60 p-1.5">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            commit();
          }}
          className="flex items-center gap-1"
        >
          <label htmlFor={`rename-${conversation.id}`} className="sr-only">
            Rename conversation
          </label>
          <input
            id={`rename-${conversation.id}`}
            data-ocid="conversation.rename_input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setEditing(false);
            }}
            className="min-w-0 flex-1 rounded-md bg-background/70 px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
          <button
            type="submit"
            data-ocid="conversation.save_button"
            aria-label="Save title"
            className="flex size-7 items-center justify-center rounded-md text-primary hover:bg-primary/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
          >
            <Check className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            data-ocid="conversation.cancel_button"
            aria-label="Cancel rename"
            onClick={() => setEditing(false)}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </form>
      </li>
    );
  }

  return (
    <li
      className={cn(
        "group relative flex items-center rounded-xl transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/45",
      )}
    >
      <button
        type="button"
        data-ocid="conversation.item"
        onClick={onOpen}
        aria-current={active ? "true" : undefined}
        className="min-w-0 flex-1 rounded-xl px-3 py-2.5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
      >
        <span className="block truncate text-sm font-medium">
          {conversation.title}
        </span>
        <span className="mt-0.5 block truncate text-[0.7rem] text-muted-foreground">
          {formatRelativeTime(conversation.updatedAt)}
          {conversation.messageCount > 0n
            ? ` · ${conversation.messageCount.toString()} messages`
            : ""}
        </span>
      </button>
      <div className="flex shrink-0 items-center gap-0.5 pr-1.5 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
        <button
          type="button"
          data-ocid="conversation.edit_button"
          aria-label={`Rename ${conversation.title}`}
          onClick={startEditing}
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-background/40 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
        >
          <Pencil className="size-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          data-ocid="conversation.delete_button"
          aria-label={`Delete ${conversation.title}`}
          onClick={onDelete}
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/20 hover:text-destructive focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}
