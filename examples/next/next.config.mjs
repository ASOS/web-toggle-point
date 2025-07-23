import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import { TogglePointInjectionPlugin } from "@asos/web-toggle-point-webpack/plugins";
import experimentPointCutConfig from "./src/app/fixtures/experiments/__pointCutConfig.js";
import contentManagementPointCutConfig from "./src/app/fixtures/content-management/__pointCutConfig.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "md", "mdx", "ts", "tsx"],
};

const webpackNormalModule = async () =>
  (await import("next/dist/compiled/webpack/NormalModule.js")).default;

const togglePointInjection = new TogglePointInjectionPlugin({
  pointCuts: [...experimentPointCutConfig, ...contentManagementPointCutConfig],
  webpackNormalModule,
});

nextConfig.webpack = (config) => {
  return {
    ...config,
    plugins: [...config.plugins, togglePointInjection],
    resolve: {
      ...(config.resolve ?? {}),
      alias: {
        ...(config.resolve.alias ?? {}),
        "react-is": "next/dist/compiled/react-is/cjs/react-is.production.js",
      },
    },
  };
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
  },
});

export default withMDX(nextConfig);
