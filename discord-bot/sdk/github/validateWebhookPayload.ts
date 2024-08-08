import type { WebhookPullRequestPayload } from "../../types.ts";

export function isWebhookPullRequestPayload(
  props: WebhookPullRequestPayload | unknown,
): props is WebhookPullRequestPayload {
  return (
    typeof props === "object" &&
    props !== null &&
    "action" in props &&
    typeof props.action === "string"
  );
}
