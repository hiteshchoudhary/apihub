import { useTranslation } from "react-i18next";
import { CouponClass } from "../../../../services/coupon/CouponTypes";
import Modal from "../../../basic/Modal";
import Text from "../../../basic/Text";

interface DeleteCouponModalProps {
  coupon: CouponClass;
  deleteCouponHandler(): void;
  isLoading?: boolean;
  cancelButtonHandler(): void;
}
const DeleteCouponModal = (props: DeleteCouponModalProps) => {
  const { coupon, deleteCouponHandler, isLoading, cancelButtonHandler } = props;

  const { t } = useTranslation();
  return (
    <Modal
      heading={t("deleteCoupon")}
      className="px-8 py-6 w-[95%] lg:w-1/3"
      primaryButtonText={t("yes")}
      primaryButtonClassname="uppercase"
      secondaryButtonText={t("cancel")}
      secondaryButtonClassname="uppercase"
      secondaryButtonHandler={cancelButtonHandler}
      primaryButtonHandler={deleteCouponHandler}
      isPrimaryButtonLoading={isLoading}
    >
      <div className="flex flex-col items-center gap-y-4">
        <Text className="capitalize">
          {t("areYouSureYouWantToDeleteTheCoupon")}
        </Text>
        <Text className="bg-darkRed text-zinc-50 rounded px-4 py-1">
          {coupon.name}
        </Text>
      </div>
    </Modal>
  );
};

export default DeleteCouponModal;
