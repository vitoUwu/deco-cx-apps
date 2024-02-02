import type { Person, ProductListingPage } from "../../../commerce/types.ts";
import type { AppContext } from "../../mod.ts";
import getDeviceId from "../../utils/deviceId.ts";
import { sortOptions, toProductListingPage } from "../../utils/transform.ts";
import type { SortBy } from "../../utils/types/linx.ts";

export interface Props {
  /**
   * @description overides the query term
   */
  terms?: string;
  /**
   * @title Items per page
   * @description number of products per page to display
   */
  resultsPerPage: number;

  /**
   * @title Sorting
   */
  sort?: SortBy;

  /**
   * @title Hide Unavailable Items
   * @description Do not return out of stock items
   */
  showOnlyAvailable?: boolean;

  /**
   * @title Allow Results Redirect
   * @description Allows the redirect of queries. If false, the API will return results for the term sought even if there is registration of redirects on the dashboard for this term.
   */
  allowRedirect?: boolean;

  /**
   * @title User
   * @description Used to sync user data with linx impulse
   */
  user: Person | null;

  /**
   * @ignore
   */
  page?: number;
  /**
   * @ignore
   */
  multicategories?: string[];
  /**
   * @ignore
   */
  categories?: string[];
}

const getSortFromQuery = (query: string): SortBy | undefined => {
  switch (query) {
    case "relevance":
    case "pid":
    case "ascPrice":
    case "descPrice":
    case "descDate":
    case "ascSold":
    case "descSold":
    case "ascReview":
    case "descReview":
    case "descDiscount":
      return query;
    default:
      return undefined;
  }
};

/**
 * @title Linx Impulse - Search
 * @description Product Listing Page loader
 */
const loader = async (
  props: Props,
  req: Request,
  ctx: AppContext,
): Promise<ProductListingPage | null> => {
  const { resultsPerPage, allowRedirect, showOnlyAvailable, user } = props;
  const { apiKey, secretKey, salesChannel, api, device } = ctx;
  const deviceId = getDeviceId(req, ctx);
  const url = new URL(req.url);

  const category = props.categories && props.categories.length > 0
    ? props.categories
    : url.pathname.split("/").filter((x) => x);
  const multicategory =
    props.multicategories && props.multicategories.length > 0
      ? props.multicategories
      : url.searchParams.getAll("multicategory");
  const searchTerm = props.terms || url.searchParams.get("q");

  const page = props.page ||
    Number.parseInt(url.searchParams.get("page") || "1");
  const sortBy = getSortFromQuery(url.searchParams.get("sort") ?? "") ||
    props.sort;
  const fields = url.searchParams.getAll("fields");
  const filter = url.searchParams.getAll("filter");
  const source = device === "desktop" ? "desktop" : "mobile";

  try {
    if (!searchTerm && category.length >= 2 && category[0] === "hotsite") {
      const response = await api["GET /engage/search/v3/hotsites"]({
        apiKey,
        secretKey,
        salesChannel,
        deviceId,
        showOnlyAvailable,
        resultsPerPage,
        page,
        sortBy,
        filter,
        source,
        userId: user?.["@id"],
        productFormat: "complete",
        name: category[1],
      }).then((res) => res.json());

      return toProductListingPage(response, page, resultsPerPage, req.url);
    } else if (
      !searchTerm && (category.length > 0 || multicategory.length > 0)
    ) {
      const response = await api["GET /engage/search/v3/navigates"]({
        apiKey,
        secretKey,
        salesChannel,
        deviceId,
        allowRedirect,
        showOnlyAvailable,
        resultsPerPage,
        page,
        sortBy,
        fields,
        filter,
        source,
        userId: user?.["@id"],
        productFormat: "complete",
        ...(multicategory.length > 0 ? { multicategory } : { category }),
      }).then((res) => res.json());

      return toProductListingPage(response, page, resultsPerPage, req.url);
    } else if (searchTerm) {
      const response = await api["GET /engage/search/v3/search"]({
        apiKey,
        secretKey,
        salesChannel,
        deviceId,
        allowRedirect,
        showOnlyAvailable,
        resultsPerPage,
        page,
        sortBy,
        filter,
        source,
        terms: searchTerm,
        userId: user?.["@id"],
        productFormat: "complete",
      }).then((res) => res.json());

      return toProductListingPage(response, page, resultsPerPage, req.url);
    }
  } catch (err) {
    console.error(err);
  }

  return {
    "@type": "ProductListingPage",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [],
      numberOfItems: 0,
    },
    filters: [],
    products: [],
    pageInfo: {
      nextPage: undefined,
      previousPage: undefined,
      currentPage: page,
      records: 0,
      recordPerPage: 0,
    },
    sortOptions,
  };
};

export default loader;
