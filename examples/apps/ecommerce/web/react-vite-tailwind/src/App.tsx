import { Routes, Route } from "react-router-dom";
import Body from "./pages/Body";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import AddressesPage from "./pages/AddressesPage";
import UserProfilePage from "./pages/UserProfile";
import RegisterPage from "./pages/RegisterPage";
import Login from "./pages/Login";
import OrdersPage from "./pages/OrdersPage";
import PrivateRoute from "./components/routing/PrivateRoute";
import Products from "./pages/subPages/Products";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Body />}>
        {/* Define child routes within the parent route */}
        {/* Render Home component only for the root route */}
        <Route index element={<Home />} />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path="/adresses"
          element={
            <PrivateRoute>
              <AddressesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/user"
          element={
            <PrivateRoute>
              <UserProfilePage />
            </PrivateRoute>
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <OrdersPage />
            </PrivateRoute>
          }
        />
      </Route>
      <Route path="/products/:productId" element={<Products />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
