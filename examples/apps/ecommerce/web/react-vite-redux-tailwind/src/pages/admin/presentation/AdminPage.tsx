import { useMemo } from "react";
import CategoriesTableContainer from "../../../components/widgets/categoriestable/container/CategoriesTableContainer";
import { useAppSelector } from "../../../store";
import { useLocation } from "react-router-dom";
import { ROUTE_PATHS } from "../../../constants";
import ProductsTableContainer from "../../../components/widgets/productstable/container/ProductsTableContainer";
import CouponsTableContainer from "../../../components/widgets/couponstable/container/CouponsTableContainer";
import OrdersTableContainer from "../../../components/widgets/orderstable/container/OrdersTableContainer";

const AdminPage = () => {
  const location = useLocation();

  const headerHeight = useAppSelector((state) => state.uiInfo.headerHeight);

  /* Setting height as total screen height - headerHeight, for AG grid */
  const pageContentHeight = useMemo(() => {
    return `${window.innerHeight - headerHeight}px`;
  }, [headerHeight]);

  return (
    <div className="px-2 lg:px-10 py-4" style={{ height: pageContentHeight }}>
      {location.pathname === ROUTE_PATHS.adminCategories ? (
        <CategoriesTableContainer />
      ) : location.pathname === ROUTE_PATHS.adminProducts ? (
        <ProductsTableContainer />
      ) : location.pathname === ROUTE_PATHS.adminCoupons ? (
        <CouponsTableContainer />
      ) : location.pathname === ROUTE_PATHS.adminOrders ? (
        <OrdersTableContainer />
      ) : (
        <></>
      )}
    </div>
  );
};

export default AdminPage;
