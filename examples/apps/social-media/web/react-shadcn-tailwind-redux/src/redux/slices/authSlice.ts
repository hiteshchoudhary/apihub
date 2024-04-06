// required imports
import {
  AuthSliceInitialStateInterface,
  UserInterface,
} from "@/interfaces/authInterface";
import { LocalStorage } from "@/utils";
import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

// Initial state for the auth slice
const initialState: AuthSliceInitialStateInterface = {
  user: null,
  token: null,
  loadingUser: true,
};

// Create the auth slice using createSlice from Redux Toolkit
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Action to load user from local storage
    loadUser: (state) => {
      // Get token and user from local storage
      const _token = LocalStorage.get("token");
      const _user = LocalStorage.get("user");

      // If both token and user ID are present, set user and token in the state
      if (_token && _user?._id) {
        state.user = _user;
        state.token = _token;
      }

      // Set loadingUser to false
      state.loadingUser = false;
    },
    // Action to log in user
    login: (
      state,
      action: PayloadAction<{ user: UserInterface; token: string }>
    ) => {
      // Set user and token in the state based on the action payload
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    // Action to log out user
    logout: (state) => {
      // Clear user and token from the state
      state.user = null;
      state.token = null;

      // remove user and token from localstorage
      LocalStorage.remove("token");
      LocalStorage.remove("user");
    },

    updateUserAvatar: (
      state,
      action: PayloadAction<{ updatedUser: UserInterface }>
    ) => {
      state.user = action.payload.updatedUser;
      LocalStorage.set("user", action.payload.updatedUser);
    },
  },
});

// Export action creators
export const { loadUser, login, logout, updateUserAvatar } = authSlice.actions;

// Export the auth reducer
export default authSlice.reducer;
