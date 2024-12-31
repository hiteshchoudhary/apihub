import { useTranslation } from "react-i18next";
import { CouponClass } from "../../../../services/coupon/CouponTypes";
import Modal from "../../../basic/Modal";
import Text from "../../../basic/Text";

interface ChangeCouponStatusModalProps {
  hideModal(): void;
  coupon: CouponClass;
  changeStatusHandler(): void;
  isLoading?: boolean;
}
const ChangeCouponStatusModal = (props: ChangeCouponStatusModalProps) => {
  const { hideModal, coupon, changeStatusHandler, isLoading = false } = props;

  const { t } = useTranslation();

  return (
    <Modal
      heading={t("changeCouponStatus")}
      className="px-8 py-6 w-[95%] lg:w-1/3"
      primaryButtonText={t("yes")}
      primaryButtonClassname="uppercase"
      secondaryButtonText={t("cancel")}
      secondaryButtonClassname="uppercase"
      secondaryButtonHandler={hideModal}
      primaryButtonHandler={changeStatusHandler}
      isPrimaryButtonLoading={isLoading}
    >
      <div className="flex flex-col items-center gap-y-4  ">
        <Text className="capitalize text-center">
          {t("areYouSureYouWantToChangeCouponStatusTo")}
        </Text>
        <Text className="bg-darkRed text-zinc-50 rounded px-4 py-1 uppercase">
          {coupon.isActive ? t("active") : t("inactive")}
        </Text>
      </div>
    </Modal>
  );
};

export default ChangeCouponStatusModal;
