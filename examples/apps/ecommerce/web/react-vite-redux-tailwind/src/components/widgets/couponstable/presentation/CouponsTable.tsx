import {
  ColDef
} from "ag-grid-community";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ButtonTypes } from "../../../../constants";
import { CouponClass } from "../../../../services/coupon/CouponTypes";
import { useAppSelector } from "../../../../store";
import {
  gridDateFilterComparator,
  gridDateSortComparator,
} from "../../../../utils/dateTimeHelper";
import Button from "../../../basic/Button";
import ErrorMessage from "../../../basic/ErrorMessage";
import Grid from "../../../basic/Grid";
import AddEditCouponModalContainer from "../../../modals/addeditcouponmodal/container/AddEditCouponModalContainer";
import ChangeCouponStatusModalContainer from "../../../modals/changecouponstatusmodal/container/ChangeCouponStatusModalContainer";
import DeleteCouponModalContainer from "../../../modals/deletecouponmodal/container/DeleteCouponModalContainer";
import CouponsOptionsCell from "./CouponsOptionsCell";

interface CouponsTableProps {
  coupons: CouponClass[];
  isError: boolean;
  onCouponAddedOrUpdatedHandler(newCoupon: CouponClass): void;
  onCouponDeletedHandler(deletedCoupon: CouponClass): void;
  resetCouponStatusHandler(resetCoupon: CouponClass): void;
}
const CouponsTable = (props: CouponsTableProps) => {
  const {
    coupons,
    onCouponAddedOrUpdatedHandler,
    onCouponDeletedHandler,
    resetCouponStatusHandler,
    isError,
  } = props;

  const { t } = useTranslation();

  const isRTL = useAppSelector((state) => state.language.isRTL);

  const [couponStatusPropertiesState, setCouponStatusPropertiesState] =
    useState<{ isModalShown: boolean; coupon?: CouponClass }>({
      isModalShown: false,
      coupon: undefined,
    });

  /* Column Defination for the grid */
  const COUPONS_TABLE_COL_DEFS: ColDef[] = [
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
      field: "couponCode",
      sortable: false,
      filter: "agTextColumnFilter",
      filterParams: {
        maxNumConditions: 1,
        filterOptions: ["contains"],
      },
    },
    {
      field: "isActive",
      sortable: true,
      editable: true,
      onCellValueChanged: (event) => {
        setCouponStatusPropertiesState({
          isModalShown: true,
          coupon: event.data,
        });
      },
    },
    {
      field: "expiryDate",
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
      field: "minimumCartValue",
      sortable: true,
    },
    {
      field: "discountValue",
      sortable: true,
    },
    {
      field: "type",
      sortable: false,
    },
    {
      field: "startDate",
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
      cellRenderer: CouponsOptionsCell,
      cellRendererParams: {
        onEditOrDeleteClickHandler: toggleEditOrDeleteCouponModal,
      },
      pinned: isRTL ? 'left' : 'right'
    },
  ];

  /* Visibility of AddEdit Coupon dialog */
  const [isAddEditCouponModalShown, setIsAddEditCouponModalShown] =
    useState(false);

  /* Visibility of Delete Coupon dialog */
  const [isDeleteCouponModalShown, setIsDeleteCouponModalShown] =
    useState(false);

  /* Selected coupon for edit & delete options */
  const [selectedCoupon, setSelectedCoupon] = useState<CouponClass>();

  const toggleCouponStatusChangeModal = () => {
    setCouponStatusPropertiesState((prev) => {
      if (prev.isModalShown) {
        return { isModalShown: false, coupon: undefined };
      }
      return prev;
    });
  };

  /* Toggle Add Coupon Dialog */
  const toggleAddCouponModal = () => {
    /* Reset selected coupon */
    setSelectedCoupon(undefined);
    setIsAddEditCouponModalShown((prev) => !prev);
  };

  /* Toggle Edit or Delete Coupon Dialog */
  function toggleEditOrDeleteCouponModal(
    coupon: CouponClass,
    type: "EDIT" | "DELETE"
  ) {
    /* If there is no selected coupon: Toggle is to show the dialog */
    if (!selectedCoupon && coupon) {
      /* Set selected coupon */
      setSelectedCoupon(coupon);
    } else {
      /* Set coupon to undefined */
      setSelectedCoupon(undefined);
    }
    /* Toggle the dialog */
    if (type === "EDIT") {
      setIsAddEditCouponModalShown((prev) => !prev);
    } else {
      setIsDeleteCouponModalShown((prev) => !prev);
    }
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
          {isAddEditCouponModalShown && (
            <AddEditCouponModalContainer
              hideModal={toggleAddCouponModal}
              onCouponAddedOrEdited={onCouponAddedOrUpdatedHandler}
              coupon={selectedCoupon}
            />
          )}
          {isDeleteCouponModalShown && selectedCoupon && (
            <DeleteCouponModalContainer
              coupon={selectedCoupon}
              hideModal={() =>
                toggleEditOrDeleteCouponModal(selectedCoupon, "DELETE")
              }
              onCouponDeleted={onCouponDeletedHandler}
            />
          )}
          {couponStatusPropertiesState.isModalShown &&
            couponStatusPropertiesState.coupon && (
              <ChangeCouponStatusModalContainer
                coupon={couponStatusPropertiesState.coupon}
                resetCouponData={resetCouponStatusHandler}
                hideModal={toggleCouponStatusChangeModal}
              />
            )}
          <div
            className="h-full flex flex-col gap-y-4"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <Button
              buttonType={ButtonTypes.primaryButton}
              onClickHandler={toggleAddCouponModal}
              className="capitalize px-8 py-1 w-fit self-end"
            >
              <span>{t("addCoupon")}</span>
            </Button>
            <Grid
              rowData={coupons}
              columnDefination={COUPONS_TABLE_COL_DEFS}
              autoSizeStrategy={{
                type: "fitCellContents",
              }}
            />
          </div>
        </>
      )}
    </>
  );
};

export default CouponsTable;
