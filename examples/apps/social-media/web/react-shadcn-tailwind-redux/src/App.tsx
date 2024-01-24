import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { useEffect } from "react";
import { loadUser } from "./redux/slices/authSlice";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/login";
import Navbar from "./components/Navbar";
import Register from "./pages/auth/register";
import AuthRoute from "./components/auth/AuthRoute";
import NonAuthRoute from "./components/auth/NonAuthRoute";
import Home from "./pages/home";
import Sidebar from "./components/sidebar";

function App() {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user?._id || !token) {
      dispatch(loadUser());
    }
  }, []);

  return (
    <>
      <Navbar />

      <AuthRoute>
        <Sidebar />
      </AuthRoute>

      <Routes>
        <Route
          path="/"
          element={
            <AuthRoute>
              <Home />
            </AuthRoute>
          }
        />

        <Route
          path="/login"
          element={
            <NonAuthRoute>
              <Login />
            </NonAuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <NonAuthRoute>
              <Register />
            </NonAuthRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
