import type { JSX } from "react";
import Control2 from "@/component-library/control2";
import AnimalPen from "@/component-library/AnimalPen";
import useAnimals from "./useAnimals";

const BottomBox = ({ BoxControl = Control2 }): JSX.Element => {
  const animals = useAnimals();
  return (
    <BoxControl>
      <AnimalPen animals={animals} />
    </BoxControl>
  );
};

export default BottomBox;
