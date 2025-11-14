import { resolve, basename, dirname, posix } from "path";
import externals from "webpack-node-externals";
import { TogglePointInjection } from "@asos/web-toggle-point-webpack/plugins";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { fileURLToPath } from "url";
import parallelFolderConventionPointCutConfig from "./src/routes/parallel-folder-convention/toggle-plumbing/pointCutConfig.js";
import { EnhancedTsconfigWebpackPlugin } from "enhanced-tsconfig-paths-webpack-plugin";
import webpack from "webpack";

const configPointCutConfig = {
  name: "configuration variants",
  variantGlobs: ["./src/routes/config/__variants__/*/*/*.jsx"],
  togglePointModule: "/src/routes/config/togglePoint.js"
};

const common = {
  mode: "production",
  devtool: "source-map",
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
    output: {
      path: resolve(dirname(fileURLToPath(import.meta.url)), "bin"),
      filename: "server.cjs",
      clean: true,
      chunkFormat: "module"
    },
    externals: [externals()],
    ...common,
    plugins: [
      new webpack.DefinePlugin({
        CLIENT: false
      }),
      new MiniCssExtractPlugin(),
      new TogglePointInjection({
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
            togglePointModule: "/src/routes/animals/togglePoint.js"
          }
        ]
      })
    ]
  },
  {
    entry: "./src/routes/config/client.js",
    target: "web",
    output: {
      path: resolve(dirname(fileURLToPath(import.meta.url)), "public"),
      filename: "main.js"
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new TogglePointInjection({ pointCuts: [configPointCutConfig] })
    ],
    ...common
  },
  {
    entry: "./src/routes/parallel-folder-convention/client.js",
    target: "web",
    output: {
      path: resolve(dirname(fileURLToPath(import.meta.url)), "public"),
      filename: "parallel-folder-convention.js"
    },
    plugins: [
      new webpack.DefinePlugin({
        CLIENT: true
      }),
      new MiniCssExtractPlugin({
        filename: "parallel-folder-convention.css"
      }),
      new TogglePointInjection({
        pointCuts: parallelFolderConventionPointCutConfig
      })
    ],
    ...common
  }
];

export default config;
