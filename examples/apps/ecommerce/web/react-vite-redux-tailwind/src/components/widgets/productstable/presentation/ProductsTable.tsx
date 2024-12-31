import {
  ColDef,
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
} from "ag-grid-community";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BREAKPOINTS, ButtonTypes } from "../../../../constants";
import useBreakpointCheck from "../../../../hooks/useBreakpointCheck";
import { Product } from "../../../../services/product/ProductTypes";
import { useAppSelector } from "../../../../store";
import Button from "../../../basic/Button";
import ErrorMessage from "../../../basic/ErrorMessage";
import Grid from "../../../basic/Grid";
import { ProductWithCategoryName } from "../container/ProductsTableContainer";
import ProductOptionsCell from "./ProductOptionsCell";
import AddEditProductModalContainer from "../../../modals/addeditproductmodal/container/AddEditProductModalContainer";
import DeleteProductModalContainer from "../../../modals/deleteproductmodal/container/DeleteProductModalContainer";

interface ProductsTableProps {
  products: ProductWithCategoryName[] | null;
  isError: boolean;
  onProductAddedOrUpdated(newProduct: Product): void;
  onProductDeletedHandler(deletedProduct: Product): void;
}
const ProductsTable = (props: ProductsTableProps) => {
  const {
    products,
    onProductAddedOrUpdated,
    onProductDeletedHandler,
    isError,
  } = props;

  const { t } = useTranslation();

  const isRTL = useAppSelector((state) => state.language.isRTL);

  
  /* Is large screen */
  const isLG = useBreakpointCheck(BREAKPOINTS.lg);

  /* Column Defination for the grid */
  const PRODUCTS_TABLE_COL_DEFS: ColDef[] = [
    {
      field: "name",
      sortable: false,
      filter: "agTextColumnFilter",
      filterParams: {
        maxNumConditions: 1,
        filterOptions: ["contains"],
      },
    },
    {
      field: "categoryName",
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        maxNumConditions: 1,
        filterOptions: ["contains"],
      },
    },
    {
      field: "description",
      sortable: false,
      tooltipField: "description",
    },
    {
      field: "price",
      sortable: true,
    },
    {
      field: "stock",
      sortable: true,
    },
    {
      field: "",
      maxWidth: 100,
      resizable: false,
      cellRenderer: ProductOptionsCell,
      cellRendererParams: {
        onEditOrDeleteClickHandler: toggleEditOrDeleteProductModal,
      },
      pinned: !isLG ? (isRTL ? 'left' : 'right') : false
    },
  ];


  /* Visibility of AddEdit Product dialog */
  const [isAddEditProdutModalShown, setIsAddEditProductModalShown] =
    useState(false);

  /* Visibility of Delete Product dialog */
  const [isDeleteProductModalShown, setIsDeleteProductModalShown] =
    useState(false);

  /* Selected product for edit & delete options */
  const [selectedProduct, setSelectedProduct] = useState<Product>();

  /* Toggle Add Product Dialog */
  const toggleAddProductModal = () => {
    /* Reset selected product */
    setSelectedProduct(undefined);
    setIsAddEditProductModalShown((prev) => !prev);
  };

  /* Toggle Edit or Delete Product Dialog */
  function toggleEditOrDeleteProductModal(
    product: Product,
    type: "EDIT" | "DELETE"
  ) {
    /* If there is no product: Toggle is to show the dialog */
    if (!selectedProduct && product) {
      /* Set selected product */
      setSelectedProduct(product);
    } else {
      /* Set product to undefined */
      setSelectedProduct(undefined);
    }
    /* Toggle the dialog */
    if (type === "EDIT") {
      setIsAddEditProductModalShown((prev) => !prev);
    } else {
      setIsDeleteProductModalShown((prev) => !prev);
    }
  }

  /* 
    On Large screens fit the entire width, on smaller screens fit the contents of a cell 
    */
  const autoSizeStrategy:
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy = useMemo(() => {
    if (isLG) {
      return {
        type: "fitGridWidth",
      };
    }
    return {
      type: "fitCellContents",
    };
  }, [isLG]);

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
          {isAddEditProdutModalShown && (
            <AddEditProductModalContainer
              hideModal={toggleAddProductModal}
              product={selectedProduct}
              onProductAddedOrUpdated={onProductAddedOrUpdated}
            />
          )}
          {isDeleteProductModalShown && selectedProduct && (
            <DeleteProductModalContainer
              hideModal={() =>
                toggleEditOrDeleteProductModal(selectedProduct, "DELETE")
              }
              onProductDeleted={onProductDeletedHandler}
              product={selectedProduct}
            />
          )}
          <div
            className="h-full flex flex-col gap-y-4"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <Button
              buttonType={ButtonTypes.primaryButton}
              onClickHandler={toggleAddProductModal}
              className="capitalize px-8 py-1 w-fit self-end"
            >
              <span>{t("addProduct")}</span>
            </Button>
            <Grid
              rowData={products}
              columnDefination={PRODUCTS_TABLE_COL_DEFS}
              autoSizeStrategy={autoSizeStrategy}
            />
          </div>
        </>
      )}
    </>
  );
};

export default ProductsTable;
