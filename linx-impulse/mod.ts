import type { App, AppContext as AC } from "deco/mod.ts";
import { createHttpClient } from "../utils/http.ts";
import manifest, { Manifest } from "./manifest.gen.ts";
import { EventsAPI } from "./utils/events.ts";
import { LinxAPI } from "./utils/client.ts";
import { ChaordicAPI } from "./utils/chaordic.ts";

export type AppContext = AC<ReturnType<typeof App>>;

/** @title LINX Impulse */
export interface State {
  /**
   * @title LINX Api Key
   */
  apiKey: string;
  /**
   * @title LINX Secret Key
   */
  secretKey: string;
  salesChannel?: string;
}

export const color = 0xFF6A3B;

/**
 * @title LINX
 */
export default function App(props: State) {
  const eventsApi = createHttpClient<EventsAPI>({
    base: "https://api.event.linximpulse.net/",
    headers: new Headers({
      "Accept": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
    }),
  });

  const api = createHttpClient<LinxAPI>({
    base: "http://api.linximpulse.com/",
    headers: new Headers({ "Accept": "application/json" }),
  });

  const chaordicApi = createHttpClient<ChaordicAPI>({
    base: "https://recs.chaordicsystems.com/",
    headers: new Headers({ "Accept": "application/json" }),
  });

  const state = { ...props, eventsApi, api, chaordicApi };

  const app: App<Manifest, typeof state> = { manifest, state };

  return app;
}
