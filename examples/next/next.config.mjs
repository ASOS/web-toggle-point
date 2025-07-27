import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import { TogglePointInjection } from "@asos/web-toggle-point-webpack/plugins";
import experimentPointCutConfig from "./src/app/fixtures/experiments/__pointCutConfig.js";
import contentManagementPointCutConfig from "./src/app/fixtures/content-management/__pointCutConfig.js";
import webpackNormalModule from "next/dist/compiled/webpack/NormalModule.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "md", "mdx", "ts", "tsx"]
};

const togglePointInjection = new TogglePointInjection({
  pointCuts: [...experimentPointCutConfig, ...contentManagementPointCutConfig],
  webpackNormalModule
});

nextConfig.webpack = (config) => {
  return {
    ...config,
    plugins: [...config.plugins, togglePointInjection]
  };
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm]
  }
});

export default withMDX(nextConfig);
