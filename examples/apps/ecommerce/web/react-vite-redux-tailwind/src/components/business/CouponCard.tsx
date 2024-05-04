import { useTranslation } from "react-i18next";
import { CouponClass } from "../../services/coupon/CouponTypes";

interface CouponCardProps {
  coupon: CouponClass;
  className?: string;
}
const CouponCard = (props: CouponCardProps) => {
  const { coupon, className = '' } = props;

  const { t } = useTranslation();
  return (
    <div className={`flex flex-col p-4 border border-grey shadow-sm rounded ${className}`}>
      <span className="capitalize">{`${t("use")} ${t("code")} ${coupon.couponCode}`}</span>
      <span className="capitalize">{`${t("toGet")} ${coupon.discountValue} ${t("off")}, ${t("minimumPurchaseOf")} ${coupon.minimumCartValue}`}</span>
    </div>
  );
};

export default CouponCard;
