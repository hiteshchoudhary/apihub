import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTE_PATHS } from "./constants";
import PageLayout from "./layouts/PageLayout";
import AboutPageContainer from "./pages/about/container/AboutPageContainer";
import AdminPageContainer from "./pages/admin/container/AdminPageContainer";
import CartPageContainer from "./pages/cart/container/CartPageContainer";
import CheckoutPageContainer from "./pages/checkout/container/CheckoutPageContainer";
import HomePageContainer from "./pages/home/container/HomePageContainer";
import LoginPageContainer from "./pages/login/container/LoginPageContainer";
import ManageAccountPageContainer from "./pages/manageaccount/container/ManageAccountPageContainer";
import OrderDetailPageContainer from "./pages/orderdetail/container/OrderDetailPageContainer";
import OrdersPageContainer from "./pages/orders/container/OrdersPageContainer";
import PageNotFoundPageContainer from "./pages/pagenotfound/container/PageNotFoundPageContainer";
import PaymentFeedbackPageContainer from "./pages/paymentfeedback/container/PaymentFeedbackPageContainer";
import ProductDetailPageContainer from "./pages/productdetail/container/ProductDetailPageContainer";
import ProductsPageContainer from "./pages/products/container/ProductsPageContainer";
import ProductSearchPageContainer from "./pages/productsearch/container/ProductSearchPageContainer";
import ResetForgottenPasswordPageContainer from "./pages/resetforgottenpassword/container/ResetForgottenPasswordPageContainer";
import SignupPageContainer from "./pages/signup/container/SignupPageContainer";
import ForAdminUsers from "./protectedroutes/ForAdminUsers";
import ForLoggedInUsers from "./protectedroutes/ForLoggedInUsers";

/* All Routes */
const RoutePaths = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageLayout />}>
          <Route index element={<HomePageContainer />} />
          <Route path={ROUTE_PATHS.products} element={<ProductsPageContainer />} />
          <Route path={ROUTE_PATHS.product} element={<ProductDetailPageContainer />} />
          <Route path={ROUTE_PATHS.login} element={<LoginPageContainer />} />
          <Route path={ROUTE_PATHS.signup} element={<SignupPageContainer />} />
          <Route path={ROUTE_PATHS.productSearch} element={<ProductSearchPageContainer />} />
          <Route path={ROUTE_PATHS.resetForgottenPassword} element={<ResetForgottenPasswordPageContainer />} />
          <Route path={ROUTE_PATHS.about} element={<AboutPageContainer />} />
          <Route element={<ForLoggedInUsers />}>
            <Route path={ROUTE_PATHS.cart} element={<CartPageContainer />} />
            <Route path={ROUTE_PATHS.checkout} element={<CheckoutPageContainer />} />
            <Route path={ROUTE_PATHS.paymentFeedback} element={<PaymentFeedbackPageContainer />} />
            <Route path={ROUTE_PATHS.manageAccount} element={<ManageAccountPageContainer />} />
            <Route path={ROUTE_PATHS.orders} element={<OrdersPageContainer/>} />
            <Route path={ROUTE_PATHS.orderDetail} element={<OrderDetailPageContainer />} />
          </Route>
          <Route element={<ForAdminUsers />}>
            <Route path={ROUTE_PATHS.adminCategories} element={<AdminPageContainer />}  />
            <Route path={ROUTE_PATHS.adminProducts} element={<AdminPageContainer />} />
            <Route path={ROUTE_PATHS.adminCoupons} element={<AdminPageContainer />} />
            <Route path={ROUTE_PATHS.adminOrders} element={<AdminPageContainer />} />
            
          </Route>
          <Route path={ROUTE_PATHS.pageNotFound} element={<PageNotFoundPageContainer />} />
          <Route path="*" element={<PageNotFoundPageContainer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RoutePaths;
