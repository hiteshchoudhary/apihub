import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  headerHeight: 0,
};
const UIinfoSlice = createSlice({
  name: "UIinfoSlic",
  initialState,
  reducers: {
    updateHeaderHeight(state, { payload }) {
      state.headerHeight = payload;
    },
  },
});

export const { updateHeaderHeight } = UIinfoSlice.actions;
export default UIinfoSlice;
