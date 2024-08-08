import {
  type Bot,
  ButtonStyles,
  sendMessage,
  snowflakeToBigint,
} from "https://deno.land/x/discordeno@18.0.1/mod.ts";
import type { Project } from "../../mod.ts";
import type { WebhookPullRequestPayload } from "../../types.ts";
import { createActionRow, createButton } from "../discord/components.ts";
import { codeBlock } from "../discord/textFormatting.ts";
import { getRandomItem } from "../random.ts";

export default async function onPullRequestMerge(
  props: WebhookPullRequestPayload,
  project: Project,
  bot: Bot,
) {
  const { pull_request } = props;

  const owner = pull_request.user;
  const mergedBy = props.pull_request.merged_by ?? owner;

  const message = mergedBy.login === owner.login
    ? `**${mergedBy.login}** mergeou o próprio Pull Request.`
    : `**${mergedBy.login}** mergeou o Pull Request feito por **${owner.login}**.`;
  const mergedAt = new Date(
    pull_request.merged_at ?? pull_request.closed_at ??
      pull_request.created_at,
  ).getTime();
  const createdAt = new Date(pull_request.created_at).getTime();
  const diff = mergedAt - createdAt;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const duration: string[] = [];

  if (days > 0) duration.push(`${days} dia${days !== 1 ? "s" : ""}`);
  if (hours > 0) duration.push(`${hours} hora${hours !== 1 ? "s" : ""}`);
  if (minutes > 0) {
    duration.push(`${minutes} minuto${minutes !== 1 ? "s" : ""}`);
  }

  const theChosenOne = getRandomItem(project.users);
  const viewOnGithubRow = createActionRow([
    createButton({
      label: "Ver no GitHub",
      url: pull_request.html_url,
      style: ButtonStyles.Link,
    }),
  ]);

  await sendMessage(bot, project.discord.channel_id, {
    content: message,
    embeds: [{
      title: pull_request.title,
      description: pull_request.body ?? "",
      thumbnail: {
        url: mergedBy.avatar_url,
      },
      url: pull_request.html_url,
      color: 0x8957e5,
      fields: [
        ...(mergedAt !== createdAt
          ? [{
            name: "Duração",
            value: codeBlock(duration.join(", ")),
            inline: false,
          }]
          : []),
        {
          name: "Comentários",
          value: codeBlock(`${pull_request.comments ?? 0}`, "diff"),
          inline: false,
        },
        {
          name: "Commits",
          value: codeBlock(
            `${pull_request.commits ?? 0}`,
            "diff",
          ),
          inline: false,
        },
      ],
    }],
    components: [viewOnGithubRow],
    allowedMentions: {
      users: theChosenOne ? [snowflakeToBigint(theChosenOne.discordId)] : [],
    },
  });

  return new Response(null, { status: 204 });
}
