import { useMemo } from "react";
import { OrderClass } from "../../services/order/OrderTypes";
import { convertUTCToLocalTime, formatDateTime } from "../../utils/dateTimeHelper";
import { DATE_TIME_FORMATS } from "../../constants";
import { capitalizeSentence, formatAmount } from "../../utils/commonHelper";
import { DEFAULT_CURRENCY } from "../../data/applicationData";
import { useAppSelector } from "../../store";
import { useTranslation } from "react-i18next";
import Button from "../basic/Button";

interface OrderCardProps {
  order: OrderClass;
  className?: string;
  orderClickHandler(order: OrderClass): void;
}
const OrderCard = (props: OrderCardProps) => {
  const { order, className = "", orderClickHandler } = props;

  const { t } = useTranslation();

  const isRTL = useAppSelector((state) => state.language.isRTL);

  const displayedOrderDate = useMemo(() => {
    const orderDateInLocalTime = convertUTCToLocalTime(order.createdAt, DATE_TIME_FORMATS.standardDateWithTime);
    
    return formatDateTime(
      orderDateInLocalTime,
      DATE_TIME_FORMATS.standardDateWithTime,
      DATE_TIME_FORMATS.displayedDateWithTime
    );
  }, [order]);

  const displayedOrderAddress = useMemo(() => {
    /* No address means address has been deleted by the user. */
    if (!order?.address) {
      return capitalizeSentence(t("addressDeleted"));
    }
    return `${order?.address?.addressLine1 || ""} ${order?.address?.addressLine2 || ""}, ${order?.address?.state || ""}, ${order?.address?.country || ""}`;
  }, [order, t]);

  return (
    <Button onClickHandler={() => orderClickHandler(order)} className="w-full">
      <div
        className={`flex flex-col p-4 rounded-md border border-grey shadow gap-y-4 ${className}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className={`flex justify-between items-center`}>
          <span className="text-sm">{displayedOrderDate}</span>
          <span className="font-semibold">{t(order.status.toLowerCase())}</span>
        </div>
        <span className=" text-ellipsis line-clamp-1 text-start">
          {displayedOrderAddress}
        </span>
        <span className={`text-darkRed font-semibold self-end`}>
          {formatAmount(order.discountedOrderPrice, DEFAULT_CURRENCY)}
        </span>
      </div>
    </Button>
  );
};

export default OrderCard;
