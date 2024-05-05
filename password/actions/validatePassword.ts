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

  const encryptedPassword = await encryptToHex(password);

  if (encryptedPassword !== originalPassword.get()) {
    return false;
  }

  setCookie(ctx.response.headers, {
    value: encryptedPassword,
    name: "password",
    path: "/",
    secure: true,
    httpOnly: true,
  });

  return true;
}
