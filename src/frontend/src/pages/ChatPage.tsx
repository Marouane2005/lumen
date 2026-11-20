import { ChatHeader } from "@/components/ChatHeader";
import { Composer } from "@/components/Composer";
import { ConversationSidebar } from "@/components/ConversationSidebar";
import { EmptyThread } from "@/components/EmptyThread";
import { MessageBubble } from "@/components/MessageBubble";
import { ReplyError } from "@/components/ReplyError";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useInferenceChat } from "@/hooks/useInferenceChat";
import {
  useAppendMessage,
  useConversation,
  useConversations,
  useCreateConversation,
  useDeleteConversation,
  useRenameConversation,
} from "@/hooks/useQueries";
import { ASSISTANT } from "@/lib/assistant";
import { deriveTitle } from "@/lib/format";
import type { ChatMessage } from "@/lib/inference";
import type { ThreadMessage } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";

const ACTIVE_KEY = "lumen.activeConversation";

export default function ChatPage() {
  const chat = useInferenceChat();
  const conversations = useConversations();
  const createConversation = useCreateConversation();
  const appendMessage = useAppendMessage();
  const renameConversation = useRenameConversation();
  const deleteConversation = useDeleteConversation();

  const [activeId, setActiveId] = useState<bigint | null>(null);
  // True while the user is composing a brand-new conversation that has no
  // backend record yet. Blocks the restore effect from re-opening an old one.
  const [composing, setComposing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [streaming, setStreaming] = useState<ThreadMessage | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const [lastHistory, setLastHistory] = useState<ChatMessage[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [draftSeed, setDraftSeed] = useState<{ text: string; nonce: number }>({
    text: "",
    nonce: 0,
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = useConversation(activeId);
  const summaries = conversations.data ?? [];

  // Restore the last opened conversation once the list arrives, but never
  // override an explicit "New conversation" the user just started.
  useEffect(() => {
    if (composing || activeId !== null || summaries.length === 0) return;
    const stored = window.localStorage.getItem(ACTIVE_KEY);
    const match = summaries.find((item) => item.id.toString() === stored);
    setActiveId(match ? match.id : summaries[0].id);
  }, [activeId, composing, summaries]);

  const messages = active.data?.messages ?? [];
  const thread: ThreadMessage[] = messages.map((message, index) => ({
    key: `${activeId?.toString() ?? "none"}-${index}`,
    role: message.role,
    text: message.text,
    createdAt: message.createdAt,
  }));
  if (streaming) thread.push(streaming);

  // Keep the newest message in view as the reply streams in.
  const streamedText = streaming?.text ?? "";
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll follows new content, not the ref
  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [thread.length, streamedText]);

  const openConversation = useCallback((id: bigint) => {
    setActiveId(id);
    setComposing(false);
    setStreaming(null);
    setError(null);
    setLastPrompt(null);
    setSidebarOpen(false);
    window.localStorage.setItem(ACTIVE_KEY, id.toString());
  }, []);

  const startNew = useCallback(() => {
    setDraftSeed((current) => ({ text: "", nonce: current.nonce + 1 }));
    setActiveId(null);
    setComposing(true);
    setStreaming(null);
    setError(null);
    setLastPrompt(null);
    setSidebarOpen(false);
    window.localStorage.removeItem(ACTIVE_KEY);
  }, []);

  const generate = useCallback(
    async (conversationId: bigint, history: ChatMessage[], prompt: string) => {
      setPending(true);
      setError(null);
      setLastPrompt(prompt);
      setLastHistory(history);
      const key = `stream-${Date.now()}`;
      setStreaming({
        key,
        role: "assistant",
        text: "",
        createdAt: BigInt(Date.now()) * 1_000_000n,
        streaming: true,
      });
      try {
        const reply = await chat(
          [{ role: "system", content: ASSISTANT.systemPrompt }, ...history],
          (delta) =>
            setStreaming((current) =>
              current ? { ...current, text: current.text + delta } : current,
            ),
        );
        setStreaming(null);
        await appendMessage.mutateAsync({
          id: conversationId,
          role: "assistant",
          text: reply,
        });
      } catch (cause) {
        setStreaming(null);
        setError(
          cause instanceof Error && cause.message
            ? cause.message
            : "Something interrupted the connection.",
        );
      } finally {
        setPending(false);
      }
    },
    [appendMessage, chat],
  );

  const send = useCallback(
    async (text: string) => {
      if (pending) return;
      setError(null);
      try {
        let conversationId = activeId;
        if (conversationId === null) {
          const created = await createConversation.mutateAsync(
            deriveTitle(text),
          );
          conversationId = created.id;
          setActiveId(created.id);
          setComposing(false);
          window.localStorage.setItem(ACTIVE_KEY, created.id.toString());
        }
        const history: ChatMessage[] = [
          ...messages.map((message) => ({
            role: message.role,
            content: message.text,
          })),
          { role: "user", content: text },
        ];
        await appendMessage.mutateAsync({
          id: conversationId,
          role: "user",
          text,
        });
        await generate(conversationId, history, text);
      } catch (cause) {
        setError(
          cause instanceof Error && cause.message
            ? cause.message
            : "Your message could not be saved.",
        );
      }
    },
    [activeId, appendMessage, createConversation, generate, messages, pending],
  );

  const retry = useCallback(() => {
    if (!lastPrompt || activeId === null) return;
    // The failed user turn is already saved, so only the reply is regenerated.
    void generate(activeId, lastHistory, lastPrompt);
  }, [activeId, generate, lastHistory, lastPrompt]);

  const handleStarter = useCallback((prompt: string) => {
    setDraftSeed((current) => ({ text: prompt, nonce: current.nonce + 1 }));
  }, []);

  const handleDelete = (id: bigint) => {
    deleteConversation.mutate(id, {
      onSuccess: () => {
        if (id === activeId) startNew();
      },
      onError: (cause) => {
        setNotice(
          cause instanceof Error && cause.message
            ? cause.message
            : "That conversation could not be deleted.",
        );
      },
    });
  };

  const sidebar = (
    <ConversationSidebar
      conversations={summaries}
      activeId={activeId}
      loading={conversations.isLoading}
      onNew={startNew}
      onOpen={openConversation}
      onRename={(id, title) =>
        renameConversation.mutate(
          { id, title },
          {
            onError: (cause) =>
              setNotice(
                cause instanceof Error && cause.message
                  ? cause.message
                  : "That title could not be saved.",
              ),
          },
        )
      }
      onDelete={handleDelete}
    />
  );

  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      <aside className="hidden w-72 shrink-0 border-r border-sidebar-border md:block">
        {sidebar}
      </aside>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="w-[19rem] border-sidebar-border bg-sidebar p-0"
        >
          <SheetTitle className="sr-only">Your conversations</SheetTitle>
          {sidebar}
        </SheetContent>
      </Sheet>

      <main className="flex min-w-0 flex-1 flex-col">
        <ChatHeader onOpenSidebar={() => setSidebarOpen(true)} />

        {notice && (
          <output
            data-ocid="chat.notice"
            className="flex items-center gap-3 border-b border-border/60 bg-muted/40 px-4 py-2 text-xs text-muted-foreground sm:px-6"
          >
            <span className="min-w-0 flex-1">{notice}</span>
            <button
              type="button"
              data-ocid="chat.notice_close_button"
              onClick={() => setNotice(null)}
              className="rounded-md px-2 py-1 font-medium text-foreground hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
            >
              Dismiss
            </button>
          </output>
        )}

        <div
          ref={scrollRef}
          data-ocid="chat.thread"
          className="min-h-0 flex-1 overflow-y-auto"
        >
          {activeId === null || composing ? (
            <EmptyThread onPick={handleStarter} disabled={pending} />
          ) : active.isLoading ? (
            <div
              data-ocid="chat.loading_state"
              className="mx-auto w-full max-w-3xl space-y-4 px-5 py-10"
            >
              {Array.from({ length: 3 }, (_, i) => `thread-skeleton-${i}`).map(
                (id) => (
                  <div
                    key={id}
                    className="h-16 animate-pulse rounded-2xl bg-muted/40"
                  />
                ),
              )}
            </div>
          ) : (
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
              {thread.length === 0 && !pending ? (
                <EmptyThread onPick={handleStarter} disabled={pending} />
              ) : (
                thread.map((message) => (
                  <MessageBubble key={message.key} message={message} />
                ))
              )}
              {error && (
                <ReplyError
                  message={error}
                  onRetry={lastPrompt ? retry : () => setError(null)}
                />
              )}
            </div>
          )}
        </div>

        <Composer
          seed={draftSeed}
          onSend={(text) => void send(text)}
          disabled={activeId !== null && active.isLoading}
          pending={pending}
        />
      </main>
    </div>
  );
}
