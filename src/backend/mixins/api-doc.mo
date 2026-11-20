mixin () {
  public query func getApiDoc() : async Text {
    "# Backend API\n" #
    "\n" #
    "This canister backs a friendly general-purpose AI chat assistant. Each signed-in user keeps their own private conversations. The browser talks to Caffeine Inference directly with a short-lived key minted by `getInferenceCredentials`; the backend stores conversations and messages and never proxies chat completions.\n" #
    "\n" #
    "## Authentication\n" #
    "\n" #
    "All conversation methods and `getInferenceCredentials` require a signed (non-anonymous) caller. Anonymous callers are rejected with a trap: `Sign in to use conversations` for conversation methods, and `Sign in to use AI features` for `getInferenceCredentials`.\n" #
    "\n" #
    "The app's frontend pins an Internet Identity derivation origin, published at `/.well-known/ii-derivation-origin` when available. An agent already holding the user's Internet Identity authorization derives the correct per-app principal against that origin (for example `icp identity link web <name> --app <host>`). Such a delegation acts with the user's full authority in this app until it expires.\n" #
    "\n" #
    "A principal that never signed in through this app's frontend is a different principal than the one the frontend registered, even when it belongs to the app's owner. Registration happens only when a caller signs in through the app's own frontend.\n" #
    "\n" #
    "## Authorization\n" #
    "\n" #
    "Every conversation is owned by the principal that created it. `listConversations`, `getConversation`, `appendMessage`, `renameConversation` and `deleteConversation` only ever act on the caller's own conversations. A conversation owned by another user is treated as absent: `getConversation` returns `null`, and the mutating methods return `#err(#notAuthorized)`.\n" #
    "\n" #
    "## Methods\n" #
    "\n" #
    "### `listConversations() : async [ConversationSummary]`\n" #
    "Returns the caller's conversations, newest activity first (descending `updatedAt`). Each summary carries `id`, `title`, `createdAt`, `updatedAt` and `messageCount`.\n" #
    "\n" #
    "### `createConversation(title : Text) : async ConversationSummary`\n" #
    "Creates a conversation owned by the caller with the given title and returns its summary. `createdAt` and `updatedAt` are set to the current time.\n" #
    "\n" #
    "### `getConversation(id : ConversationId) : async ?Conversation`\n" #
    "Returns the full conversation with its ordered `messages`, or `null` when it does not exist or is not owned by the caller.\n" #
    "\n" #
    "### `appendMessage(id : ConversationId, role : MessageRole, text : Text) : async { #ok : Conversation; #err : ConversationError }`\n" #
    "Appends a message to the caller's conversation and returns the updated conversation. `role` is `#user` or `#assistant`. `updatedAt` is set to the message timestamp. Returns `#err(#notFound)` when the conversation does not exist and `#err(#notAuthorized)` when it belongs to another user.\n" #
    "\n" #
    "### `renameConversation(id : ConversationId, title : Text) : async { #ok : ConversationSummary; #err : ConversationError }`\n" #
    "Renames the caller's conversation and returns its updated summary. `updatedAt` is refreshed. Errors as above.\n" #
    "\n" #
    "### `deleteConversation(id : ConversationId) : async { #ok; #err : ConversationError }`\n" #
    "Deletes the caller's conversation together with all of its messages. Errors as above.\n" #
    "\n" #
    "### `getInferenceCredentials() : async Credentials`\n" #
    "Mints a short-lived Caffeine Inference key for the signed-in caller. Returns `baseUrl`, `apiKey` and `expiresAt` (RFC 3339). The browser calls `POST {baseUrl}/v1/chat/completions` with `Authorization: Bearer {apiKey}` and `model: \"router\"`. Keys are reused for 15 minutes and limited to 30 mints per caller per hour; exceeding the limit traps with `Too many AI key requests, try again later`. Every deploy revokes minted keys, so the browser must request a new key after a `401`.\n" #
    "\n" #
    "### `schema() : async Text` and `execute(qJson : Text) : async Result`\n" #
    "OQL query endpoints. `conversation` and `message` entities are scoped per user: a signed-in caller reads only their own rows; anonymous callers are denied.\n" #
    "\n" #
    "## Units and encoding\n" #
    "\n" #
    "- `Timestamp` is `Int` nanoseconds since the Unix epoch (from `Time.now()`).\n" #
    "- `ConversationId` is a `Nat`.\n" #
    "- `MessageRole` is the variant `#user` or `#assistant`.\n" #
    "- `ConversationError` is the variant `#notFound` or `#notAuthorized`.\n" #
    "\n" #
    "## Lifecycle and polling\n" #
    "\n" #
    "Chat replies are generated in the browser, not the backend. The frontend streams the reply, then calls `appendMessage` with `#assistant` once the reply completes. Poll `listConversations` or `getConversation` to observe saved state; there is no server-side generation to poll.\n" #
    "\n" #
    "## Mutation retry safety\n" #
    "\n" #
    "`createConversation` and `appendMessage` are not idempotent: retrying `createConversation` creates a second conversation, and retrying `appendMessage` appends a duplicate message. Retry only after a confirmed failure, and reconcile by re-reading the conversation. `renameConversation` and `deleteConversation` are idempotent in effect: renaming to the same title is harmless, and deleting an already-deleted conversation returns `#err(#notFound)`.\n" #
    "\n" #
    "## Gotchas\n" #
    "\n" #
    "- A conversation owned by another user is indistinguishable from a missing one for `getConversation` (`null`), but mutating methods distinguish them with `#err(#notAuthorized)`.\n" #
    "- `getInferenceCredentials` never returns the app key; it returns a child key scoped to the caller's project.\n" #
    "- The last exchange can be lost if the tab closes before the `appendMessage` save lands."
  };
};
