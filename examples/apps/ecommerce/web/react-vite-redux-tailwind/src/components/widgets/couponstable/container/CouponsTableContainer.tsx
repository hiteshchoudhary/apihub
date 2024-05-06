import { useCallback, useEffect, useState } from "react";
import { DATE_TIME_FORMATS } from "../../../../constants";
import CouponService from "../../../../services/coupon/CouponService";
import { CouponClass } from "../../../../services/coupon/CouponTypes";
import {
  convertUTCToLocalTime,
  formatDateTime,
} from "../../../../utils/dateTimeHelper";
import CouponsTable from "../presentation/CouponsTable";

const CouponsTableContainer = () => {
  /* Key value coupons object, key is id and value is the Coupon */
  const [coupons, setCoupons] = useState<{ [key: string]: CouponClass }>({});

  /* To know if an error has occurred when fetching coupons */
  const [isError, setIsError] = useState(false);

  const formatCoupon = (coupon: CouponClass) => {
    /* Cloning the object, so the original object doesn't get updated */
    coupon = { ...coupon };

    /* Converting expiryDate and startDate to local and formatting them, 
    as expiry date will be visible */
    coupon.expiryDate = formatDateTime(
      convertUTCToLocalTime(
        coupon.expiryDate,
        DATE_TIME_FORMATS.standardDateWithTime
      ),
      DATE_TIME_FORMATS.standardDateWithTime,
      DATE_TIME_FORMATS.displayedDateWithTime
    );
    coupon.startDate = formatDateTime(
      convertUTCToLocalTime(
        coupon.startDate,
        DATE_TIME_FORMATS.standardDateWithTime
      ),
      DATE_TIME_FORMATS.standardDateWithTime,
      DATE_TIME_FORMATS.displayedDateWithTime
    );

    return coupon;
  };

  /* Fetch All Coupons Asynchronously */
  const fetchAllCoupons = useCallback(() => {
    CouponService.getAllCouponsAsync((data, _, error) => {
      if (!error) {
        setCoupons((prev) => {
          data.map((coupon) => {
            /* Formatting coupon */
            coupon = formatCoupon(coupon);

            /* At key: Coupon ID, value is the coupon object */
            prev[coupon._id] = coupon;
          });
          return { ...prev };
        });
      } else {
        console.error("Error -- fetchAllCoupons() Admin", error);
        setIsError(true);
      }
    });
  }, []);

  /* Once a coupon has been updated or added (In order to avoid another apiCall) */
  const onCouponAddedOrUpdatedHandler = (newCoupon: CouponClass) => {
    /* Update coupon object at the couponId */
    setCoupons((prev) => {
      prev[newCoupon._id] = formatCoupon(newCoupon);
      return { ...prev };
    });
  };

  const onCouponDeletedHandler = (deletedCoupon: CouponClass) => {
    /* Removing the key value pair of the deletedCoupon */
    setCoupons((prev) => {
      delete prev[deletedCoupon._id];
      return { ...prev };
    });
  };

  const resetCouponStatusHandler = (coupon: CouponClass) => {
    setCoupons((prev) => {
      prev[coupon._id] = coupon;
      return { ...prev };
    });
  };

  /* Initial Render */
  useEffect(() => {
    fetchAllCoupons();
  }, [fetchAllCoupons]);

  return (
    <>
      <CouponsTable
        coupons={Object.values(coupons)}
        isError={isError}
        onCouponAddedOrUpdatedHandler={onCouponAddedOrUpdatedHandler}
        onCouponDeletedHandler={onCouponDeletedHandler}
        resetCouponStatusHandler={resetCouponStatusHandler}
      />
    </>
  );
};

export default CouponsTableContainer;
