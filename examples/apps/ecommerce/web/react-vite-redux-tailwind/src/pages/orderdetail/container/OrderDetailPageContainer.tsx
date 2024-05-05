import { useSearchParams } from "react-router-dom";
import { QUERY_PARAMS } from "../../../constants";
import { useEffect, useMemo } from "react";
import useCustomNavigate from "../../../hooks/useCustomNavigate";
import OrderDetailPage from "../presentation/OrderDetailPage";

const OrderDetailPageContainer = () => {
  const navigate = useCustomNavigate();

  const [searchParams] = useSearchParams();

  const orderId = useMemo(() => {
    return searchParams.get(QUERY_PARAMS.orderId);
  }, [searchParams]);

  useEffect(() => {
    if (!orderId) {
      navigate("/");
    }
  }, [orderId, navigate]);

  return <>{orderId && <OrderDetailPage orderId={orderId} />}</>;
};

export default OrderDetailPageContainer;
