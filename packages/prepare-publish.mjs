import transformLinks from "transform-markdown-links";
import { copyFile, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

(async function prePublish() {
  const packageDirectory = process.cwd();
  const sourceReadme = join(packageDirectory, "./docs/README.md");
  const targetReadme = join(packageDirectory, "README.md");
  await copyFile(sourceReadme, targetReadme);
  const sourceLicense = join(packageDirectory, "../../LICENSE");
  const targetLicense = join(packageDirectory, "LICENSE");
  await copyFile(sourceLicense, targetLicense);
  const readmeContent = await readFile(targetReadme, "utf8");

  const transformedContent = transformLinks(readmeContent, (link) => {
    if (link.startsWith("../")) {
      return link.replace(/^\.\.\//, "");
    }
  });

  await writeFile(targetReadme, transformedContent, "utf8");
})();
