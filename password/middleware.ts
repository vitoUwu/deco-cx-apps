import { getCookies } from "std/http/cookie.ts";
import { AppMiddlewareContext } from "./mod.ts";

const IGNORE_HOST = [
  "localhost",
  "admin.deco.cx",
];

// deno-lint-ignore require-await
export const middleware = async (
  _props: unknown,
  req: Request,
  ctx: AppMiddlewareContext,
) => {
  console.log("middleware", req.url);
  const url = new URL(req.url);

  if (
    req.method !== "GET" || url.pathname !== "/_deco/login" ||
    IGNORE_HOST.includes(url.hostname)
  ) {
    return ctx.next!();
  }

  const cookies = getCookies(req.headers);

  if (!cookies["password"]) {
    return new Response(null, {
      status: 301,
      headers: { location: "/_deco/login" },
    });
  }

  return ctx.next!();
};
