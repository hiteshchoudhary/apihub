import {
  AuthSliceInitialStateInterface,
  UserInterface,
} from "@/interfaces/authInterface";
import { LocalStorage } from "@/utils";
import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthSliceInitialStateInterface = {
  user: null,
  token: null,
  loadingUser: true,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loadUser: (state) => {
      console.log("loading user");
      const _token = LocalStorage.get("token");
      const _user = LocalStorage.get("user");
      if (_token && _user?._id) {
        state.user = _user;
        state.token = _token;
      }
      state.loadingUser = false;
    },
    login: (
      state,
      action: PayloadAction<{ user: UserInterface; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { loadUser, login, logout } = authSlice.actions;

export default authSlice.reducer;
