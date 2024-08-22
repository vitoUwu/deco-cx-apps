// DO NOT EDIT. This file is generated by deco.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $$$$$$$$$0 from "./actions/interaction.ts";
import * as $$$$$$$$$1 from "./actions/updateCommands.ts";
import * as $$$$$$$$$2 from "./actions/webhook.ts";
import * as $$$0 from "./loaders/projects.ts";
import * as $$$1 from "./loaders/user.ts";
import * as $$$$$$$$$$0 from "./workflows/waitForReviewer.ts";

const manifest = {
  "loaders": {
    "discord-bot/loaders/projects.ts": $$$0,
    "discord-bot/loaders/user.ts": $$$1,
  },
  "actions": {
    "discord-bot/actions/interaction.ts": $$$$$$$$$0,
    "discord-bot/actions/updateCommands.ts": $$$$$$$$$1,
    "discord-bot/actions/webhook.ts": $$$$$$$$$2,
  },
  "workflows": {
    "discord-bot/workflows/waitForReviewer.ts": $$$$$$$$$$0,
  },
  "name": "discord-bot",
  "baseUrl": import.meta.url,
};

export type Manifest = typeof manifest;

export default manifest;
