import moment from "moment";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AddEditCouponFields, ButtonTypes } from "../../../../constants";
import { CouponClass } from "../../../../services/coupon/CouponTypes";
import Button from "../../../basic/Button";
import DateTimePicker from "../../../basic/DateTimePicker";
import ErrorMessage from "../../../basic/ErrorMessage";
import Input from "../../../basic/Input";
import Modal from "../../../basic/Modal";
import { COUPON_CODE_MINIMUM_LENGTH } from "../../../../data/applicationData";

interface AddEditCouponModalProps {
  hideModal(): void;
  coupon?: CouponClass;
  addCouponHandler(fields: AddEditCouponFields): void;
  editCouponHandler(fields: AddEditCouponFields): void;
  isLoading?: boolean;
  apiErrorMessage?: string;
}
const AddEditCouponModal = (props: AddEditCouponModalProps) => {
  const {
    hideModal,
    coupon,
    addCouponHandler,
    editCouponHandler,
    isLoading = false,
    apiErrorMessage = "",
  } = props;

  const { t } = useTranslation();

  /* If coupon is provided, isInEditMode will be true else false */
  const isInEditMode = useMemo(() => {
    if (coupon) {
      return true;
    }
    return false;
  }, [coupon]);

  /* Submit button handler */
  const submitHandler = (fields: AddEditCouponFields) => {
    if (isInEditMode) {
      editCouponHandler(fields);
    } else {
      addCouponHandler(fields);
    }
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddEditCouponFields>();

  /* Default Values, for editing a coupon */
  useEffect(() => {
    if (coupon) {
      setValue("name", coupon.name);
      setValue("couponCode", coupon.couponCode);
      setValue("discountValue", coupon.discountValue);
    }
  }, [coupon, setValue]);

  return (
    <Modal
      heading={isInEditMode ? t("updateCoupon") : t("addCoupon")}
      className="px-8 py-6 w-[95%] lg:w-1/3"
    >
      <form
        className="flex flex-col gap-y-4"
        onSubmit={handleSubmit(submitHandler)}
      >
        {apiErrorMessage && (
          <ErrorMessage
            message={apiErrorMessage}
            errorIconClassName="w-4 h-4"
          />
        )}
        <Input
          type="text"
          placeholder={t("name")}
          className="placeholder:capitalize"
          errorMessage={errors.name?.message || ""}
          {...register("name", {
            required: t("nameIsRequired"),
            validate: (value) => {
              if (!value.trim()) {
                return t("invalidValue");
              }
            },
          })}
        />

        <Input
          type="text"
          placeholder={t("couponCode")}
          className="placeholder:capitalize"
          errorMessage={errors.couponCode?.message || ""}
          {...register("couponCode", {
            required: t("couponCodeIsRequired"),
            validate: (value) => {
              if (!value.trim()) {
                return t("invalidValue");
              }
              if (value.length < COUPON_CODE_MINIMUM_LENGTH) {
                return t("couponCodeMustBeFourCharactersLong");
              }
            },
          })}
        />

        <Input
          type="number"
          placeholder={t("discountValue")}
          className="placeholder:capitalize"
          errorMessage={errors.discountValue?.message || ""}
          {...register("discountValue", {
            required: t("discountValueIsRequired"),
            validate: (value) => {
              if (isNaN(Number(value)) || Number(value) <= 0) {
                return t("invalidValue");
              }
            },
          })}
        />

        {!isInEditMode && (
          <>
            <Input
              type="number"
              placeholder={t("minimumCartValue")}
              className="placeholder:capitalize"
              errorMessage={errors.minimumCartValue?.message || ""}
              {...register("minimumCartValue", {
                required: t("minimumCartValueIsRequired"),
                validate: (value) => {
                  if (isNaN(Number(value)) || Number(value) < 0) {
                    return t("invalidValue");
                  }
                },
              })}
            />
            <Controller
              control={control}
              name="startDate"
              rules={{ required: t("startDateIsRequired") }}
              render={({ field }) => (
                <DateTimePicker
                  openOnTop={true}
                  containerClassName="text-sm"
                  inputClassName="w-full"
                  errorMessage={errors.startDate?.message || ""}
                  placeholder={t("startDate")}
                  disabledProperties={{ before: new Date() }}
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name="expiryDate"
              rules={{
                required: t("expiryDateIsRequired"),
                validate: (value) => {
                  if (
                    moment(value).isSameOrBefore(moment(watch("startDate")))
                  ) {
                    return t("expiryDateCannotBeBeforeStartDate");
                  }
                },
              }}
              render={({ field }) => (
                <DateTimePicker
                  openOnTop={true}
                  containerClassName="text-sm"
                  inputClassName="w-full"
                  errorMessage={errors.expiryDate?.message || ""}
                  placeholder={t("expiryDate")}
                  disabledProperties={{ before: watch("startDate") }}
                  {...field}
                />
              )}
            />
          </>
        )}
        <div className="flex flex-col gap-y-4 mt-2">
          <Button
            buttonType={ButtonTypes.primaryButton}
            type="submit"
            onClickHandler={() => {}}
            isLoading={isLoading}
            className="px-12 py-1 uppercase flex justify-center"
          >
            <span>{isInEditMode ? t("update") : t("add")}</span>
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
        </div>
      </form>
    </Modal>
  );
};

export default AddEditCouponModal;
