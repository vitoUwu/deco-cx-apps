import { shortcircuit } from "deco/engine/errors.ts";
import { getCookies } from "std/http/cookie.ts";
import { decryptFromHex } from "../website/utils/crypto.ts";
import { AppMiddlewareContext } from "./mod.ts";

const IGNORE_HOST = [
  "localhost",
  // "admin.deco.cx",
];

export const middleware = async (
  _props: unknown,
  req: Request,
  ctx: AppMiddlewareContext,
) => {
  const { password: storePassword, locked } = ctx;
  const url = new URL(req.url);
  const response = await ctx.next!();

  // Ignore redirect in these cases
  if (
    locked === false || url.pathname.startsWith("/live") ||
    req.method !== "GET" ||
    url.pathname === "/_deco/login" ||
    IGNORE_HOST.includes(url.hostname)
  ) {
    return response;
  }

  const cookies = getCookies(req.headers);
  const passwordFromCookie = cookies["password"];
  const decryptedPassword = passwordFromCookie
    ? (await decryptFromHex(passwordFromCookie)).decrypted
    : null;

  if (!decryptedPassword || decryptedPassword !== storePassword.get()) {
    return shortcircuit(
      new Response(null, {
        status: 307,
        headers: { location: "/_deco/login" },
      }),
    );
  }

  return response;
};
