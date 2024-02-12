const app = (name: string) => ({ dir: name, name });

const compatibilityApps = [{
  dir: "./compat/$live",
  name: "$live",
}, {
  dir: "./compat/std",
  name: "deco-sites/std",
}];

const paltformApps = [{
  dir: "./platforms/kubernetes",
  name: "kubernetes",
}, {
  dir: "./platforms/subhosting",
  name: "deno-subhosting",
}];

const config = {
  apps: [
    app("linx-impulse"),
    app("ai-assistants"),
    app("files"),
    app("openai"),
    app("brand-assistant"),
    app("implementation"),
    app("weather"),
    {
      dir: "admin",
      name: "deco-sites/admin",
    },
    app("analytics"),
    app("sourei"),
    app("typesense"),
    app("algolia"),
    app("vtex"),
    app("vnda"),
    app("wake"),
    app("linx"),
    app("shopify"),
    app("nuvemshop"),
    app("website"),
    app("commerce"),
    app("workflows"),
    app("verified-reviews"),
    app("power-reviews"),
    app("crux"),
    app("decohub"),
    ...compatibilityApps,
    ...paltformApps,
  ],
};

export default config;
