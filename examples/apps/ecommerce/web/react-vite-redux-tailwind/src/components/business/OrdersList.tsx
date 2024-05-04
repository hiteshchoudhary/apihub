import { useTranslation } from "react-i18next";
import { OrderClass } from "../../services/order/OrderTypes";
import { useAppSelector } from "../../store";
import ErrorMessage from "../basic/ErrorMessage";
import OrderCard from "./OrderCard";

interface OrdersListProps {
  ordersList: Array<OrderClass>;
  orderClickHandler(order: OrderClass): void;
}
const OrdersList = (props: OrdersListProps) => {
  const { ordersList, orderClickHandler } = props;

  const { t } = useTranslation();

  const isRTL = useAppSelector((state) => state.language.isRTL);
  return (
    <>
      {!ordersList?.length ? (
        <ErrorMessage
          message={t("noOrdersFound")}
          className="justify-center text-xl"
        />
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {ordersList?.map((order) => (
            <div key={order._id}>
              <OrderCard
                order={order}
                className="h-full"
                orderClickHandler={orderClickHandler}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default OrdersList;
