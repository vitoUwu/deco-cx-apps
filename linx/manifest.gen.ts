// DO NOT EDIT. This file is generated by deco.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $$$0 from "./loaders/path.ts";
import * as $$$1 from "./loaders/pages.ts";
import * as $$$2 from "./loaders/product/listingPage.ts";
import * as $$$3 from "./loaders/product/detailsPage.ts";
import * as $$$4 from "./loaders/product/list.ts";
import * as $$$5 from "./loaders/product/suggestions.ts";
import * as $$$6 from "./loaders/page.ts";
import * as $$$7 from "./loaders/cart.ts";
import * as $$$$$$$$$0 from "./actions/cart/updateItem.ts";
import * as $$$$$$$$$1 from "./actions/cart/addCoupon.ts";
import * as $$$$$$$$$2 from "./actions/cart/addItem.ts";

const manifest = {
  "loaders": {
    "linx/loaders/cart.ts": $$$7,
    "linx/loaders/page.ts": $$$6,
    "linx/loaders/pages.ts": $$$1,
    "linx/loaders/path.ts": $$$0,
    "linx/loaders/product/detailsPage.ts": $$$3,
    "linx/loaders/product/list.ts": $$$4,
    "linx/loaders/product/listingPage.ts": $$$2,
    "linx/loaders/product/suggestions.ts": $$$5,
  },
  "actions": {
    "linx/actions/cart/addCoupon.ts": $$$$$$$$$1,
    "linx/actions/cart/addItem.ts": $$$$$$$$$2,
    "linx/actions/cart/updateItem.ts": $$$$$$$$$0,
  },
  "name": "linx",
  "baseUrl": import.meta.url,
};

export type Manifest = typeof manifest;

export default manifest;
