import joinPointResolver from "../../joinPointResolver.js";

export default {
  name: "translation",
  togglePointModule: "/src/fixtures/translation/__togglePoint.js",
  variantGlobs: ["./src/fixtures/translation/languages/*/*.json"],
  joinPointResolver
};
