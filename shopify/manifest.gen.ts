// DO NOT EDIT. This file is generated by deco.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $$$0 from "./loaders/ProductListingPage.ts";
import * as $$$1 from "./loaders/ProductDetailsPage.ts";
import * as $$$2 from "./loaders/RelatedProducts.ts";
import * as $$$3 from "./loaders/cart.ts";
import * as $$$4 from "./loaders/proxy.ts";
import * as $$$5 from "./loaders/ProductList.ts";
import * as $$$$0 from "./handlers/sitemap.ts";
import * as $$$$$$$$$0 from "./actions/order/draftOrderCalculate.ts";
import * as $$$$$$$$$1 from "./actions/cart/updateItems.ts";
import * as $$$$$$$$$2 from "./actions/cart/updateCoupons.ts";
import * as $$$$$$$$$3 from "./actions/cart/addItems.ts";

const manifest = {
  "loaders": {
    "shopify/loaders/cart.ts": $$$3,
    "shopify/loaders/ProductDetailsPage.ts": $$$1,
    "shopify/loaders/ProductList.ts": $$$5,
    "shopify/loaders/ProductListingPage.ts": $$$0,
    "shopify/loaders/proxy.ts": $$$4,
    "shopify/loaders/RelatedProducts.ts": $$$2,
  },
  "handlers": {
    "shopify/handlers/sitemap.ts": $$$$0,
  },
  "actions": {
    "shopify/actions/cart/addItems.ts": $$$$$$$$$3,
    "shopify/actions/cart/updateCoupons.ts": $$$$$$$$$2,
    "shopify/actions/cart/updateItems.ts": $$$$$$$$$1,
    "shopify/actions/order/draftOrderCalculate.ts": $$$$$$$$$0,
  },
  "name": "shopify",
  "baseUrl": import.meta.url,
};

export type Manifest = typeof manifest;

export default manifest;
