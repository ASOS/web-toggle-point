import type { JSX } from "react";
import Variant1 from "@/component-library/variant1";
import TopBoxChild from "@/components/TopBox/TopBoxChild";

const TopBox = (): JSX.Element => (
  <Variant1>
    <TopBoxChild />
  </Variant1>
);

export default TopBox;
