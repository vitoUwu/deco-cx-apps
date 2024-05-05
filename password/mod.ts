import type {
  App,
  AppContext as AC,
  AppMiddlewareContext as AMC,
} from "deco/mod.ts";
import { Secret } from "../website/loaders/secret.ts";
import manifest, { Manifest } from "./manifest.gen.ts";
import { middleware } from "./middleware.ts";

export interface State {
  password: Secret;
}

/**
 * @title password
 */
export default function App(
  state: State,
): App<Manifest, State> {
  return { manifest, state, middleware };
}

export type AppContext = AC<ReturnType<typeof App>>;
export type AppMiddlewareContext = AMC<App>;
