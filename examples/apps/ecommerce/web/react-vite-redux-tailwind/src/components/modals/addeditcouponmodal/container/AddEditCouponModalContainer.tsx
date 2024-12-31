import { useState } from "react";
import { CouponClass } from "../../../../services/coupon/CouponTypes";
import { useTranslation } from "react-i18next";
import AddEditCouponModal from "../presentation/AddEditCouponModal";
import { AddEditCouponFields } from "../../../../constants";
import FeedbackModal from "../../feedbackmodal/presentation/FeedbackModal";
import CouponService from "../../../../services/coupon/CouponService";
import ApiError from "../../../../services/ApiError";

interface AddEditCouponModalContainerProps {
  hideModal(): void;
  onCouponAddedOrEdited(coupon: CouponClass): void;
  coupon?: CouponClass;
}
const AddEditCouponModalContainer = (
  props: AddEditCouponModalContainerProps
) => {
  const { hideModal, onCouponAddedOrEdited, coupon } = props;

  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);

  const [apiErrorMessage, setApiErrorMessage] = useState("");

  const [isAddOrEditComplete, setIsAddOrEditComplete] = useState(false);

  const addCouponHandler = async (fields: AddEditCouponFields) => {
    setIsLoading(true);
    setApiErrorMessage("");

    const response = await CouponService.addCoupon(fields);

    setIsLoading(false);

    /* Success */
    if (!(response instanceof ApiError)) {
      setIsAddOrEditComplete(true);
      onCouponAddedOrEdited(response);
    } else {
      /* Error */
      setApiErrorMessage(
        response.errorResponse?.message || response.errorMessage
      );
    }
  };
  const editCouponHandler = async (fields: AddEditCouponFields) => {
    if (coupon) {
      setIsLoading(true);
      setApiErrorMessage("");

      const response = await CouponService.editCoupon(fields, coupon?._id);

      setIsLoading(false);

      /* Success */
      if (!(response instanceof ApiError)) {
        setIsAddOrEditComplete(true);
        onCouponAddedOrEdited(response);
      } else {
        /* Error */
        setApiErrorMessage(
          response.errorResponse?.message || response.errorMessage
        );
      }
    }
  };

  return (
    <>
      {isAddOrEditComplete ? (
        <FeedbackModal
          message={
            coupon
              ? t("couponUpdatedSuccessfully")
              : t("couponAddedSuccessfully")
          }
          messageType="SUCCESS"
          hideModal={hideModal}
        />
      ) : (
        <AddEditCouponModal
          hideModal={hideModal}
          coupon={coupon}
          addCouponHandler={addCouponHandler}
          editCouponHandler={editCouponHandler}
          isLoading={isLoading}
          apiErrorMessage={apiErrorMessage}
        />
      )}
    </>
  );
};

export default AddEditCouponModalContainer;
