import { CustomCellRendererProps } from "ag-grid-react";
import Link from "../../../basic/Link";
import { LinkTypes, QUERY_PARAMS, ROUTE_PATHS } from "../../../../constants";
import useCustomNavigate from "../../../../hooks/useCustomNavigate";
import { createSearchParams } from "react-router-dom";

const OrderLinkCell = (props: CustomCellRendererProps) => {
  const navigate = useCustomNavigate();

  /* Navigate to the order detail page of the particular order */
  const orderIdClickHandler = () => {
    navigate({
      pathname: ROUTE_PATHS.orderDetail,
      search: createSearchParams({
        [QUERY_PARAMS.orderId]: props.value,
      }).toString(),
    });
  };
  return (
    <>
      <Link
        onClick={orderIdClickHandler}
        text={props.value}
        linkType={LinkTypes.red}
      />
    </>
  );
};

export default OrderLinkCell;
