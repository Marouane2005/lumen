import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Expose "mo:caffeineai-oql/Expose";
import Ephemeral "mo:caffeineai-inference-client/Ephemeral";
import ConversationsLib "lib/conversations";
import ConversationsApi "mixins/conversations-api";
import InferenceApi "mixins/inference-api";
import ApiDocMixin "mixins/api-doc";
import OqlLib "lib/oql";

actor {
  let accessControlState : AccessControl.AccessControlState;
  let conversations : ConversationsLib.State;

  transient let inferenceKeys = Ephemeral.Broker(Ephemeral.defaultLimits);

  include MixinAuthorization(accessControlState, null);
  include ConversationsApi(conversations);
  include InferenceApi(inferenceKeys);
  include ApiDocMixin();
  include Expose({ entities = OqlLib.entities(conversations) });
};
