import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Ephemeral "mo:caffeineai-inference-client/Ephemeral";

mixin (inferenceKeys : Ephemeral.Broker) {
  public shared ({ caller }) func getInferenceCredentials() : async Ephemeral.Credentials {
    if (caller.isAnonymous()) {
      Runtime.trap("Sign in to use AI features");
    };
    await* inferenceKeys.grant<system>(caller);
  };
};
