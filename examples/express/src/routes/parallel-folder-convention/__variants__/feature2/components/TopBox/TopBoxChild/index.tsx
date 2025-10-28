import type { JSX } from "react";
import Control2 from "@/component-library/control2";
import useFreeAnimals from "./useFreeAnimals";
import TopBoxButton from "@/components/TopBox/TopBoxChild/TopBoxButton";
import styles from "@/components/TopBox/TopBoxChild/TopBoxButton/index.module.css";
import constants from "../../../constants/index";

const TopBoxChild = (): JSX.Element => (
  <Control2>
    <TopBoxButton />
    <button className={styles.button} onClick={useFreeAnimals()}>
      {constants.FREEDOM}
    </button>
  </Control2>
);

export default TopBoxChild;
