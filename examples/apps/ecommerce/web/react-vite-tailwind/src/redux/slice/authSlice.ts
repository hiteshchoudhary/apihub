import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInterface } from "../../interfaces/user";
import { LocalStorage } from "../../utils";

export interface AuthState {
  user: UserInterface | null;
  token: string | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    //The first reducer to be called to check if user details are saved or not
    loadUser: (state) => {
      const _token = LocalStorage.get("token");
      const _user = LocalStorage.get("user");
      if (_token && _user) {
        state.user = _user;
        state.token = _token;
      }
      state.isLoading = false;
    },
    login: (
      state,
      action: PayloadAction<{ user: UserInterface; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});
export const { login, setLoading, logout, loadUser } = authSlice.actions;
export default authSlice.reducer;
