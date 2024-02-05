import { AppContext } from "../../mod.ts";
import getDeviceId from "../../utils/deviceId.ts";
import {
  LinxCartItem,
  LinxUser,
  SearchItem,
} from "../../utils/types/analytics.ts";
import { Source } from "../../utils/types/linx.ts";

type CategoryParams = {
  page: "category";
  categories: string[];
  tags?: string[];
};

type ProductParams = {
  page: "product";
  pid: string;
  sku?: string;
  price?: number;
};

type CartParams = {
  page: "cart";
  id: string;
  items: LinxCartItem[];
};

type TransactionParams = {
  page: "transaction";
  id: string;
  items: LinxCartItem[];
  total: number;
};

type SearchParams = {
  page: "search";
  query: string;
  items: SearchItem[];
  searchId?: string;
};

type OtherParams = {
  page:
    | "home"
    | "other"
    | "checkout"
    | "landingpage"
    | "notfound"
    | "hotsite"
    | "userprofile";
};

interface ViewEvent {
  event: "view";
  params:
    & (
      | CategoryParams
      | ProductParams
      | CartParams
      | TransactionParams
      | SearchParams
      | OtherParams
    )
    & {
      user?: LinxUser;
      source: Source;
    };
}

interface ClickEventParams {
  trackingId: string;
  source: Source;
  user?: LinxUser;
  interactionType?: "PRODUCT_VIEW" | "ADD_TO_CART";
}

interface ChaordicClickEventParams {
  trackingId: string;
  interactionType: "SHELF_CLICK";
}

interface ClickEvent {
  event: "click";
  params: ClickEventParams | ChaordicClickEventParams;
}

interface ImpressionEvent {
  event: "impression";
  params: {
    trackingImpression: string;
    /**
     * @description Contains the position of the first product shown in the visible area of the product shelf, with index from 0.
     */
    firstOffset: number;
    /**
     * @description Contains the position of the last product shown in the visible area of the product shelf
     */
    lastOffset: number;
  };
}

type Props = ViewEvent | ClickEvent | ImpressionEvent;

/**
 * @docs https://docs.linximpulse.com/api/events/getting-started
 */
const action = async (
  props: Props,
  req: Request,
  ctx: AppContext,
): Promise<null> => {
  const { event, params } = props;
  const { eventsApi, api, salesChannel, secretKey, apiKey, chaordicApi } = ctx;

  switch (event) {
    case "view": {
      const { page, source, user } = params;
      const commonBody = {
        apiKey,
        secretKey,
        source,
        user,
        salesChannel,
        deviceId: getDeviceId(req, ctx),
      };

      const headers = {
        "content-type": "application/json",
      };

      switch (page) {
        case "category": {
          const { categories, tags } = params;
          const path = categories.length === 1
            ? "POST /v7/events/views/category"
            : "POST /v7/events/views/subcategory";
          await eventsApi[path]({}, {
            body: {
              categories,
              tags,
              ...commonBody,
            },
            headers,
          });
          break;
        }
        case "product":
          await eventsApi["POST /v7/events/views/product"]({}, {
            body: {
              pid: params.pid,
              sku: params.sku,
              price: params.price,
              ...commonBody,
            },
            headers,
          });
          break;
        case "cart":
          await eventsApi["POST /v7/events/views/cart"]({}, {
            body: {
              id: params.id,
              items: params.items,
              ...commonBody,
            },
            headers,
          });
          break;
        case "transaction":
          await eventsApi["POST /v7/events/views/transaction"]({}, {
            body: {
              id: params.id,
              items: params.items,
              total: params.total,
              ...commonBody,
            },
            headers,
          });
          break;
        case "search": {
          const { items } = params;
          const path = items.length === 0
            ? "POST /v7/events/views/emptysearch"
            : "POST /v7/events/views/search";
          await eventsApi[path]({}, {
            body: {
              query: params.query,
              searchId: params.searchId,
              // @ts-ignore TODO: fix this
              items,
              ...commonBody,
            },
            headers,
          });
          break;
        }
        default: {
          await eventsApi["POST /v7/events/views/:name"](
            { name: page },
            {
              body: commonBody,
              headers,
            },
          );
        }
      }
      break;
    }
    case "click": {
      const { trackingId, interactionType } = params;

      // Chaordic event click
      if (interactionType === "SHELF_CLICK") {
        await chaordicApi["GET /v0/click"]({
          trackingClick: trackingId,
          deviceId: getDeviceId(req, ctx),
        });
        return null;
      }

      // Impulse event click
      const { source, user } = params;
      await api["GET /engage/search/v3/clicks"]({
        apiKey,
        secretKey,
        trackingId,
        source,
        userId: user?.id,
        interactionType,
        deviceId: getDeviceId(req, ctx),
      });
      break;
    }
    case "impression": {
      const { trackingImpression, firstOffset, lastOffset } = params;
      await chaordicApi["GET /v0/impression"]({
        trackingImpression,
        firstOffset,
        lastOffset,
        deviceId: getDeviceId(req, ctx),
      });
      break;
    }
  }

  return null;
};

export default action;