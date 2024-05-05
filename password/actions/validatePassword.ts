import { setCookie } from "deco/deps.ts";
import { encryptToHex } from "../../website/utils/crypto.ts";
import { AppContext } from "../mod.ts";

interface Props {
  password: string;
}

export default async function validatePassword(
  props: Props,
  _req: Request,
  ctx: AppContext,
) {
  const { password } = props;
  const { password: originalPassword } = ctx;

  if (password !== originalPassword.get()) {
    return {
      valid: false as const,
      error: "Invalid password",
    };
  }

  setCookie(ctx.response.headers, {
    value: await encryptToHex(password),
    name: "password",
    path: "/",
    secure: true,
    httpOnly: true,
  });

  return {
    valid: true as const,
    error: null,
  };
}
