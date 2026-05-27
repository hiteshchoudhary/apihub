import { useTranslation } from "react-i18next";
import {
  ButtonTypes,
  DropdownItem,
  DropdownTypes,
} from "../../../../constants";
import { ORDER_STATUS } from "../../../../data/applicationData";
import { OrderClass } from "../../../../services/order/OrderTypes";
import Button from "../../../basic/Button";
import Dropdown, { DropdownActions } from "../../../basic/Dropdown";
import Modal from "../../../basic/Modal";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface EditOrderStatusModalProps {
  hideModal(): void;
  order: OrderClass;
  isLoading?: boolean;
  editStatusHandler(status: ORDER_STATUS): void;
}
const EditOrderStatusModal = (props: EditOrderStatusModalProps) => {
  const { hideModal, order, isLoading, editStatusHandler } = props;

  const { t } = useTranslation();

  /* Dropdown Items */
  const orderStatusDropdownItems: Array<DropdownItem> = useMemo(() => {
    /* Array of Order Statuses with id and textKey both as the status */
    return Object.keys(ORDER_STATUS).map((status) => {
      return {
        id: status,
        textKey: status.toLowerCase(),
      };
    });
  }, []);

  /* Submit button handler */
  const submitButtonHandler = (fields: { status: DropdownItem }) => {
    /* Call the container edit status function passind the status selected */
    editStatusHandler(fields.status.id as ORDER_STATUS);
  };

  /* For setting selected dropdown item value */
  const statusDropdownActionsRef = useRef<DropdownActions>({
    forceSetSelectedItem(_) {},
  });

  const { control, handleSubmit, watch, setValue } = useForm<{
    status: DropdownItem;
  }>();

  /* Update button enabled flag */
  const [isUpdateButtonEnabled, setIsUpdateButtonEnabled] = useState(false);

  /* Watching for changed in the form */
  useEffect(() => {
    const subscription = watch((value) => {
      /* 
      If the selected status is not equal to the order status, enable the update button, 
      else disable it 
      */
      if(value.status?.id && order.status !== value.status.id){
        setIsUpdateButtonEnabled(true);
      }
      else{
        setIsUpdateButtonEnabled(false);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [watch, order]);

  /* On change of order */
  useEffect(() => {
    if (order) {
      /* Default selected dropdown item based on the order status */
      const selectedDropdownItem = orderStatusDropdownItems.find(
        (item) => item.id === order.status
      );

      /* Setting the default status dropdown value */
      if (selectedDropdownItem) {
        setValue("status", selectedDropdownItem);
        statusDropdownActionsRef.current.forceSetSelectedItem(
          selectedDropdownItem
        );
      }
    }
  }, [order, orderStatusDropdownItems, setValue]);

  return (
    <Modal
      className="px-8 py-6 w-[95%] lg:w-1/3"
      heading={t("updateOrderStatus")}
    >
      <form
        className="flex flex-col gap-y-4"
        onSubmit={handleSubmit(submitButtonHandler)}
      >
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Dropdown
              itemsList={orderStatusDropdownItems}
              type={DropdownTypes.borderedLightBg}
              mainButtonClassNames="w-full"
              actionsRef={statusDropdownActionsRef.current}
              {...field}
            />
          )}
        />

        <Button
          buttonType={ButtonTypes.primaryButton}
          type="submit"
          onClickHandler={() => {}}
          isLoading={isLoading}
          isDisabled={!isUpdateButtonEnabled}
          className="px-12 py-1 uppercase flex justify-center"
        >
          <span>{t("update")}</span>
        </Button>
        {!isLoading && (
          <Button
            buttonType={ButtonTypes.secondaryButton}
            onClickHandler={hideModal}
            className="px-12 py-1 uppercase"
          >
            <span>{t("cancel")}</span>
          </Button>
        )}
      </form>
    </Modal>
  );
};

export default EditOrderStatusModal;
