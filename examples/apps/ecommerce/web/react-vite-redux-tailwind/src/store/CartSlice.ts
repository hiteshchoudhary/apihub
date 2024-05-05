import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserCart } from "../services/cart/CartTypes";
import CartService from "../services/cart/CartService";
import ApiError from "../services/ApiError";
import { postMessageAction, removeMessage } from "./ToastMessageSlice";
import i18n from "../i18n";
import { TOAST_MESSAGE_TYPES } from "../constants";

interface CartSliceTypes {
  userCart: UserCart | null;
  isAddOrUpdateToCartInProgress: boolean;
  isRemoveFromCartInProgress: boolean;
}

export const getUserCartThunk = createAsyncThunk(
  "auth/getUserCart",
  async () => {
    const response = await CartService.getUserCart();
    if (!(response instanceof ApiError)) {
      return response;
    } else {
      return null;
    }
  }
);

type addOrUpdateToCartPayload = { productId: string; quantity: number };

export const addOrUpdateToCartThunk = createAsyncThunk(
  "auth/addOrUpdateToCart",
  async (payload: addOrUpdateToCartPayload, { dispatch }) => {
    const { productId, quantity } = payload;

    dispatch(updateAddToCartInProgress(true));

    dispatch(removeMessage());

    const response = await CartService.addOrUpdateItemInCart(
      productId,
      quantity
    );
    dispatch(updateAddToCartInProgress(false));
    if (!(response instanceof ApiError)) {
      dispatch(
        postMessageAction({
          type: TOAST_MESSAGE_TYPES.success,
          message: i18n.t("cartUpdatedSuccessfully"),
        })
      );
      return response;
    } else {
      dispatch(
        postMessageAction({
          type: TOAST_MESSAGE_TYPES.error,
          message: response.errorResponse?.message || response.errorMessage,
        })
      );
      return null;
    }
  }
);

type removeFromCartPayload = { productId: string };

export const removeFromCartThunk = createAsyncThunk(
  "auth/removeFromCart",
  async (payload: removeFromCartPayload, { dispatch }) => {
    const { productId } = payload;

    dispatch(updateRemoveFromCartInProgress(true));
    dispatch(removeMessage());

    const response = await CartService.removeItemFromCart(productId);

    dispatch(updateRemoveFromCartInProgress(false));

    if (!(response instanceof ApiError)) {
      dispatch(
        postMessageAction({
          type: TOAST_MESSAGE_TYPES.success,
          message: i18n.t("cartUpdatedSuccessfully"),
        })
      );

      return response;
    } else {
      dispatch(
        postMessageAction({
          type: TOAST_MESSAGE_TYPES.error,
          message: response.errorResponse?.message || response.errorMessage,
        })
      );

      return null;
    }
  }
);

const initialState: CartSliceTypes = {
  userCart: null,
  isAddOrUpdateToCartInProgress: false,
  isRemoveFromCartInProgress: false,
};

const CartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    updateAddToCartInProgress(state, { payload }) {
      state.isAddOrUpdateToCartInProgress = payload;
    },
    updateRemoveFromCartInProgress(state, { payload }) {
      state.isRemoveFromCartInProgress = payload;
    },
    updateUserCart(state, {payload}){
      state.userCart = payload
    },
    resetCartSlice() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserCartThunk.fulfilled, (state, { payload }) => {
      state.userCart = payload;
    }),
      builder.addCase(
        addOrUpdateToCartThunk.fulfilled,
        (state, { payload }) => {
          if (payload) {
            state.userCart = payload;
          }
        }
      ),
      builder.addCase(removeFromCartThunk.fulfilled, (state, { payload }) => {
        if (payload) {
          state.userCart = payload;
        }
      });
  },
});

export const {
  updateAddToCartInProgress,
  updateRemoveFromCartInProgress,
  resetCartSlice,
  updateUserCart
} = CartSlice.actions;
export default CartSlice;
