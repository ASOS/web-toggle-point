import { resolve, basename, dirname, posix } from "path";
import { fileURLToPath } from "url";
import externals from "webpack-node-externals";
import { TogglePointInjectionPlugin } from "@asos/web-toggle-point-webpack/plugins";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import staticLoadStrategyFactory from "@asos/web-toggle-point-webpack/moduleLoadStrategyFactories/staticLoadStrategyFactory";
import lazyComponentLoadStrategyFactory from "@asos/web-toggle-point-react-pointcuts/lazyComponentLoadStrategyFactory";

const configPointCutConfig = {
  name: "configuration variants",
  variantGlobs: ["./src/routes/config/__variants__/*/*/*.jsx"],
  togglePointModuleSpecifier: "/src/routes/config/togglePoint.js",
  loadStrategy: lazyComponentLoadStrategyFactory(),
};

const common = {
  mode: "production",
  devtool: "source-map",
  experiments: {
    outputModule: true,
  },
  output: {
    module: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
};

const config = [
  {
    entry: "./src/index.js",
    target: "node",
    ...common,
    output: {
      ...common.output,
      path: resolve(dirname(fileURLToPath(import.meta.url)), "bin"),
      filename: "server.mjs",
      clean: true,
    },
    externals: [externals({ importType: "module" })],
    plugins: [
      ...common.plugins,
      new TogglePointInjectionPlugin({
        pointCuts: [
          configPointCutConfig,
          {
            name: "animal apis by version",
            variantGlobs: [
              "./src/routes/animals/api/**/v{1..9}*([[:digit:]])/*.js",
            ],
            joinPointResolver: (variantPath) =>
              posix.resolve(
                variantPath,
                ...Array(3).fill(".."),
                basename(variantPath)
              ),
            togglePointModuleSpecifier: "/src/routes/animals/togglePoint.js",
            loadStrategy: staticLoadStrategyFactory(),
          },
        ],
      }),
    ],
  },
  {
    entry: "./src/routes/config/client.js",
    target: "web",
    ...common,
    output: {
      ...common.output,
      path: resolve(dirname(fileURLToPath(import.meta.url)), "public"),
      filename: "main.mjs",
    },
    plugins: [
      ...common.plugins,
      new TogglePointInjectionPlugin({ pointCuts: [configPointCutConfig] }),
    ],
    module: {
      ...common.module,
      rules: [
        {
          test: /\.js$/,
          enforce: "pre",
          use: ["source-map-loader"],
        },
        ...common.module.rules,
      ],
    },
  },
];

export default config;
