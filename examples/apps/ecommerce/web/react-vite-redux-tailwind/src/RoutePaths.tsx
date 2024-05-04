import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageLayout from "./layouts/PageLayout";
import HomePageContainer from "./pages/home/container/HomePageContainer";
import ProductsPageContainer from "./pages/products/container/ProductsPageContainer";
import { ROUTE_PATHS } from "./constants";
import ProductDetailPageContainer from "./pages/productdetail/container/ProductDetailPageContainer";
import LoginPageContainer from "./pages/login/container/LoginPageContainer";
import SignupPageContainer from "./pages/signup/container/SignupPageContainer";
import CartPageContainer from "./pages/cart/container/CartPageContainer";
import ForLoggedInUsers from "./protectedroutes/ForLoggedInUsers";
import CheckoutPageContainer from "./pages/checkout/container/CheckoutPageContainer";
import PaymentFeedbackPageContainer from "./pages/paymentfeedback/container/PaymentFeedbackPageContainer";
import ManageAccountPageContainer from "./pages/manageaccount/container/ManageAccountPageContainer";
import OrdersPageContainer from "./pages/orders/container/OrdersPageContainer";
import ProductSearchPageContainer from "./pages/productsearch/container/ProductSearchPageContainer";
import ResetForgottenPasswordPageContainer from "./pages/resetforgottenpassword/container/ResetForgottenPasswordPageContainer";
import PageNotFoundPageContainer from "./pages/pagenotfound/container/PageNotFoundPageContainer";
import OrderDetailPageContainer from "./pages/orderdetail/container/OrderDetailPageContainer";
import AboutPageContainer from "./pages/about/container/AboutPageContainer";

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
          <Route element={<ForLoggedInUsers />}>
            <Route path={ROUTE_PATHS.cart} element={<CartPageContainer />} />
            <Route path={ROUTE_PATHS.checkout} element={<CheckoutPageContainer />} />
            <Route path={ROUTE_PATHS.paymentFeedback} element={<PaymentFeedbackPageContainer />} />
            <Route path={ROUTE_PATHS.manageAccount} element={<ManageAccountPageContainer />} />
            <Route path={ROUTE_PATHS.orders} element={<OrdersPageContainer/>} />
            <Route path={ROUTE_PATHS.orderDetail} element={<OrderDetailPageContainer />} />
          </Route>
          <Route path={ROUTE_PATHS.about} element={<AboutPageContainer />} />
          <Route path={ROUTE_PATHS.pageNotFound} element={<PageNotFoundPageContainer />} />
          <Route path="*" element={<PageNotFoundPageContainer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RoutePaths;
