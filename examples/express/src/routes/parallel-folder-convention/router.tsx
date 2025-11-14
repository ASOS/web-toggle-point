import { Router, static as assetsFolder } from "express";
import { renderToPipeableStream } from "react-dom/server";
import { getFeaturesScript } from "./toggle-plumbing/serialization";
import { setValue } from "./toggle-plumbing/featuresStore";
import App from "./App";

const router = new Router();
router.use(assetsFolder("public"));
router.use("/*", (request, _, scopeCallBack) => {
  setValue({
    value: { selection: request.headers.feature ?? "baseline" },
    scopeCallBack
  });
});
router.get("/*", (_, res) => {
  const { pipe } = renderToPipeableStream(
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Didact+Gothic&display=swap"
          rel="stylesheet"
        />
        <link href="parallel-folder-convention.css" rel="stylesheet" />
        {getFeaturesScript()}
      </head>
      <body>
        <div>
          <App />
        </div>
      </body>
    </html>,
    {
      bootstrapScripts: [
        "/parallel-folder-convention/parallel-folder-convention.js"
      ],
      onShellReady() {
        res.statusCode = 200;
        res.setHeader("Content-type", "text/html");
        pipe(res);
      },
      onShellError() {
        res.statusCode = 500;
        res.send("<!doctype html><p>Loading...</p>");
      }
    }
  );
});

export default router;
