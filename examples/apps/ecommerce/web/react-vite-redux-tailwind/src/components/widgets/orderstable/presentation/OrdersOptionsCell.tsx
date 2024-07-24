import { CustomCellRendererProps } from "ag-grid-react";
import { OrderClass } from "../../../../services/order/OrderTypes";
import Button from "../../../basic/Button";
import EditIcon from "../../../icons/EditIcon";

interface OrdersOptionsCellProps extends CustomCellRendererProps {
  onEditClickHandler(order: OrderClass): void;
}
/* For options cell for a particular order */
const OrdersOptionsCell = (props: OrdersOptionsCellProps) => {
  return (
    <>
      <div className="flex h-full gap-x-2 justify-end w-fit">
        <Button
          onClickHandler={() => {
            props.onEditClickHandler(props.data);
          }}
        >
          <EditIcon className="w-4 h-4" />
        </Button>
      </div>
    </>
  );
};

export default OrdersOptionsCell;
