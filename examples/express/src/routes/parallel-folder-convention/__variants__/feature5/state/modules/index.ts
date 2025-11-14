import animalsSlice from "@/state/modules/animals/slice";
import spaceSlice from "./space/slice";

const getReducerMap = () => ({
  animals: animalsSlice.reducer,
  space: spaceSlice.reducer
});

export default getReducerMap;
