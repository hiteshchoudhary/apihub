import { useCallback, useEffect, useState } from "react";
import { Product } from "../../../../services/product/ProductTypes";
import ProductDetails from "../presentation/ProductDetails";
import ProductService from "../../../../services/product/ProductService";
import ApiError from "../../../../services/ApiError";
import { useAppDispatch, useAppSelector } from "../../../../store";
import useCustomNavigate from "../../../../hooks/useCustomNavigate";
import { ROUTE_PATHS } from "../../../../constants";
import {
  addOrUpdateToCartThunk,
  removeFromCartThunk,
} from "../../../../store/CartSlice";
import { CartItemClass } from "../../../../services/cart/CartTypes";

interface ProductDetailsContainerProps {
  productId: string;
}
const ProductDetailsContainer = (props: ProductDetailsContainerProps) => {
  const { productId } = props;

  const dispatch = useAppDispatch();
  const navigate = useCustomNavigate();

  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const userCart = useAppSelector((state) => state.cart.userCart);

  /* Product Details State */
  const [productDetails, setProductDetails] = useState<Product>();

  /* If the product is in cart and the quantity in cart */
  const [productInCart, setProductInCart] = useState({
    isProductExistsInCart: false,
    currentQuantity: 0,
  });

  /* Error while fetching product details */
  const [isProductDetailsError, setIsProductDetailsError] = useState(false);

  /* For loading spinner */
  const isAddOrUpdateCartInProgress = useAppSelector(
    (state) => state.cart.isAddOrUpdateToCartInProgress
  );
  const isRemoveFromCartInProgress = useAppSelector(
    (state) => state.cart.isRemoveFromCartInProgress
  );

  const fetchProductDetails = useCallback(async () => {
    if (productId) {
      setIsProductDetailsError(false);

      const response = await ProductService.getProduct(productId);

      if (response instanceof ApiError) {
        // Error
        setIsProductDetailsError(true);
      } else {
        setIsProductDetailsError(false);
        setProductDetails(response);
      }
    }
  }, [productId]);

  /* Add to cart function */
  const addToCart = async (product: Product, quantity: number) => {
    /* If the user is not logged in, route to login */
    if (!isLoggedIn) {
      navigate(ROUTE_PATHS.login);
      return;
    }

    /* Add to cart thunk */
    dispatch(addOrUpdateToCartThunk({ productId: product._id, quantity }));
  };

  /* Remove from cart function */
  const removeFromCart = async (product: Product) => {
    /* If the user is not logged in, route to login */
    if (!isLoggedIn) {
      navigate(ROUTE_PATHS.login);
      return;
    }
    /* Remove from cart thunk */
    dispatch(removeFromCartThunk({ productId: product._id }));
  };

  const checkProductInCart = useCallback(() => {
    /* Finding the product in user cart */
    const product = userCart?.items.find(
      (item: CartItemClass) => item.product._id === productId
    );
    if (product) {
      setProductInCart({
        isProductExistsInCart: true,
        currentQuantity: product.quantity,
      });
    } else {
      setProductInCart({ isProductExistsInCart: false, currentQuantity: 0 });
    }
  }, [userCart, productId]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  useEffect(() => {
    checkProductInCart();
  }, [checkProductInCart]);

  return (
    <ProductDetails
      product={productDetails}
      isError={isProductDetailsError}
      addToCart={addToCart}
      removeFromCart={removeFromCart}
      removeFromCartButtonShown={productInCart.isProductExistsInCart}
      updateQuantityButtonShown={productInCart.isProductExistsInCart}
      quantityInCart={productInCart.currentQuantity}
      isAddOrUpdateCartInProgress={isAddOrUpdateCartInProgress}
      isRemoveFromCartInProgress={isRemoveFromCartInProgress}
    />
  );
};

export default ProductDetailsContainer;
