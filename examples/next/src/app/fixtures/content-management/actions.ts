"use server";
import { writeFile, readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const markdownPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "README.mdx"
);

export async function readMarkdown() {
  return (await readFile(markdownPath)).toString();
}

export async function saveMarkdown(stuff: string) {
  await writeFile(markdownPath, stuff);
}
