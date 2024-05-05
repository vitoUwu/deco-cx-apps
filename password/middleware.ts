import { redirect } from "deco/mod.ts";
import { getCookies } from "std/http/cookie.ts";
import { AppMiddlewareContext } from "./mod.ts";

export const middleware = (
  _props: unknown,
  req: Request,
  ctx: AppMiddlewareContext,
) => {
  console.log("middleware", req.url);
  const url = new URL(req.url);

  if (req.method !== "GET" || url.pathname !== "/_deco/login") {
    return ctx.next!();
  }

  const cookies = getCookies(req.headers);

  if (!cookies["password"]) {
    redirect("/_deco/login", 403);
  }

  return ctx.next!();
};
