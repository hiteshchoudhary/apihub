import {
  ColDef,
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../store";
import "../../styles/Grid.css";

interface GridProps<RowType> {
  rowData: RowType[];
  columnDefination: ColDef[];
  rowSelection?: "single" | "multiple" | undefined;
  onRowSelectionChanged?(selectedRows: Array<RowType>): void;
  autoSizeAllColumnsAfterDataUpdate?: boolean;
  autoSizeStrategy?:
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy;
}

const Grid = <RowType,>(props: GridProps<RowType>) => {
  const {
    rowData,
    columnDefination,
    autoSizeStrategy,
    rowSelection,
    onRowSelectionChanged,
    autoSizeAllColumnsAfterDataUpdate = false,
  } = props;

  const isRTL = useAppSelector((state) => state.language.isRTL);

  /* Grid ready flag: To know if grid is ready to be customized by API calls */
  const [isGridReady, setIsGridReady] = useState(false);

  const gridRef = useRef<AgGridReact>(null);

  /* On grid ready, update isGridReady state */
  const gridReadyHandler = () => {
    setIsGridReady(true);
  };

  const windowResizeHandler = useCallback(() => {
    /* If the grid is ready */
    if (isGridReady) {
      /* Calling gridApi methods according to the autoSizeStrategy */
      if (autoSizeStrategy?.type === "fitGridWidth") {
        gridRef.current!.api.sizeColumnsToFit();
      } else if (autoSizeStrategy?.type === "fitCellContents") {
        gridRef.current!.api.autoSizeAllColumns();
      }
    }
  }, [isGridReady, autoSizeStrategy]);

  /* Once row selection has changed */
  const onSelectionChanged = useCallback(() => {
    if (onRowSelectionChanged) {
      /* Pass the selected rows to the parent */
      const selectedRows = gridRef.current!.api.getSelectedRows();
      onRowSelectionChanged(selectedRows);
    }
  }, [onRowSelectionChanged]);

  /* On row data updated */
  const onRowDataUpdatedHandler = () => {
    /* If autoSizeAllColumnsAfterDataUpdate is true*/
    if (autoSizeAllColumnsAfterDataUpdate && isGridReady) {
      /**
       * Auto size all columns after .5 seconds, and this event doesn't coincide with
       * data rendered by AG Grid.
       */
      setTimeout(() => {
        gridRef.current?.api.autoSizeAllColumns();
      }, 500);
    }
  };

  useEffect(() => {
    /* Resize grid according to the passed autoSizeStrategy, resize on window resize as well */
    windowResizeHandler();
    window.addEventListener("resize", windowResizeHandler);

    /* Removing even listener */
    return () => {
      window.removeEventListener("resize", windowResizeHandler);
    };
  }, [windowResizeHandler]);

  return (
    <>
      <div className="ag-theme-quartz h-full" dir={isRTL ? "rtl" : "ltr"}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefination}
          pagination={true}
          paginationAutoPageSize={true}
          onGridReady={gridReadyHandler}
          autoSizeStrategy={autoSizeStrategy}
          suppressCellFocus={true}
          suppressMenuHide={true}
          rowSelection={rowSelection}
          onSelectionChanged={onSelectionChanged}
          onRowDataUpdated={onRowDataUpdatedHandler}
          enableRtl={isRTL}
        />
      </div>
    </>
  );
};

export default Grid;
