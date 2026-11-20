import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import ConversationsLib "../lib/conversations";
import Types "../types/conversations";

mixin (state : ConversationsLib.State) {
  func requireSignedIn(caller : Principal) {
    if (caller.isAnonymous()) {
      Runtime.trap("Sign in to use conversations");
    };
  };

  public shared ({ caller }) func listConversations() : async [Types.ConversationSummary] {
    requireSignedIn(caller);
    ConversationsLib.listConversations(state, caller);
  };

  public shared ({ caller }) func createConversation(title : Text) : async Types.ConversationSummary {
    requireSignedIn(caller);
    ConversationsLib.createConversation(state, caller, title);
  };

  public shared ({ caller }) func getConversation(id : Types.ConversationId) : async ?Types.Conversation {
    requireSignedIn(caller);
    ConversationsLib.getConversation(state, caller, id);
  };

  public shared ({ caller }) func appendMessage(
    id : Types.ConversationId,
    role : Types.MessageRole,
    text : Text,
  ) : async { #ok : Types.Conversation; #err : Types.ConversationError } {
    requireSignedIn(caller);
    ConversationsLib.appendMessage(state, caller, id, role, text);
  };

  public shared ({ caller }) func renameConversation(
    id : Types.ConversationId,
    title : Text,
  ) : async { #ok : Types.ConversationSummary; #err : Types.ConversationError } {
    requireSignedIn(caller);
    ConversationsLib.renameConversation(state, caller, id, title);
  };

  public shared ({ caller }) func deleteConversation(
    id : Types.ConversationId,
  ) : async { #ok; #err : Types.ConversationError } {
    requireSignedIn(caller);
    ConversationsLib.deleteConversation(state, caller, id);
  };
};
