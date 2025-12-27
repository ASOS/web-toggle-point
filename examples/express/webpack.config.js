import { resolve, basename, dirname, posix } from "path";
import { fileURLToPath } from "url";
import externals from "webpack-node-externals";
import { TogglePointInjectionPlugin } from "@asos/web-toggle-point-webpack/plugins";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import staticLoadStrategyFactory from "@asos/web-toggle-point-webpack/moduleLoadStrategyFactories/staticLoadStrategyFactory";
import lazyComponentLoadStrategyFactory from "@asos/web-toggle-point-react-pointcuts/lazyComponentLoadStrategyFactory";
import parallelFolderConventionPointCutConfig from "./src/routes/parallel-folder-convention/toggle-plumbing/pointCutConfig.js";
import { EnhancedTsconfigWebpackPlugin } from "enhanced-tsconfig-paths-webpack-plugin";
import webpack from "webpack";

const publicPath = resolve(dirname(fileURLToPath(import.meta.url)), "public");

const configPointCutConfig = {
  name: "configuration variants",
  variantGlobs: ["./src/routes/config/__variants__/*/*/*.jsx"],
  togglePointModuleSpecifier: "/src/routes/config/togglePoint.js",
  loadStrategy: lazyComponentLoadStrategyFactory()
};

const common = {
  mode: "development",
  devtool: "source-map",
  experiments: {
    outputModule: true
  },
  output: {
    module: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                namedExport: false
              }
            }
          }
        ]
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    plugins: [
      new EnhancedTsconfigWebpackPlugin({
        tsconfigPaths: {
          extensions: [".ts", ".tsx", ".css"]
        }
      })
    ]
  }
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
      clean: true
    },
    externals: [externals({ importType: "module" })],
    plugins: [
      new webpack.DefinePlugin({
        CLIENT: false
      }),
      new MiniCssExtractPlugin(),
      new TogglePointInjectionPlugin({
        pointCuts: [
          configPointCutConfig,
          ...parallelFolderConventionPointCutConfig,
          {
            name: "animal apis by version",
            variantGlobs: [
              "./src/routes/animals/api/**/v{1..9}*([[:digit:]])/*.js"
            ],
            joinPointResolver: (variantPath) =>
              posix.resolve(
                variantPath,
                ...Array(3).fill(".."),
                basename(variantPath)
              ),
            togglePointModuleSpecifier: "/src/routes/animals/togglePoint.js",
            loadStrategy: staticLoadStrategyFactory()
          }
        ]
      })
    ]
  },
  {
    entry: "./src/routes/config/client.js",
    target: "web",
    ...common,
    output: {
      ...common.output,
      path: publicPath,
      filename: "main.mjs",
      clean: true
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new TogglePointInjectionPlugin({ pointCuts: [configPointCutConfig] })
    ],
    module: {
      ...common.module,
      rules: [
        {
          test: /\.js$/,
          enforce: "pre",
          use: ["source-map-loader"]
        },
        ...common.module.rules
      ]
    }
  },
  {
    entry: "./src/routes/parallel-folder-convention/client.js",
    target: "web",
    ...common,
    output: {
      path: publicPath,
      filename: "parallel-folder-convention.js"
    },
    plugins: [
      new webpack.DefinePlugin({
        CLIENT: true
      }),
      new MiniCssExtractPlugin({
        filename: "parallel-folder-convention.css"
      }),
      new TogglePointInjectionPlugin({
        pointCuts: parallelFolderConventionPointCutConfig
      })
    ]
  }
];

export default config;
