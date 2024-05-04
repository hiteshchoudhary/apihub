import { useMemo } from "react";
import { Product } from "../../../../services/product/ProductTypes";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
  addOrUpdateToCartThunk,
  removeFromCartThunk,
} from "../../../../store/CartSlice";
import Cart from "../presentation/Cart";
import FullPageLoadingSpinner from "../../../basic/FullPageLoadingSpinner";
import useCustomNavigate from "../../../../hooks/useCustomNavigate";
import { ROUTE_PATHS } from "../../../../constants";

const CartContainer = () => {

  const navigate = useCustomNavigate();

  const userCart = useAppSelector((state) => state.cart.userCart);

  /* Is Add / Remove from cart in progress state from redux */
  const isAddOrUpdateToCartInProgress = useAppSelector(
    (state) => state.cart.isAddOrUpdateToCartInProgress
  );

  const isRemoveFromCartInProgress = useAppSelector(
    (state) => state.cart.isRemoveFromCartInProgress
  );

  /* If add / update / remove from cart is in progress: Show the loading spinner */
  const isLoading = useMemo(() => {
    if (isAddOrUpdateToCartInProgress || isRemoveFromCartInProgress) {
      return true;
    }
    return false;
  }, [isAddOrUpdateToCartInProgress, isRemoveFromCartInProgress]);

  const dispatch = useAppDispatch();

  /* On change of quantity */
  const onQuantityChanged = (product: Product, quantity: number) => {
    dispatch(
      addOrUpdateToCartThunk({ productId: product._id, quantity: quantity })
    );
  };

  /* Remove from cart */
  const removeFromCart = (product: Product) => {
    dispatch(removeFromCartThunk({ productId: product._id }));
  };

  /* Navigate to checkout */
  const checkoutClickHandler = () => {
    navigate(ROUTE_PATHS.checkout, false, {isFromCartPage: true});
  };
  return (
    <>
      {isLoading && <FullPageLoadingSpinner />}
      <Cart
        cart={userCart}
        onQuantityChanged={onQuantityChanged}
        removeFromCart={removeFromCart}
        checkoutClickHandler={checkoutClickHandler}
      />
    </>
  );
};

export default CartContainer;
