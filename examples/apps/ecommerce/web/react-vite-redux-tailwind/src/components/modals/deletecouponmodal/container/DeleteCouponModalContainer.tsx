import { useState } from "react";
import { useTranslation } from "react-i18next";
import ApiError from "../../../../services/ApiError";
import CouponService from "../../../../services/coupon/CouponService";
import { CouponClass } from "../../../../services/coupon/CouponTypes";
import FeedbackModal from "../../feedbackmodal/presentation/FeedbackModal";
import DeleteCouponModal from "../presentation/DeleteCouponModal";

interface DeleteCouponModalContainerProps {
  hideModal(): void;
  coupon: CouponClass;
  onCouponDeleted(deletedCoupon: CouponClass): void;
}
const DeleteCouponModalContainer = (props: DeleteCouponModalContainerProps) => {
  const { hideModal, coupon, onCouponDeleted } = props;

  const { t } = useTranslation();

  /* API Call in progress flag */
  const [isLoading, setIsLoading] = useState(false);

  /* Error from API */
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  /* State to show success dialog once delete operation is complete */
  const [isDeletionComplete, setIsDeletionComplete] = useState(false);

  const deleteCouponHandler = async () => {
    setIsLoading(true);
    setApiErrorMessage("");

    const response = await CouponService.deleteCoupon(coupon._id);

    setIsLoading(false);

    if (!(response instanceof ApiError)) {
      /* Success */
      setIsDeletionComplete(true);
      onCouponDeleted(response);
    } else {
      /* Error */
      setApiErrorMessage(
        response.errorResponse?.message || response.errorMessage
      );
    }
  };

  return (
    <>
      {isDeletionComplete || apiErrorMessage ? (
        <FeedbackModal
          messageType={apiErrorMessage ? "ERROR" : "SUCCESS"}
          message={
            apiErrorMessage ? apiErrorMessage : t("couponDeletedSuccessfully")
          }
          hideModal={hideModal}
        />
      ) : (
        <DeleteCouponModal
          cancelButtonHandler={hideModal}
          coupon={coupon}
          deleteCouponHandler={deleteCouponHandler}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default DeleteCouponModalContainer;
