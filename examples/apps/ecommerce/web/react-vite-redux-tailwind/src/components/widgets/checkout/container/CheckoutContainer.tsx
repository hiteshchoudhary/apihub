import { useCallback, useEffect, useState } from "react";
import Checkout from "../presentation/Checkout";
import { AddressClass } from "../../../../services/address/AddressTypes";
import AddressService from "../../../../services/address/AddressService";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { CouponClass } from "../../../../services/coupon/CouponTypes";
import CouponService from "../../../../services/coupon/CouponService";
import {
  CheckoutApplyCouponCodeFields,
  TOAST_MESSAGE_TYPES,
} from "../../../../constants";
import ApiError from "../../../../services/ApiError";
import { updateUserCart } from "../../../../store/CartSlice";
import { postMessageAction } from "../../../../store/ToastMessageSlice";
import { useTranslation } from "react-i18next";

const CheckoutContainer = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  /* Addresses stored by the user */
  const [userAddresses, setUserAddresses] = useState<Array<AddressClass>>([]);

  /* Coupons List */
  const [couponsAvailableToUser, setCouponsAvailableToUser] = useState<
    Array<CouponClass>
  >([]);

  /* Loading state when applying a coupon or removing a coupon */
  const [isUpdatingCouponInProgress, setIsUpdatingCouponInProgress] =
    useState(false);

  /* User's cart */
  const userCart = useAppSelector((state) => state.cart.userCart);

  /* Fetching all the user's stored addresses asynchronously */
  const fetchUserAddresses = useCallback(() => {
    setUserAddresses([]);
    AddressService.getAllAddressesAsync((data, _, error) => {
      if (data) {
        setUserAddresses((prev) => [...prev, ...data]);
      } else if (error) {
        // Error
      }
    });
  }, []);

  /* Fetching all the coupons available to the user asynchronously */
  const fetchUserCoupons = useCallback(() => {
    setCouponsAvailableToUser([]);
    CouponService.getAllCouponsAvailableToUserAsync((data, _, error) => {
      if (data) {
        setCouponsAvailableToUser((prev) => [...prev, ...data]);
      } else if (error) {
        // Error Here
      }
    });
  }, []);

  /* Apply Coupon */
  const applyCouponCodeHandler = async (
    data: CheckoutApplyCouponCodeFields
  ) => {
    setIsUpdatingCouponInProgress(true);
    const response = await CouponService.applyCouponCode(data.couponCode);
    setIsUpdatingCouponInProgress(false);

    /* Success */
    if (!(response instanceof ApiError)) {
      dispatch(updateUserCart(response));
      dispatch(
        postMessageAction({
          type: TOAST_MESSAGE_TYPES.success,
          message: t("couponCodeAppliedSuccessfully"),
        })
      );
    } else {
      // Error
      dispatch(
        postMessageAction({
          type: TOAST_MESSAGE_TYPES.error,
          message: response.errorResponse?.message || response.errorMessage,
        })
      );
    }
  };

  /* Remove applied coupon */
  const removeCouponCodeHandler = async () => {
    if (userCart?.coupon.couponCode) {
      setIsUpdatingCouponInProgress(true);

      const response = await CouponService.removeCouponCode(
        userCart?.coupon.couponCode
      );

      setIsUpdatingCouponInProgress(false);
      
      /* Success */
      if (!(response instanceof ApiError)) {
        dispatch(updateUserCart(response));
        dispatch(
          postMessageAction({
            type: TOAST_MESSAGE_TYPES.success,
            message: t("couponCodeRemovedSuccessfully"),
          })
        );
      } else {
        // Error
        dispatch(
          postMessageAction({
            type: TOAST_MESSAGE_TYPES.error,
            message: response.errorResponse?.message || response.errorMessage,
          })
        );
      }
    }
  };

  useEffect(() => {
    fetchUserAddresses();
  }, [fetchUserAddresses]);

  useEffect(() => {
    fetchUserCoupons();
  }, [fetchUserCoupons]);

  return (
    <>
      {userCart && (
        <Checkout
          userAddresses={userAddresses}
          refreshUserAddresses={fetchUserAddresses}
          userCart={userCart}
          couponsAvailableToUser={couponsAvailableToUser}
          isUpdatingCouponInProgress={isUpdatingCouponInProgress}
          applyCouponCodeHandler={applyCouponCodeHandler}
          removeCouponCodeHandler={removeCouponCodeHandler}
        />
      )}
    </>
  );
};

export default CheckoutContainer;
