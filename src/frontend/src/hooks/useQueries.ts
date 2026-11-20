import { MessageRole, createActor } from "@/backend";
import type { ConversationSummary } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const conversationsKey = ["conversations"] as const;
const conversationKey = (id: bigint) =>
  ["conversation", id.toString()] as const;

export function useConversations() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ConversationSummary[]>({
    queryKey: conversationsKey,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listConversations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useConversation(id: bigint | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: conversationKey(id ?? 0n),
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getConversation(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreateConversation() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (title: string) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.createConversation(title);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: conversationsKey });
    },
  });
}

export function useAppendMessage() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      id: bigint;
      role: "user" | "assistant";
      text: string;
    }) => {
      if (!actor) throw new Error("Backend is not ready");
      const result = await actor.appendMessage(
        input.id,
        input.role === "user" ? MessageRole.user : MessageRole.assistant,
        input.text,
      );
      if (result.__kind__ === "err") {
        throw new Error(
          result.err === "notFound"
            ? "This conversation no longer exists."
            : "You do not have access to this conversation.",
        );
      }
      return result.ok;
    },
    onSuccess: (conversation) => {
      queryClient.setQueryData(conversationKey(conversation.id), conversation);
      void queryClient.invalidateQueries({ queryKey: conversationsKey });
    },
  });
}

export function useRenameConversation() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: bigint; title: string }) => {
      if (!actor) throw new Error("Backend is not ready");
      const result = await actor.renameConversation(input.id, input.title);
      if (result.__kind__ === "err") {
        throw new Error(
          result.err === "notFound"
            ? "This conversation no longer exists."
            : "You do not have access to this conversation.",
        );
      }
      return result.ok;
    },
    onSuccess: (summary) => {
      queryClient.setQueryData<ConversationSummary[]>(
        conversationsKey,
        (current) =>
          current?.map((item) => (item.id === summary.id ? summary : item)),
      );
      void queryClient.invalidateQueries({
        queryKey: conversationKey(summary.id),
      });
    },
  });
}

export function useDeleteConversation() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      const result = await actor.deleteConversation(id);
      if (result.__kind__ === "err") {
        throw new Error(
          result.err === "notFound"
            ? "This conversation no longer exists."
            : "You do not have access to this conversation.",
        );
      }
      return id;
    },
    onSuccess: (id) => {
      queryClient.removeQueries({ queryKey: conversationKey(id) });
      void queryClient.invalidateQueries({ queryKey: conversationsKey });
    },
  });
}
