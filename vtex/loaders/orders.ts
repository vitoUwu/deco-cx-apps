import { AppContext } from "../mod.ts";

interface Props {
  /**
   * @description Customer email.
   */
  clientEmail: string;
  /**
   * @description Page number for result pagination.
   */
  page?: number;
  /**
   * @description Page quantity for result pagination.
   */
  per_page?: number;
}

export default async function loader(
  props: Props,
  _req: Request,
  ctx: AppContext,
) {
  const { clientEmail, page = 1, per_page = 15 } = props;
  const { vcs } = ctx;

  return await vcs["GET /api/oms/user/orders"]({
    clientEmail,
    page: `${page}`,
    per_page: `${per_page}`,
  }).then((res) => res.json());
}
