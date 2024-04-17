import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice.ts";
const appStore = configureStore({
  reducer: {
    authReducer: authSlice,
  },
});
export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;

export default appStore;
