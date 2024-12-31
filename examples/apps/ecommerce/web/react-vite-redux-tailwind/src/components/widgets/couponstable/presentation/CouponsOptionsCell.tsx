import { CustomCellRendererProps } from "ag-grid-react";
import { CouponClass } from "../../../../services/coupon/CouponTypes";
import Button from "../../../basic/Button";
import DeleteIcon from "../../../icons/DeleteIcon";
import EditIcon from "../../../icons/EditIcon";

interface CouponsOptionsCellProps extends CustomCellRendererProps {
  onEditOrDeleteClickHandler(coupon: CouponClass, type: "DELETE" | "EDIT"): void;
}
/* For options cell for a particular coupon */
const CouponsOptionsCell = (props: CouponsOptionsCellProps) => {
  return (
    <>
      <div className="flex h-full gap-x-2 justify-end w-fit">
        <Button
          onClickHandler={() => {
            props.onEditOrDeleteClickHandler(props.data, "EDIT");
          }}
        >
          <EditIcon className="w-4 h-4" />
        </Button>
        <Button
          onClickHandler={() => {
            props.onEditOrDeleteClickHandler(props.data, "DELETE");
          }}
        >
          <DeleteIcon className="w-4 h-4" />
        </Button>
      </div>
    </>
  );
};

export default CouponsOptionsCell;
