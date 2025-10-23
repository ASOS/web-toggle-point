import { createSlice } from "@reduxjs/toolkit";

const spaceSlice = createSlice({
  name: "space",
  initialState: ["🌎", "🪐", "☄️", "🛸"],
  reducers: {
    add(state, action) {
      state.push(action.payload);
    }
  },
  selectors: {
    getSpaceStuff: (state) => state
  }
});

export default spaceSlice;
