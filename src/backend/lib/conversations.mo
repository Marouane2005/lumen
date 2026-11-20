import Int "mo:core/Int";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Types "../types/conversations";

module {
  public type Conversation = Types.Conversation;
  public type ConversationSummary = Types.ConversationSummary;
  public type Message = Types.Message;
  public type ConversationError = Types.ConversationError;

  public type State = {
    conversations : Map.Map<Types.ConversationId, Conversation>;
    var nextId : Nat;
  };

  func toSummary(c : Conversation) : ConversationSummary = {
    id = c.id;
    title = c.title;
    createdAt = c.createdAt;
    updatedAt = c.updatedAt;
    messageCount = c.messages.size();
  };

  func ownedBy(c : Conversation, caller : Principal) : Bool = Principal.equal(c.owner, caller);

  public func listConversations(state : State, caller : Principal) : [ConversationSummary] {
    let mine = state.conversations.values().filter(func c = ownedBy(c, caller)).toArray();
    let sorted = mine.sort(func (a, b) = Int.compare(b.updatedAt, a.updatedAt));
    sorted.map(func c = toSummary(c));
  };

  public func createConversation(state : State, caller : Principal, title : Text) : ConversationSummary {
    let now = Time.now();
    let id = state.nextId;
    state.nextId := id + 1;
    let conversation : Conversation = {
      id;
      owner = caller;
      title;
      createdAt = now;
      updatedAt = now;
      messages = [];
    };
    state.conversations.add(id, conversation);
    toSummary(conversation);
  };

  public func getConversation(state : State, caller : Principal, id : Types.ConversationId) : ?Conversation {
    switch (state.conversations.get(id)) {
      case (?c) { if (ownedBy(c, caller)) ?c else null };
      case null { null };
    };
  };

  public func appendMessage(
    state : State,
    caller : Principal,
    id : Types.ConversationId,
    role : Types.MessageRole,
    text : Text,
  ) : { #ok : Conversation; #err : ConversationError } {
    switch (state.conversations.get(id)) {
      case (?c) {
        if (not ownedBy(c, caller)) return #err(#notAuthorized);
        let message : Message = { role; text; createdAt = Time.now() };
        let updated : Conversation = {
          c with
          messages = c.messages.concat([message]);
          updatedAt = message.createdAt;
        };
        state.conversations.add(id, updated);
        #ok(updated);
      };
      case null { #err(#notFound) };
    };
  };

  public func renameConversation(
    state : State,
    caller : Principal,
    id : Types.ConversationId,
    title : Text,
  ) : { #ok : ConversationSummary; #err : ConversationError } {
    switch (state.conversations.get(id)) {
      case (?c) {
        if (not ownedBy(c, caller)) return #err(#notAuthorized);
        let updated : Conversation = { c with title; updatedAt = Time.now() };
        state.conversations.add(id, updated);
        #ok(toSummary(updated));
      };
      case null { #err(#notFound) };
    };
  };

  public func deleteConversation(
    state : State,
    caller : Principal,
    id : Types.ConversationId,
  ) : { #ok; #err : ConversationError } {
    switch (state.conversations.get(id)) {
      case (?c) {
        if (not ownedBy(c, caller)) return #err(#notAuthorized);
        state.conversations.remove(id);
        #ok;
      };
      case null { #err(#notFound) };
    };
  };
};
