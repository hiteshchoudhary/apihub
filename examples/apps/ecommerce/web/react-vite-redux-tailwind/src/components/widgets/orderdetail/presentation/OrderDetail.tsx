import { useTranslation } from "react-i18next";
import { OrderDetailClass } from "../../../../services/order/OrderTypes";
import ErrorMessage from "../../../basic/ErrorMessage";
import OrderItemList from "../../../business/OrderItemList";
import OrderSummary from "../../../business/OrderSummary";
import { useAppSelector } from "../../../../store";

interface OrderDetailProps {
  order: OrderDetailClass;
  isError: boolean;
}
const OrderDetail = (props: OrderDetailProps) => {
  const { order, isError } = props;

  const { t } = useTranslation();
  const isRTL = useAppSelector((state) => state.language.isRTL);
  return (
    <div>
      {isError ? (
        <ErrorMessage
          message={t("failedToFetchInformation")}
          errorIconClassName="w-4 h-4"
        />
      ) : (
        <div className={`flex flex-col relative lg:flex-row lg:gap-x-4 ${isRTL ? 'lg:flex-row-reverse': ''}`}>
          <div className="overflow-auto h-96 lg:h-auto lg:flex-1">
            <OrderItemList itemList={order.order.items} />
          </div>
          <div className="lg:w-1/3">
            <OrderSummary orderDetail={order} className="lg:sticky top-28"/>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
