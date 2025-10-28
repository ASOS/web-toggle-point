import originalSlice from "@/state/modules/animals/slice";
import { createSlice } from "@reduxjs/toolkit";
import constant from "../../../constants";

const animalsSlice = createSlice({
  initialState: [constant.ANIMAL, constant.ANIMAL],
  name: originalSlice.name,
  reducers: {
    ...originalSlice.caseReducers,
    freedom: () => {
      return [];
    }
  },
  selectors: originalSlice.getSelectors()
});

export default animalsSlice;
