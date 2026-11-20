import Common "../types/common";

module {
  public type Timestamp = Common.Timestamp;
  public type ConversationId = Common.ConversationId;

  public type MessageRole = { #user; #assistant };

  public type Message = {
    role : MessageRole;
    text : Text;
    createdAt : Timestamp;
  };

  public type Conversation = {
    id : ConversationId;
    owner : Principal;
    title : Text;
    createdAt : Timestamp;
    updatedAt : Timestamp;
    messages : [Message];
  };

  public type ConversationSummary = {
    id : ConversationId;
    title : Text;
    createdAt : Timestamp;
    updatedAt : Timestamp;
    messageCount : Nat;
  };

  public type ConversationError = {
    #notFound;
    #notAuthorized;
  };
};
