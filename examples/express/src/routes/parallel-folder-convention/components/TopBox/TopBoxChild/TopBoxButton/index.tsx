import type { JSX } from "react";
import useAddAnimal from "./useAddAnimal";
import Animal from "@/components/Animal";
import styles from "./index.module.css";

const TopBoxButton = (): JSX.Element => (
  <button className={styles.button} onClick={useAddAnimal()}>
    <Animal />
  </button>
);

export default TopBoxButton;
