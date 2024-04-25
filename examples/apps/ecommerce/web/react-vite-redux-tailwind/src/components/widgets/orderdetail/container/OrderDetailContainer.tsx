import { useCallback, useEffect, useState } from "react";
import OrderService from "../../../../services/order/OrderService";
import { OrderDetailClass } from "../../../../services/order/OrderTypes";
import ApiError from "../../../../services/ApiError";
import OrderDetail from "../presentation/OrderDetail";

interface OrderDetailContainerProps {
  orderId: string;
}
const OrderDetailContainer = ({ orderId }: OrderDetailContainerProps) => {
  const [order, setOrder] = useState<OrderDetailClass>();
  const [isError, setIsError] = useState(false);

  const fetchOrder = useCallback(async () => {
    const response = await OrderService.getOrderDetail(orderId);

    if (!(response instanceof ApiError)) {
      setOrder(response);
    } else {
      /* Error fetching order */
      setIsError(true);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return <>{order && <OrderDetail order={order} isError={isError} />}</>;
};

export default OrderDetailContainer;
