import transformLinks from "transform-markdown-links";
import { copyFile, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const encoding = "utf8";

(async function prePublish() {
  const packageDirectory = process.cwd();

  const sourceLicense = join(packageDirectory, "../../LICENSE");
  const targetLicense = join(packageDirectory, "LICENSE");
  await copyFile(sourceLicense, targetLicense);

  const sourceReadme = join(packageDirectory, "./docs/README.md");
  const targetReadme = join(packageDirectory, "README.md");
  const readmeContent = await readFile(sourceReadme, encoding);
  const transformedContent = transformLinks(readmeContent, (link) => {
    if (link.startsWith("../")) {
      return link.replace(/^\.\.\//, "");
    }
  });
  await writeFile(targetReadme, transformedContent, encoding);
})();
