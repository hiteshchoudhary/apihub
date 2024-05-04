import { useTranslation } from "react-i18next";
import { OrderListFilterFields } from "../../../../constants";
import { OrderClass } from "../../../../services/order/OrderTypes";
import ErrorMessage from "../../../basic/ErrorMessage";
import OrderListFilters from "../../../business/OrderListFilters";
import OrdersList from "../../../business/OrdersList";

interface MyOrdersListProps {
  ordersList: Array<OrderClass>;
  orderClickHandler(order: OrderClass): void;
  isError: boolean;
  filtersChangeHandler(fields: OrderListFilterFields): void;
}
const MyOrdersList = (props: MyOrdersListProps) => {
  const { ordersList, isError = false, orderClickHandler, filtersChangeHandler } = props;

  const { t } = useTranslation();
  return (
    <>
      {isError ? (
        <ErrorMessage
          message={t("failedToFetchInformation")}
          className="justify-center"
        />
      ) : (
        <div className="flex flex-col gap-y-4">
          <OrderListFilters orderFiltersSubmitHandler={filtersChangeHandler}/>
          <OrdersList
            ordersList={ordersList}
            orderClickHandler={orderClickHandler}
          />
        </div>
      )}
    </>
  );
};

export default MyOrdersList;
