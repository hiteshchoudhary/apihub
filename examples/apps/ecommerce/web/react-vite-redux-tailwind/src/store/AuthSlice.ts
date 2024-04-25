import { createSlice } from "@reduxjs/toolkit";
import { User } from "../services/auth/AuthTypes";

interface AuthSliceTypes {
  isLoggedIn: boolean;
  isLogInCheckDone: boolean;
  userDetails: User | null;
}
const initialState: AuthSliceTypes = {
  isLoggedIn: false,
  isLogInCheckDone: false,
  userDetails: null,
};

const AuthSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    logIn(state, { payload }) {
      state.isLoggedIn = true;
      state.userDetails = payload;
    },
    updateLoginCheckDone(state, {payload}){
      state.isLogInCheckDone = payload
    },
    logOut() {
      return {...initialState, isLogInCheckDone: true};
    },
  },
});

export const { logIn, logOut, updateLoginCheckDone } = AuthSlice.actions;
export default AuthSlice;
