import type {
  WebhookPingPayload,
  WebhookPullRequestPayload,
} from "../../types.ts";

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

export function isWebhookPingPayload(
  props: WebhookPingPayload | unknown,
): props is WebhookPingPayload {
  return (
    typeof props === "object" &&
    props !== null &&
    "zen" in props &&
    typeof props.zen === "string"
  );
}
