import { STATUS_CODE } from "$fresh/server.ts";
import {
  upsertGlobalApplicationCommands,
} from "https://deno.land/x/discordeno@18.0.1/mod.ts";
import type { AppContext } from "../mod.ts";
import type { Command } from "../types.ts";

import viewOpenPullRequests from "../sdk/discord/commands/viewOpenPullRequests.ts";

export const COMMANDS: Map<string, Command> = new Map([
  [viewOpenPullRequests.data.name, viewOpenPullRequests],
]);

export default async function action(
  _props: unknown,
  _req: unknown,
  ctx: AppContext,
) {
  if (!ctx.active) {
    return new Response(null, { status: STATUS_CODE.ServiceUnavailable });
  }

  try {
    await upsertGlobalApplicationCommands(
      ctx.discord.bot,
      [...COMMANDS.values()].map((command) => command.data),
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err.message,
      }),
      {
        status: 500,
      },
    );
  }

  return new Response(null, { status: 204 });
}
