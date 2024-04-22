import type {
  ProductDetailsPage,
  ProductGroup,
  ProductListingPage,
} from "../../../commerce/types.ts";
import type { AppContext } from "../../mod.ts";
import { getDeviceIdFromBag } from "../../utils/deviceId.ts";
import getSource from "../../utils/source.ts";
import { toProduct } from "../../utils/transform.ts";
import type {
  PageName,
  Position,
  RecommendationShelf,
} from "../../utils/types/chaordic.ts";

interface BaseProps {
  /**
   * @hide
   */
  page: PageName;
  showOnlyAvailable?: boolean;
}

/**
 * @title Home Page
 */
interface HomePageProps extends BaseProps {
  /**
   * @hide
   */
  page: "home";
}

/**
 * @title Product Page
 */
interface ProductPageProps extends BaseProps {
  /**
   * @hide
   */
  page: "product";
  /**
   * @description It is recommended to create a global loader so that the loader is not called more than once
   */
  loader: ProductDetailsPage | null;
  /**
   * @ignore
   */
  productId?: string;
}

/**
 * @title Category Page
 */
interface CategoryPageProps extends BaseProps {
  /**
   * @hide
   */
  page: "category";
  /**
   * @description It is recommended to create a global loader so that the loader is not called more than once
   */
  loader: ProductListingPage | null;
  /**
   * @ignore
   */
  categoryIds?: string[];
}

/**
 * @title Search Page
 */
interface SearchPageProps extends BaseProps {
  /**
   * @hide
   */
  page: "search";
  /**
   * @description It is recommended to create a global loader so that the loader is not called more than once
   */
  loader: ProductListingPage | null;
  /**
   * @ignore
   */
  productIds?: string[];
}

const nonNullable = <T>(value: T): value is NonNullable<T> =>
  value != null && typeof value !== "undefined";
const normalize = (value: string) =>
  value.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

interface Props {
  props:
    | HomePageProps
    | ProductPageProps
    | CategoryPageProps
    | SearchPageProps;
}

const generateParams = (
  props: Props["props"],
  req: Request,
): { name: PageName } & Record<string, unknown> => {
  switch (props.page) {
    case "home": {
      return {
        name: "home",
      };
    }
    case "category": {
      if (props.categoryIds?.length) {
        return {
          name: "category",
          "categoryId[]": props.categoryIds,
        };
      }

      const properties = props.loader?.products
        .flatMap((p) => p?.additionalProperty)
        .filter(nonNullable) ?? [];
      const categoriesId = new URL(req.url).pathname
        .toLowerCase()
        .slice(1)
        .split("/")
        .map((category) =>
          properties
            .find((p) =>
              p.name === "category" &&
              p.value &&
              p.propertyID &&
              normalize(p.value!) === category
            )
            ?.propertyID
        )
        .filter(nonNullable) ?? [];

      return {
        name: categoriesId.length > 1 ? "subcategory" : "category",
        "categoryId[]": categoriesId,
      };
    }
    case "search": {
      const productIds = props.productIds ?? props.loader?.products
        .map((p) => p.productID)
        .filter(nonNullable) ??
        [];
      return {
        name: "search",
        "productId[]": productIds,
      };
    }
    case "product": {
      const productId = props.productId ?? props.loader?.product.productID;
      return {
        name: "product",
        "productId[]": productId ? [productId] : [],
      };
    }
    default: {
      return {
        name: "other",
      };
    }
  }
};

function toProductGroup(
  shelf: RecommendationShelf,
  position: Position,
  origin: string,
  cdn: string,
): ProductGroup {
  return {
    "@type": "ProductGroup" as const,
    productGroupID: shelf.id,
    identifier: shelf.feature,
    additionalType: position,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "trackingImpression",
        value: new URL(shelf.impressionUrl).searchParams.get(
          "trackingImpression",
        ) ?? "",
      },
    ],
    hasVariant: shelf.displays[0].recommendations.map(
      (p) => toProduct(p, origin, cdn),
    ),
  };
}

/**
 * @title Linx Impulse - Shelves Loader
 */
const loader = async (
  { props }: Props,
  req: Request,
  ctx: AppContext,
): Promise<ProductGroup[] | null> => {
  if (req.url.includes("_frsh")) {
    return null;
  }

  const { showOnlyAvailable } = props;
  const { chaordicApi, apiKey, salesChannel, origin, cdn } = ctx;
  const deviceId = getDeviceIdFromBag(ctx);
  const source = getSource(ctx);

  const params = generateParams(props, req);
  const headers = new Headers();
  if (origin) {
    headers.set("Origin", origin);
  }

  const { top, middle, bottom } = await chaordicApi
    ["GET /v0/pages/recommendations"]({
      ...params,
      apiKey,
      deviceId,
      source,
      salesChannel,
      showOnlyAvailable,
      productFormat: "complete",
    }, { headers }).then((res) => res.json());

  return [
    ...top.map((shelf) =>
      toProductGroup(shelf, "top", new URL(req.url).origin, cdn)
    ),
    ...middle.map((shelf) =>
      toProductGroup(shelf, "middle", new URL(req.url).origin, cdn)
    ),
    ...bottom.map((shelf) =>
      toProductGroup(shelf, "bottom", new URL(req.url).origin, cdn)
    ),
  ];
};

export default loader;
