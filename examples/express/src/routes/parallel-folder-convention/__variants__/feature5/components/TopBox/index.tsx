import type { JSX } from "react";
import Variant2 from "@/component-library/variant2";
import useSpaceStuff from "./useSpaceStuff";
import styles from "./styles.module.css";

const BottomBox = (): JSX.Element => {
  const planets = useSpaceStuff() as string[];
  return (
    <Variant2>
      <div className={styles.space}>
        {planets.map((planet) => (
          <span key={planet}>{planet}</span>
        ))}
      </div>
    </Variant2>
  );
};

export default BottomBox;
