import { ColDef } from "ag-grid-community";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  RADIO_BUTTON_TYPE
} from "../../../../constants";
import { ORDER_STATUS } from "../../../../data/applicationData";
import { OrderClass } from "../../../../services/order/OrderTypes";
import { useAppSelector } from "../../../../store";
import {
  gridDateFilterComparator,
  gridDateSortComparator,
} from "../../../../utils/dateTimeHelper";
import ErrorMessage from "../../../basic/ErrorMessage";
import Grid from "../../../basic/Grid";
import RadioButtons from "../../../basic/RadioButtons";
import EditOrderStatusModalContainer from "../../../modals/editorderstatusmodal/container/EditOrderStatusModalContainer";
import OrderLinkCell from "./OrderLinkCell";
import OrdersOptionsCell from "./OrdersOptionsCell";

interface OrdersTableProps {
  orders: OrderClass[] | null;
  isError: boolean;
  onOrderStatusUpdatedHandler(orderId: string, status: ORDER_STATUS): void;
  fetchOrders(status: ORDER_STATUS): void;
}
const OrdersTable = (props: OrdersTableProps) => {
  const { orders, onOrderStatusUpdatedHandler, fetchOrders, isError } = props;

  const { t } = useTranslation();

  const isRTL = useAppSelector((state) => state.language.isRTL);

  /* Visibility of Edit Order dialog */
  const [isEditOrderModalShown, setIsEditOrderModalShown] = useState(false);

  /* Order status of the orders which are visibile */
  const [selectedOrderStatus, setSelectedOrderStatus] = useState(
    ORDER_STATUS.PENDING
  );

  /* Selected order for edit operation*/
  const [selectedOrder, setSelectedOrder] = useState<OrderClass>();

  /* Column Defination for the grid */
  const ORDERS_TABLE_COL_DEFS: ColDef[] = [
    {
      field: "_id",
      sortable: false,
      filter: "agTextColumnFilter",
      cellRenderer: OrderLinkCell,
      filterParams: {
        maxNumConditions: 1,
        filterOptions: ["contains"],
      },
    },
    {
      field: "customer.username",
      sortable: false,
      filter: "agTextColumnFilter",
      filterParams: {
        maxNumConditions: 1,
        filterOptions: ["contains"],
      },
    },
    {
      field: "customer.email",
      sortable: false,
      filter: "agTextColumnFilter",
      filterParams: {
        maxNumConditions: 1,
        filterOptions: ["contains"],
      },
    },
    {
      field: "createdAt",
      unSortIcon: true,
      comparator: gridDateSortComparator,
      filter: "agDateColumnFilter",
      filterParams: {
        suppressAndOrCondition: true,
        filterOptions: ["equals"],
        comparator: gridDateFilterComparator,
      },
    },
    {
      field: "updatedAt",
      unSortIcon: true,
      comparator: gridDateSortComparator,
      filter: "agDateColumnFilter",
      filterParams: {
        suppressAndOrCondition: true,
        filterOptions: ["equals"],
        comparator: gridDateFilterComparator,
      },
    },
    {
      field: "discountedOrderPrice",
      sortable: true,
    },
    {
      field: "paymentId",
      sortable: false,
      filter: "agTextColumnFilter",
      filterParams: {
        maxNumConditions: 1,
        filterOptions: ["contains"],
      },
    },
    {
      field: "",
      maxWidth: 100,
      resizable: false,
      hide: selectedOrderStatus !== ORDER_STATUS.PENDING,
      cellRenderer: OrdersOptionsCell,
      cellRendererParams: {
        onEditClickHandler: toggleEditOrderModal,
      },
      pinned: isRTL ? "left" : "right",
    },
  ];

  const orderStatusRadioButtons: Array<RADIO_BUTTON_TYPE<ORDER_STATUS>> =
    useMemo(() => {
      return [
        {
          label: t("pending"),
          isDefaultSelected: true,
          data: ORDER_STATUS.PENDING,
          id: ORDER_STATUS.PENDING,
        },
        {
          label: t("cancelled"),
          isDefaultSelected: false,
          data: ORDER_STATUS.CANCELLED,
          id: ORDER_STATUS.CANCELLED,
        },
        {
          label: t("delivered"),
          isDefaultSelected: false,
          data: ORDER_STATUS.DELIVERED,
          id: ORDER_STATUS.DELIVERED,
        },
      ];
    }, [t]);

  /* On order type changed */
  const onOrderTypeChangeHandler = (status: ORDER_STATUS) => {
    /* If the previous status is not equal to the new status */
    if (status !== selectedOrderStatus) {
      /* Set selected order status */
      setSelectedOrderStatus(status);

      /* Fetch orders of the particular status */
      fetchOrders(status);
    }
  };

  /* Toggle Edit Order Dialog */
  function toggleEditOrderModal(order: OrderClass) {
    /* If there is no selected order: Toggle is to show the dialog */
    if (!selectedOrder && order) {
      /* Set selected order */
      setSelectedOrder(order);
    } else {
      /* Set order to undefined */
      setSelectedOrder(undefined);
    }
    /* Toggle the dialog */
    setIsEditOrderModalShown((prev) => !prev);
  }

  return (
    <>
      {isError ? (
        <ErrorMessage
          message={t("pleaseTryAgainLater")}
          errorIconClassName="w-6 h-6"
          className="justify-center text-lg"
        />
      ) : (
        <>
          {isEditOrderModalShown && selectedOrder && (
            <EditOrderStatusModalContainer
              hideModal={() => toggleEditOrderModal(selectedOrder)}
              order={selectedOrder}
              onOrderStatusUpdatedHandler={onOrderStatusUpdatedHandler}
            />
          )}
          <div
            className="h-full flex flex-col gap-y-4"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <RadioButtons
              items={orderStatusRadioButtons}
              onChange={onOrderTypeChangeHandler}
              containerClassName="flex gap-x-2"
              radioButtonClassName="w-5 checked:border-[2.5px]"
              radioButtonContainerClassName="capitalize"
            />
            <Grid
              rowData={orders}
              columnDefination={ORDERS_TABLE_COL_DEFS}
              autoSizeStrategy={{
                type: "fitCellContents",
              }}
              autoSizeAllColumnsAfterDataUpdate={true}
            />
          </div>
        </>
      )}
    </>
  );
};

export default OrdersTable;
