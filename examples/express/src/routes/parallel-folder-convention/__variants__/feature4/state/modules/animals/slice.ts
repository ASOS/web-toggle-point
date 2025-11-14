import { createSelector } from "@reduxjs/toolkit";
import originalSlice from "@/state/modules/animals/slice";
import constants from "@/constants/index";

const getAllAnimalsAsCrabs = createSelector(
  [originalSlice.selectors.getAnimals],
  (animals) => Array(animals.length).fill(constants.ANIMAL)
);

export default {
  ...originalSlice,
  selectors: {
    ...originalSlice.selectors,
    getAnimals: getAllAnimalsAsCrabs
  }
};
