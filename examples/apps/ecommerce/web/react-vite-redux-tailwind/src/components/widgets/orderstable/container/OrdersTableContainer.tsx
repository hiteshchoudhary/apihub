import { useCallback, useEffect, useState } from "react";
import { DATE_TIME_FORMATS } from "../../../../constants";
import { ORDER_STATUS } from "../../../../data/applicationData";
import OrderService from "../../../../services/order/OrderService";
import { OrderClass } from "../../../../services/order/OrderTypes";
import {
    convertUTCToLocalTime,
    formatDateTime,
} from "../../../../utils/dateTimeHelper";
import OrdersTable from "../presentation/OrdersTable";

const OrdersTableContainer = () => {

  /* 
  Flag for whether orders are being fetched 
  (To show loading spinner until the first response come) 
  */
  const [isFetchingOrders, setIsFetchingOrders] = useState(true);

  /* Key value orders object, key is id and value is the order */
  const [orders, setOrders] = useState<{ [key: string]: OrderClass }>({});

  /* To know if an error has occurred when fetching orders */
  const [isError, setIsError] = useState(false);

  const formatOrder = (order: OrderClass) => {
    /* Cloning the object, so the original object doesn't get updated */
    order = { ...order };

    /* Converting createdAt and updatedAt to local and formatting them */
    order.createdAt = formatDateTime(
      convertUTCToLocalTime(
        order.createdAt,
        DATE_TIME_FORMATS.standardDateWithTime
      ),
      DATE_TIME_FORMATS.standardDateWithTime,
      DATE_TIME_FORMATS.displayedDateWithTime
    );
    order.updatedAt = formatDateTime(
      convertUTCToLocalTime(
        order.updatedAt,
        DATE_TIME_FORMATS.standardDateWithTime
      ),
      DATE_TIME_FORMATS.standardDateWithTime,
      DATE_TIME_FORMATS.displayedDateWithTime
    );

    return order;
  };

  /* Fetch Orders Asynchronously */
  const fetchOrders = useCallback((status: ORDER_STATUS) => {
    setOrders({});
    setIsFetchingOrders(true);
    OrderService.getOrdersAsync(status, (data, _, error) => {
      if (!error) {
        setOrders((prev) => {
          data.map((order) => {
            /* Formatting order */
            order = formatOrder(order);

            /* At key: Order ID, value is the order object */
            prev[order._id] = order;
          });
          return { ...prev };
        });
        setIsFetchingOrders(false);
      } else {
        console.error("Error -- fetchOrders() Admin", error);
        setIsFetchingOrders(false);
        setIsError(true);
      }
    });
  }, []);


  /* Once a order status has been updated */
  const onOrderStatusUpdatedHandler = (
    orderId: string,
    _: ORDER_STATUS
  ) => {
    /* Update order object at the orderId */
    setOrders((prev) => {
      delete prev[orderId]
      return { ...prev };
    });
  };

  /* Initial Render */
  useEffect(() => {
    fetchOrders(ORDER_STATUS.PENDING);
  }, [fetchOrders]);

  return (
    <>
      <OrdersTable
        orders={isFetchingOrders ? null : Object.values(orders)}
        isError={isError}
        onOrderStatusUpdatedHandler={onOrderStatusUpdatedHandler}
        fetchOrders={fetchOrders}
      />
    </>
  );
};

export default OrdersTableContainer;
