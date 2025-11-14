import animalsSlice from "./animals/slice";

const getReducerMap = () => ({
  animals: animalsSlice.reducer
});

export default getReducerMap;
