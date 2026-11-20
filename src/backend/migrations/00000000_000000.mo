import AccessControl "mo:caffeineai-authorization/access-control";
import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type MessageRole = { #user; #assistant };

  type Message = {
    role : MessageRole;
    text : Text;
    createdAt : Int;
  };

  type Conversation = {
    id : Nat;
    owner : Principal;
    title : Text;
    createdAt : Int;
    updatedAt : Int;
    messages : [Message];
  };

  type ConversationsState = {
    conversations : Map.Map<Nat, Conversation>;
    var nextId : Nat;
  };

  public type OldActor = {};
  public type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    conversations : ConversationsState;
  };

  public func migration(_ : OldActor) : NewActor {
    {
      accessControlState = AccessControl.initState();
      conversations = {
        conversations = Map.empty();
        var nextId = 0;
      };
    };
  };
};
