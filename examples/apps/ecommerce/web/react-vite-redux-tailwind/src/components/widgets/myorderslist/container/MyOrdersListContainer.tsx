import { useCallback, useEffect, useState } from "react";
import ProfileService from "../../../../services/profile/ProfileService";
import { OrderClass } from "../../../../services/order/OrderTypes";
import ApiError from "../../../../services/ApiError";
import MyOrdersList from "../presentation/MyOrdersList";
import useCustomNavigate from "../../../../hooks/useCustomNavigate";
import {
  DATE_TIME_FORMATS,
  OrderListFilterFields,
  QUERY_PARAMS,
  ROUTE_PATHS,
} from "../../../../constants";
import { createSearchParams } from "react-router-dom";
import {
  checkIfDateIsInRange,
  convertUTCToLocalTime,
  formatDateFromDateObject,
} from "../../../../utils/dateTimeHelper";

const MyOrdersListContainer = () => {
  const navigate = useCustomNavigate();

  const [ordersList, setOrdersList] = useState<Array<OrderClass>>([]);
  const [displayedOrdersList, setDisplayedOrdersList] = useState<
    Array<OrderClass>
  >([]);

  /* To store filters applied if any */
  const [filters, setFilters] = useState<OrderListFilterFields>();

  const [errorFetchingOrders, setErrorFetchingOrders] = useState(false);

  const fetchMyOrders = useCallback(async () => {
    setErrorFetchingOrders(false);
    ProfileService.getUsersOrdersAsync(
      (orders: Array<OrderClass>, _: boolean, error?: ApiError) => {
        if (!error) {
          orders = orders.filter((order) => order.isPaymentDone);
          setOrdersList((prev) => [...prev, ...orders]);
        } else {
          console.error(
            "Error -- myorderslistcontainer, fetchMyOrders()",
            error
          );
          setErrorFetchingOrders(true);
        }
      }
    );
  }, []);

  /* On change of filters, updating the state */
  const filtersChangeHandler = (fields: OrderListFilterFields) => {
    setFilters(fields);
  };

  /* Navigate to /order?orderId=<orderId> on click of an order */
  const orderClickHandler = (order: OrderClass) => {
    navigate({
      pathname: ROUTE_PATHS.orderDetail,
      search: createSearchParams({
        [QUERY_PARAMS.orderId]: order._id,
      }).toString(),
    });
  };

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  /* On change of filters or main orders list */
  useEffect(() => {
    /* If no filters are applied, displayed list will be the entire ordersList */
    if (!filters) {
      setDisplayedOrdersList(ordersList);
    } else {
      /* Filter from ordersList */
      const filteredOrders = ordersList.filter((order) => {

        /* Flag to know whether the order was created in the date range selected by the user */
        let isInDateRange = false;

        /* If date range filter is not selected, setting the flag to true */
        if (!filters?.dateRange || !filters?.dateRange?.from || !filters?.dateRange?.to) {
          isInDateRange = true;
        } else if (
          filters?.dateRange &&
          filters?.dateRange?.from &&
          filters?.dateRange?.to
        ) {
          /* Start date & end date selected by user in YYYY-MM-DD format */
          const startDate = formatDateFromDateObject(
            filters.dateRange.from,
            DATE_TIME_FORMATS.standardDate
          );
          const endDate = formatDateFromDateObject(
            filters.dateRange.to,
            DATE_TIME_FORMATS.standardDate
          );

          /* Order created at in local time, formatted to YYYY-MM-DD */
          const orderDateInLocalTime = convertUTCToLocalTime(order.createdAt, DATE_TIME_FORMATS.standardDate);

          /* Checking if the created at date is in between start and end dates */
          if (
            checkIfDateIsInRange(
              orderDateInLocalTime,
              startDate,
              endDate,
              DATE_TIME_FORMATS.standardDate
            )
          ) {
            /* Set flag to true */
            isInDateRange = true;
          }
        }

        /* Checking if the order matches one of the selected statuses  */
        const isCorrectStatus = filters?.checkedStatus.find(
          (status) => status.id === order.status
        )
          ? true
          : false;

        /* If both filters match return true, else return false */
        if (isCorrectStatus && isInDateRange) {
          return true;
        }
        return false;
      });

      /* Setting the filtered orders list */
      setDisplayedOrdersList(filteredOrders);
    }
  }, [filters, ordersList]);

  return (
    <>
      <MyOrdersList
        ordersList={displayedOrdersList}
        isError={errorFetchingOrders}
        orderClickHandler={orderClickHandler}
        filtersChangeHandler={filtersChangeHandler}
      />
    </>
  );
};

export default MyOrdersListContainer;
