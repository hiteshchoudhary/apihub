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
import { Category } from "../../../../services/category/CategoryTypes";
import { useAppSelector } from "../../../../store";
import {
  gridDateFilterComparator,
  gridDateSortComparator,
} from "../../../../utils/dateTimeHelper";
import Button from "../../../basic/Button";
import ErrorMessage from "../../../basic/ErrorMessage";
import Grid from "../../../basic/Grid";
import AddEditCategoryModalContainer from "../../../modals/addeditcategorymodal/container/AddEditCategoryModalContainer";
import DeleteCategoryModalContainer from "../../../modals/deletecategorymodal/container/DeleteCategoryModalContainer";
import CategoryOptionsCell from "./CategoryOptionsCell";

interface CategoriesTableProps {
  categories: Category[] | null;
  isError: boolean;
  onCategoryAddedOrUpdatedHandler(newCategory: Category): void;
  onCategoryDeletedHandler(deletedCategory: Category): void;
}
const CategoriesTable = (props: CategoriesTableProps) => {
  const {
    categories,
    onCategoryAddedOrUpdatedHandler,
    onCategoryDeletedHandler,
    isError,
  } = props;

  const { t } = useTranslation();

  const isRTL = useAppSelector((state) => state.language.isRTL);

  /* Is large screen */
  const isLG = useBreakpointCheck(BREAKPOINTS.lg);

  /* Column Defination for the grid */
  const CATEGORIES_TABLE_COL_DEFS: ColDef[] = [
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
      field: "",
      maxWidth: 100,
      resizable: false,
      cellRenderer: CategoryOptionsCell,
      cellRendererParams: {
        onEditOrDeleteClickHandler: toggleEditOrDeleteCategoryModal,
      },
      pinned: !isLG ? (isRTL ? "left" : "right") : false,
    },
  ];

  /* Visibility of AddEdit Category dialog */
  const [isAddEditCategoryModalShown, setIsAddEditCategoryModalShown] =
    useState(false);

  /* Visibility of Delete Category dialog */
  const [isDeleteCategoryModalShown, setIsDeleteCategoryModalShown] =
    useState(false);

  /* Selected category for edit & delete options on a category */
  const [selectedCategory, setSelectedCategory] = useState<Category>();

  /* Toggle Add Category Dialog */
  const toggleAddCategoryModal = () => {
    /* Reset selected category */
    setSelectedCategory(undefined);
    setIsAddEditCategoryModalShown((prev) => !prev);
  };

  /* Toggle Edit or Delete Category Dialog */
  function toggleEditOrDeleteCategoryModal(
    category: Category,
    type: "EDIT" | "DELETE"
  ) {
    /* If there is no selected category: Toggle is to show the dialog */
    if (!selectedCategory && category) {
      /* Set selected category */
      setSelectedCategory(category);
    } else {
      /* Set category to undefined */
      setSelectedCategory(undefined);
    }
    /* Toggle the dialog */
    if (type === "EDIT") {
      setIsAddEditCategoryModalShown((prev) => !prev);
    } else {
      setIsDeleteCategoryModalShown((prev) => !prev);
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
          {isAddEditCategoryModalShown && (
            <AddEditCategoryModalContainer
              hideModal={toggleAddCategoryModal}
              category={selectedCategory ? selectedCategory : undefined}
              onCategoryAddedOrUpdatedHandler={(category) =>
                onCategoryAddedOrUpdatedHandler(category)
              }
            />
          )}
          {isDeleteCategoryModalShown && selectedCategory && (
            <DeleteCategoryModalContainer
              hideModal={() =>
                toggleEditOrDeleteCategoryModal(selectedCategory, "DELETE")
              }
              category={selectedCategory}
              onCategoryDeleted={(deletedCategory) => {
                onCategoryDeletedHandler(deletedCategory);
              }}
            />
          )}
          <div
            className="h-full flex flex-col gap-y-4"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <Button
              buttonType={ButtonTypes.primaryButton}
              onClickHandler={toggleAddCategoryModal}
              className="capitalize px-8 py-1 w-fit self-end"
            >
              <span>{t("addCategory")}</span>
            </Button>
            <Grid
              rowData={categories}
              columnDefination={CATEGORIES_TABLE_COL_DEFS}
              autoSizeStrategy={autoSizeStrategy}
            />
          </div>
        </>
      )}
    </>
  );
};

export default CategoriesTable;
