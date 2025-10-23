import { configureStore } from "@reduxjs/toolkit";
import getReducerMap from "./modules/index";

const createStore = () => {
  const store = configureStore({
    reducer: getReducerMap()
  });
  return store;
};

export type AppStore = ReturnType<typeof createStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export default createStore;
