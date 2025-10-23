import originalSlice from "@/state/modules/animals/slice";
import { createSlice } from "@reduxjs/toolkit";

const animalsSlice = createSlice({
  initialState: originalSlice.getInitialState(),
  name: originalSlice.name,
  reducers: {
    add(state, action) {
      const count = state.filter((animal) => animal === action.payload).length;
      for (let i = 0; i < (count || 1); i++) {
        originalSlice.reducer(state, {
          ...action,
          payload: action.payload
        });
      }
    }
  },
  selectors: originalSlice.getSelectors()
});

export default animalsSlice;
