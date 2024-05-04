import { useTranslation } from "react-i18next";
import Button from "../basic/Button";
import DateRangePicker, {
  DateRangePickerActionsRef,
} from "../basic/DateRangePicker";
import { ButtonTypes, OrderListFilterFields } from "../../constants";
import { useAppSelector } from "../../store";
import Checkbox, { CheckboxActionsRef } from "../basic/Checkbox";
import { ORDER_STATUS_FILTERS_CHECKBOX } from "../../data/applicationData";
import { Controller, useForm } from "react-hook-form";
import { useRef } from "react";

interface OrderListFiltersProps {
  orderFiltersSubmitHandler(fields: OrderListFilterFields): void;
}
const OrderListFilters = (props: OrderListFiltersProps) => {
  const { orderFiltersSubmitHandler } = props;

  const { t } = useTranslation();

  const isRTL = useAppSelector((state) => state.language.isRTL);

  const {
    formState: { errors },
    control,
    handleSubmit,
    setValue,
  } = useForm<OrderListFilterFields>();

  const checkboxActionsRef = useRef<CheckboxActionsRef<null>>({
    forceSetCheckedItems(_) {},
  });
  const dateRangeActionsRef = useRef<DateRangePickerActionsRef>({
    forceSetSelectedRange(_) {},
  });

  const resetHandler = () => {
    setValue("dateRange.from", undefined);
    setValue("dateRange.to", undefined);
    setValue("checkedStatus", ORDER_STATUS_FILTERS_CHECKBOX);
    dateRangeActionsRef.current.forceSetSelectedRange({
      from: undefined,
      to: undefined,
    });
    checkboxActionsRef.current.forceSetCheckedItems(
      ORDER_STATUS_FILTERS_CHECKBOX
    );
    handleSubmit(orderFiltersSubmitHandler)();
  };

  return (
    <form
      className="flex flex-col gap-y-4 lg:gap-y-0 lg:flex-row lg:gap-x-4 lg:items-center"
      dir={isRTL ? "rtl" : "ltr"}
      onSubmit={handleSubmit(orderFiltersSubmitHandler)}
    >
      <Controller
        name="dateRange"
        control={control}
        render={({ field }) => (
          <DateRangePicker
            inputClassName="w-full"
            actionsRef={dateRangeActionsRef.current}
            {...field}
          />
        )}
      />

      <Controller
        name="checkedStatus"
        control={control}
        rules={{
          validate: (value) => {
            if (!value.length) {
              return t("pleaseSelectAOrderStatus");
            }
          },
        }}
        render={({ field }) => (
          <Checkbox
            items={ORDER_STATUS_FILTERS_CHECKBOX}
            labelClassName="capitalize"
            containerClassName="flex gap-x-4 w-full justify-center"
            checkboxContainerClassName="flex gap-x-2"
            errorMessage={errors?.checkedStatus?.message || ""}
            actionsRef={checkboxActionsRef.current}
            {...field}
          />
        )}
      />

      <div className="flex gap-x-2">
        <Button
          type="submit"
          onClickHandler={() => {}}
          buttonType={ButtonTypes.primaryButton}
          className="capitalize px-8 py-1 flex-1 w-fit"
        >
          <span>{t("filter")}</span>
        </Button>
        <Button
          onClickHandler={resetHandler}
          buttonType={ButtonTypes.secondaryButton}
          className="capitalize px-8 py-1 flex-1 min-w-fit"
        >
          <span>{t("reset")}</span>
        </Button>
      </div>
    </form>
  );
};

export default OrderListFilters;
