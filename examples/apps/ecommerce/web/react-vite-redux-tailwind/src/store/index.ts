import { configureStore } from "@reduxjs/toolkit";
import LanguageSlice from "./LanguageSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import BreakpointSlice from "./BreakpointSlice";
import AuthSlice from "./AuthSlice";
import ToastMessageSlice from "./ToastMessageSlice";
import CartSlice from "./CartSlice";

const store = configureStore({
    reducer: {
        language: LanguageSlice.reducer,
        breakpoint: BreakpointSlice.reducer,
        auth: AuthSlice.reducer,
        toastMessage: ToastMessageSlice.reducer,
        cart: CartSlice.reducer
    }
})
/* useAppSelector and useAppDispatch for typescript */
export type ReduxRootState = ReturnType<typeof store.getState>
export const useAppSelector: TypedUseSelectorHook<ReduxRootState> = useSelector;

export type ReduxDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch<ReduxDispatch>

export default store;