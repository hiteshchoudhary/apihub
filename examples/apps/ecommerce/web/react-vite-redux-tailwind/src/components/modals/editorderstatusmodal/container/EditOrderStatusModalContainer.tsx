import { useTranslation } from "react-i18next";
import { ORDER_STATUS } from "../../../../data/applicationData";
import ApiError from "../../../../services/ApiError";
import OrderService from "../../../../services/order/OrderService";
import { OrderClass } from "../../../../services/order/OrderTypes";
import FeedbackModal from "../../feedbackmodal/presentation/FeedbackModal";
import EditOrderStatusModal from "../presentation/EditOrderStatusModal";
import { useState } from "react";

interface EditOrderStatusModalContainerProps {
  hideModal(): void;
  order: OrderClass;
  onOrderStatusUpdatedHandler(orderId: string, status: ORDER_STATUS): void;
}
const EditOrderStatusModalContainer = (
  props: EditOrderStatusModalContainerProps
) => {
  const { hideModal, onOrderStatusUpdatedHandler, order } = props;

  const { t } = useTranslation();

  /* API Call in progress flag */
  const [isLoading, setIsLoading] = useState(false);

  /* Error from API */
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  /* State to show success dialog once edit operation is completed*/
  const [isEditComplete, setIsEditComplete] = useState(false);

  /* Edit Status Handler */
  const editStatusHandler = async (status: ORDER_STATUS) => {
    setIsLoading(true);
    setApiErrorMessage("");

    const response = await OrderService.editOrderStatus(status, order._id);

    setIsLoading(false);

    /* Success */
    if (!(response instanceof ApiError)) {
      setIsEditComplete(true);
      onOrderStatusUpdatedHandler(order._id, status);
    } else {
      /* Error */
      setApiErrorMessage(
        response.errorResponse?.message || response.errorMessage
      );
    }
  };
  return (
    <>
      {apiErrorMessage || isEditComplete ? (
        <FeedbackModal
          message={
            apiErrorMessage
              ? apiErrorMessage
              : t("orderStatusUpdatedSuccessfully")
          }
          messageType={apiErrorMessage ? "ERROR" : "SUCCESS"}
          hideModal={hideModal}
        />
      ) : (
        <EditOrderStatusModal
          editStatusHandler={editStatusHandler}
          hideModal={hideModal}
          order={order}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default EditOrderStatusModalContainer;
