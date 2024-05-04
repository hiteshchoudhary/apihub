import { useEffect, useState } from "react";
import { AddressClass } from "../../../../services/address/AddressTypes";
import RadioButtons from "../../../basic/RadioButtons";
import {
  ButtonTypes,
  CheckoutApplyCouponCodeFields,
  CheckoutFormFields,
  RADIO_BUTTON_TYPE,
} from "../../../../constants";
import AddressCard from "../../../business/AddressCard";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Button from "../../../basic/Button";
import AddIcon from "../../../icons/AddIcon";
import AddAddressModalContainer from "../../../modals/addaddressmodal/container/AddAddressModalContainer";
import { UserCart } from "../../../../services/cart/CartTypes";
import InvoiceAmountSummary from "../../../business/InvoiceAmountSummary";
import { CouponClass } from "../../../../services/coupon/CouponTypes";
import CouponCardList from "../../../business/CouponCardList";
import Input from "../../../basic/Input";
import { useAppSelector } from "../../../../store";
import Text from "../../../basic/Text";
import ErrorMessage from "../../../basic/ErrorMessage";
import Payment from "../../../business/Payment";
import { DEFAULT_CURRENCY } from "../../../../data/applicationData";

interface CheckoutProps {
  userAddresses: Array<AddressClass>;
  couponsAvailableToUser: Array<CouponClass>;
  userCart: UserCart;
  isUpdatingCouponInProgress: boolean;
  refreshUserAddresses(): void;
  applyCouponCodeHandler(data: CheckoutApplyCouponCodeFields): void;
  removeCouponCodeHandler(): void;
}
const Checkout = (props: CheckoutProps) => {
  const {
    userAddresses = [],
    couponsAvailableToUser = [],
    userCart,
    refreshUserAddresses,
    applyCouponCodeHandler,
    removeCouponCodeHandler,
    isUpdatingCouponInProgress = false,
  } = props;

  const isRTL = useAppSelector((state) => state.language.isRTL);
  const { t } = useTranslation();

  /* To convert User Addresses, to types which can be passed to radio buttons component */
  const [addressRadioButtons, setAddressRadioButtons] = useState<
    Array<RADIO_BUTTON_TYPE<AddressClass>>
  >([]);

  /* If add address modal is shown */
  const [isAddressModalShown, setIsAddressModalShown] = useState(false);

  const { watch: watchAddress, reset, control } = useForm<CheckoutFormFields>();

  const {
    handleSubmit: couponHandleSubmit,
    register: couponCodeRegister,
    formState: { errors: couponCodeErrors },
  } = useForm<CheckoutApplyCouponCodeFields>();

  useEffect(() => {
    /* Creating Radio Button Type Array */
    const tempAddressRadioButton: Array<RADIO_BUTTON_TYPE<AddressClass>> = [];
    userAddresses.forEach((address) => {
      tempAddressRadioButton.push({
        id: address._id,
        isDefaultSelected: false,
        customElement: (
          <AddressCard
            address={address}
            className=""
            onAddressUpdated={refreshUserAddresses}
          />
        ),
        data: address,
      });
    });
    setAddressRadioButtons(tempAddressRadioButton);
    reset(); /* Reset Address Form Field */
  }, [userAddresses, refreshUserAddresses, reset]);

  return (
    <>
      {isAddressModalShown && (
        <AddAddressModalContainer
          hideModal={() => setIsAddressModalShown(false)}
          onAddressAddedOrUpdatedCallback={refreshUserAddresses}
        />
      )}
      <div
        className={`flex flex-col gap-y-4 lg:flex-row lg:gap-x-4 ${
          isRTL ? "lg:flex-row-reverse" : ""
        }`}
      >
        <div className="flex flex-col lg:w-2/4 gap-2">
          <Text className="capitalize text-xl font-poppinsMedium">
            {t("selectAddress")}
          </Text>
          <Controller
            name="address"
            control={control}
            rules={{ required: t("addressIsRequired") }}
            render={({ field }) => (
              <RadioButtons
                items={addressRadioButtons}
                containerClassName="flex flex-col rounded h-[500px] lg:h-3/5 overflow-auto"
                radioButtonContainerClassName="mb-4 border border-grey shadow rounded p-2"
                {...field}
              />
            )}
          />

          <Button
            className="p-2 rounded-full shadow-lg w-fit self-center"
            onClickHandler={() => setIsAddressModalShown(true)}
          >
            <AddIcon className="w-8 h-8 text-black" />
          </Button>
        </div>

        <div className="lg:w-2/4 flex flex-col gap-y-8 lg:mt-8">
          <InvoiceAmountSummary
            total={userCart.cartTotal}
            discountedTotal={userCart.discountedTotal}
            currency={userCart.items[0]?.product?.currency || DEFAULT_CURRENCY}
          />

          <CouponCardList
            coupons={couponsAvailableToUser}
            className={`flex overflow-auto gap-x-2`}
            childContainerClassName="min-w-[300px] *:h-full"
          />
          {!userCart?.coupon?.couponCode ? (
            <form
              className={`flex flex-col gap-y-4 lg:flex-row lg:items-center lg:gap-x-8 ${
                isRTL ? "lg:flex-row-reverse" : ""
              }`}
              onSubmit={couponHandleSubmit(applyCouponCodeHandler)}
            >
              <div className="flex-1">
                <Input
                  placeholder={t("enterCouponCode")}
                  type="text"
                  className="placeholder:capitalize"
                  errorMessage={couponCodeErrors.couponCode?.message || ""}
                  {...couponCodeRegister("couponCode", {
                    required: t("codeIsRequired"),
                  })}
                />
              </div>
              <Button
                buttonType={ButtonTypes.primaryButton}
                type="submit"
                className="py-2 px-4 uppercase flex justify-center"
                onClickHandler={() => {}}
                isLoading={isUpdatingCouponInProgress}
              >
                <span>{t("applyCode")}</span>
              </Button>
            </form>
          ) : (
            <Button
              onClickHandler={removeCouponCodeHandler}
              isLoading={isUpdatingCouponInProgress}
              className="py-2 px-4 uppercase flex justify-center"
              buttonType={ButtonTypes.secondaryButton}
            >
              <span>{t("removeCouponCode")}</span>
            </Button>
          )}
          {!watchAddress("address") && (
            <ErrorMessage
              message={t("selectAddressToContinueToPayment")}
              errorIconClassName="w-4 h-4"
            />
          )}
          <Payment
            addressId={watchAddress("address")?._id}
            isDisabled={!watchAddress("address") ? true : false}
          />
        </div>
      </div>
    </>
  );
};

export default Checkout;
