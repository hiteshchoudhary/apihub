import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TOAST_MESSAGE_TYPES } from "../constants";
import store from ".";

interface ToastMessageSliceTypes {
  type: TOAST_MESSAGE_TYPES | null;
  message: string | null;
  timeoutId: ReturnType<typeof setTimeout> | null;
}

const initialState: ToastMessageSliceTypes = {
  type: null,
  message: null,
  timeoutId: null,
};

export const postMessageAction = createAsyncThunk(
  "toastMessageSlice/postMessage",
  (payload: { type: TOAST_MESSAGE_TYPES; message: string }, { dispatch }) => {
    const currentTimeoutId = store.getState().toastMessage.timeoutId;
    if (currentTimeoutId) {
      clearTimeout(currentTimeoutId);
    }
    const timeoutId = setTimeout(() => {
      dispatch(removeMessage());
    }, 5000);

    dispatch(addMessage({ ...payload, timeoutId }));

    return true;
  }
);

const ToastMessageSlice = createSlice({
  name: "toastMessageSlice",
  initialState,
  reducers: {
    addMessage(state, { payload }) {
      state.type = payload.type;
      state.message = payload.message;
      state.timeoutId = payload.timeoutId;
    },
    removeMessage(state) {
      if (state.timeoutId) {
        clearTimeout(state.timeoutId);
      }
      state.type = null;
      state.message = null;
      state.timeoutId = null;
    },
  },
});

export const { addMessage, removeMessage } = ToastMessageSlice.actions;
export default ToastMessageSlice;
