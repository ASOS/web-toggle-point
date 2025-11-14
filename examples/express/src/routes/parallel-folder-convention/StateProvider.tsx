import { Provider } from "react-redux";
import { combineReducers } from "@reduxjs/toolkit";
import createStore from "@/state/store";
import { getFeatures } from "./toggle-plumbing/featuresStore";
import getReducerMap from "@/state/modules";
import { subscribe } from "valtio";

const StateProvider = ({ children }) => {
  const store = createStore();

  if (CLIENT) {
    subscribe(getFeatures(), () => {
      store.replaceReducer(combineReducers(getReducerMap()));
    });
  }

  return <Provider store={store}>{children}</Provider>;
};

export default StateProvider;
