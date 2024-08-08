import { STATUS_CODE } from "$fresh/server.ts";
import type { AppContext } from "../mod.ts";
import onPullRequestMerge from "../sdk/github/onPullRequestMerge.ts";
import onPullRequestOpen from "../sdk/github/onPullRequestOpen.ts";
import { isWebhookPullRequestPayload } from "../sdk/github/validateWebhookPayload.ts";
import { verify } from "../sdk/github/verifyWebhook.ts";
import type { WebhookPullRequestPayload } from "../types.ts";

export default async function action(
  props: WebhookPullRequestPayload | unknown,
  req: Request,
  ctx: AppContext,
) {
  if (!ctx.active) {
    return new Response("App is not active", {
      status: STATUS_CODE.ServiceUnavailable,
    });
  }

  const signature = req.headers.get("x-hub-signature-256");

  if (!signature) {
    return new Response("Signature is missing", {
      status: STATUS_CODE.Unauthorized,
    });
  }

  if (!isWebhookPullRequestPayload(props)) {
    return new Response("Invalid payload", { status: STATUS_CODE.BadRequest });
  }

  const project = ctx.projects.find(({ github }) =>
    `${github.org_name}/${github.repo_name}` === props.repository.full_name
  );
  if (!project) {
    return new Response("Unknown repository", {
      status: STATUS_CODE.BadRequest,
    });
  }

  const secret = project.github.webhook_secret.get();
  if (!secret) {
    return new Response("Secret is missing", {
      status: STATUS_CODE.BadRequest,
    });
  }

  if (!(await verify(secret, JSON.stringify(props), signature))) {
    return new Response("Invalid signature", {
      status: STATUS_CODE.Unauthorized,
    });
  }

  if (props.action === "opened") {
    return await onPullRequestOpen(props, project, ctx.discord.bot);
  } else if (props.action === "closed" && props.pull_request.merged) {
    return await onPullRequestMerge(props, project, ctx.discord.bot);
  }

  return new Response(null, { status: 200 });
}
