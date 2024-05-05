import { useTranslation } from "react-i18next";
import { OrderDetailClass } from "../../services/order/OrderTypes";
import Text from "../basic/Text";
import InvoiceAmountSummary from "./InvoiceAmountSummary";
import { DEFAULT_CURRENCY } from "../../data/applicationData";

interface OrderSummaryProps {
  orderDetail: OrderDetailClass;
  className?: string;
}
const OrderSummary = (props: OrderSummaryProps) => {
  const { orderDetail, className = "" } = props;

  const { t } = useTranslation();

  return (
    <div
      className={`flex flex-col lg:border lg:border-grey p-4 rounded-md ${className}`}
    >
      <Text className="font-poppinsMedium text-xl tracking-wider capitalize mb-4">
        {t("summary")}
      </Text>
      <InvoiceAmountSummary
        total={orderDetail.order.orderPrice}
        discountedTotal={orderDetail.order.discountedOrderPrice}
        currency={
          orderDetail.order.items[0].product?.currency || DEFAULT_CURRENCY
        }
        className="mb-4"
      />
    </div>
  );
};

export default OrderSummary;
