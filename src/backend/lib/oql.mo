import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import OQL "mo:caffeineai-oql";
import Entity "mo:caffeineai-oql/Entity";
import MapEntity "mo:caffeineai-oql/MapEntity";
import ConversationsLib "../lib/conversations";
import Types "../types/conversations";

module {
  public type MessageRow = {
    conversationId : Nat;
    owner : Principal;
    role : Text;
    text : Text;
    createdAt : Int;
  };

  func roleText(role : Types.MessageRole) : Text = switch (role) {
    case (#user) { "user" };
    case (#assistant) { "assistant" };
  };

  func messageRows(state : ConversationsLib.State) : Iter.Iter<MessageRow> {
    state.conversations.values().flatMap(
      func (c : Types.Conversation) : Iter.Iter<MessageRow> =
        c.messages.values().map(
          func (m : Types.Message) : MessageRow = {
            conversationId = c.id;
            owner = c.owner;
            role = roleText(m.role);
            text = m.text;
            createdAt = m.createdAt;
          }
        )
    );
  };

  public func entities(state : ConversationsLib.State) : [Entity.Decl] {
    let sampleOwner = Principal.fromText("aaaaa-aa");
    [
      state.conversations.toEntityManual("conversation", "Conversation", "id")
        .payload("id", func (c : Types.Conversation) : Nat = c.id)
        .payload("owner", func (c : Types.Conversation) : Principal = c.owner)
        .payload("title", func (c : Types.Conversation) : Text = c.title)
        .payload("createdAt", func (c : Types.Conversation) : Int = c.createdAt)
        .payload("updatedAt", func (c : Types.Conversation) : Int = c.updatedAt)
        .sample({
          id = 0;
          owner = sampleOwner;
          title = "";
          createdAt = 0;
          updatedAt = 0;
          messages = [];
        })
        .ownedBy("owner")
        .scopedPerUser()
        .build(),
      Entity.new<MessageRow>(
        "message",
        func () = messageRows(state),
        "Message",
        "conversationId",
      )
        .sample({
          conversationId = 0;
          owner = sampleOwner;
          role = "user";
          text = "";
          createdAt = 0;
        })
        .ownedBy("owner")
        .scopedPerUser()
        .build(),
    ];
  };
};
