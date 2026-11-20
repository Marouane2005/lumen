import { createActor } from "@/backend";
import { createInferenceChat } from "@/lib/inference";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMemo } from "react";

/** One inference client per signed-in session, keyed off the live actor. */
export function useInferenceChat() {
  const { actor } = useActor(createActor);
  return useMemo(
    () =>
      createInferenceChat(async () => {
        if (!actor) throw new Error("Backend is not ready");
        return actor.getInferenceCredentials();
      }),
    [actor],
  );
}
