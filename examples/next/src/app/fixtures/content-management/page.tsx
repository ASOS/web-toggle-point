"use client";

import type { JSX } from "react";
import ReadMe from "./README.mdx";
import useContentEditable from "./useContentEditable";

const Page = (): JSX.Element => {
  useContentEditable();
  return <ReadMe />;
};

export default Page;
