import { getCookies } from "std/http/cookie.ts";
import { AppMiddlewareContext } from "./mod.ts";

const IGNORE_HOST = [
  "localhost",
  "admin.deco.cx",
];

export const middleware = async (
  _props: unknown,
  req: Request,
  ctx: AppMiddlewareContext,
) => {
  console.log("middleware", req.url);
  const url = new URL(req.url);
  const response = await ctx.next!();

  if (
    req.method !== "GET" || url.pathname !== "/_deco/login" ||
    IGNORE_HOST.includes(url.hostname)
  ) {
    return response;
  }

  const cookies = getCookies(req.headers);

  if (!cookies["password"]) {
    console.log("redirecting to login");
    return new Response(null, {
      status: 307,
      headers: { location: "/_deco/login" },
    });
  }

  return response;
};
