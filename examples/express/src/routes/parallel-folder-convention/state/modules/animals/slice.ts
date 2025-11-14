import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import constants from "../../../constants";

type Animals = typeof constants.ANIMAL;

interface AnimalsState extends Array<Animals> {}

const initialState = [] satisfies AnimalsState as AnimalsState;

const animalsSlice = createSlice({
  name: "animals",
  initialState,
  reducers: {
    add(state, action: PayloadAction<Animals>) {
      state.push(action.payload);
    }
  },
  selectors: {
    getAnimals: (state: AnimalsState) => state
  }
});

export default animalsSlice;
