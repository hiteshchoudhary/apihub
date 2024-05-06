import { CustomCellRendererProps } from "ag-grid-react";
import { Product } from "../../../../services/product/ProductTypes";
import Button from "../../../basic/Button";
import DeleteIcon from "../../../icons/DeleteIcon";
import EditIcon from "../../../icons/EditIcon";

interface ProductOptionsCellProps extends CustomCellRendererProps {
  onEditOrDeleteClickHandler(product: Product, type: "DELETE" | "EDIT"): void;
}
/* For options cell for a particular product in the Products Table */
const ProductOptionsCell = (props: ProductOptionsCellProps) => {
  return (
    <>
      <div className="flex h-full gap-x-2 justify-end">
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

export default ProductOptionsCell;
