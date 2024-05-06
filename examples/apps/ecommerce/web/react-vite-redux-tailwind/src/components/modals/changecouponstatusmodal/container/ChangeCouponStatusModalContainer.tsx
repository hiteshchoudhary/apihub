import { useState } from "react";
import { useTranslation } from "react-i18next";
import ApiError from "../../../../services/ApiError";
import CouponService from "../../../../services/coupon/CouponService";
import { CouponClass } from "../../../../services/coupon/CouponTypes";
import FeedbackModal from "../../feedbackmodal/presentation/FeedbackModal";
import ChangeCouponStatusModal from "../presentation/ChangeCouponStatusModal";

interface ChangeCouponStatusModalContainerProps {
  hideModal(): void;
  coupon: CouponClass;
  resetCouponData(coupon: CouponClass): void;
}
const ChangeCouponStatusModalContainer = (
  props: ChangeCouponStatusModalContainerProps
) => {
  const { hideModal, coupon, resetCouponData } = props;

  const { t } = useTranslation();

  /* Loading flag */
  const [isLoading, setIsLoading] = useState(false);

  /* API Error message */
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  /* Status change completed flag */
  const [isStatusChangeComplete, setIsStatusChangeComplete] = useState(false);

  /* Change status handler */
  const changeCouponStatusHandler = async () => {
    setIsLoading(true);
    setApiErrorMessage("");
    const response = await CouponService.updateCouponActiveStatus(
      coupon._id,
      coupon.isActive
    );

    setIsLoading(false);

    if (!(response instanceof ApiError)) {
      /* Success: show feedback modal */
      setIsStatusChangeComplete(true);
    } else {
      /* Error: Show feedback modal and reset coupon data to the previous isActive flag */
      setApiErrorMessage(
        response.errorResponse?.message || response.errorMessage
      );
      resetCouponData({ ...coupon, isActive: !coupon.isActive });
    }
  };

  /* On click of cancel, reset data and hide modal */
  const hideModalAndResetCouponData = () => {
    resetCouponData({...coupon, isActive: !coupon.isActive})
    hideModal();
  }

  return (
    <>
      {isStatusChangeComplete || apiErrorMessage ? (
        <FeedbackModal
          message={
            isStatusChangeComplete
              ? t("statusChangedSuccessfully")
              : apiErrorMessage
          }
          messageType={isStatusChangeComplete ? "SUCCESS" : "ERROR"}
          hideModal={hideModal}
        />
      ) : (
        <ChangeCouponStatusModal
          changeStatusHandler={changeCouponStatusHandler}
          coupon={coupon}
          hideModal={hideModalAndResetCouponData}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default ChangeCouponStatusModalContainer;
