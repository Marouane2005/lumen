export type {
  Conversation,
  ConversationSummary,
  Message,
} from "@/backend";
export { ConversationError, MessageRole } from "@/backend";

/** A message rendered in the thread, including the in-flight assistant reply. */
export interface ThreadMessage {
  key: string;
  role: "user" | "assistant";
  text: string;
  createdAt: bigint;
  streaming?: boolean;
}
