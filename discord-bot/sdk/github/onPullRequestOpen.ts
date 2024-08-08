import {
  type Bot,
  ButtonStyles,
  sendMessage,
  snowflakeToBigint,
} from "https://deno.land/x/discordeno@18.0.1/mod.ts";
import type { Project } from "../../mod.ts";
import type { WebhookPullRequestPayload } from "../../types.ts";
import { createActionRow, createButton } from "../discord/components.ts";
import {
  codeBlock,
  timestamp,
  userMention,
} from "../discord/textFormatting.ts";
import { getRandomItem } from "../random.ts";

export default async function onPullRequestOpen(
  props: WebhookPullRequestPayload,
  project: Project,
  bot: Bot,
) {
  const { pull_request } = props;
  const owner = pull_request.user;
  const theChosenOne = getRandomItem(project.users);
  const viewOnGithubRow = createActionRow([
    createButton({
      label: "Ver no GitHub",
      url: pull_request.html_url,
      style: ButtonStyles.Link,
    }),
  ]);

  const message = `**${owner.login}** criou um novo Pull Request.`;
  const seconds = Math.floor(
    new Date(pull_request.created_at).getTime() / 1000,
  );

  await sendMessage(bot, project.discord.channel_id, {
    content: message +
      (theChosenOne ? ` ${userMention(theChosenOne.discordId)}` : ""),
    embeds: [{
      title: pull_request.title,
      description: `${timestamp(seconds, "R")}\n\n${pull_request.body || ""}`,
      thumbnail: {
        url: pull_request.user.avatar_url,
      },
      url: pull_request.html_url,
      color: 0x02c563,
      fields: [
        {
          name: "Additions",
          value: codeBlock(`+ ${pull_request.additions ?? 0}`, "diff"),
          inline: false,
        },
        {
          name: "Deletions",
          value: codeBlock(`- ${pull_request.deletions ?? 0}`, "diff"),
          inline: false,
        },
        {
          name: "Changed files",
          value: codeBlock(
            `${pull_request.changed_files ?? 0}`,
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
