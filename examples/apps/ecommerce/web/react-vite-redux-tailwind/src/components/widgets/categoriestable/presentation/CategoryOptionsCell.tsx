import { CustomCellRendererProps } from "ag-grid-react";
import { Category } from "../../../../services/category/CategoryTypes";
import Button from "../../../basic/Button";
import DeleteIcon from "../../../icons/DeleteIcon";
import EditIcon from "../../../icons/EditIcon";

interface CategoryOptionsCellProps extends CustomCellRendererProps {
  onEditOrDeleteClickHandler(category: Category, type: "DELETE" | "EDIT"): void;
}
/* For options cell for a particular category in the Category Table */
const CategoryOptionsCell = (props: CategoryOptionsCellProps) => {
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

export default CategoryOptionsCell;
