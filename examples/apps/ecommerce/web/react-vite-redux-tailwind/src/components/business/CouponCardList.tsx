import { CouponClass } from "../../services/coupon/CouponTypes";
import { useAppSelector } from "../../store";
import CouponCard from "./CouponCard";

interface CouponCardListProps {
  coupons: Array<CouponClass>;
  className?: string;
  childContainerClassName?: string;
}
const CouponCardList = (props: CouponCardListProps) => {
  const { coupons, className = "", childContainerClassName = "" } = props;

  const isRTL = useAppSelector(state => state.language.isRTL);
  return (
    <>
      {coupons.length ? (
        <div className={`${className}`} dir={isRTL ? 'rtl': 'ltr'}>
          {coupons.map((coupon) => (
            <CouponCard
              coupon={coupon}
              key={coupon._id}
              className={childContainerClassName}
            />
          ))}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default CouponCardList;
